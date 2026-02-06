import { createDebouncedTask } from "../../../app/editor/utils/createDebouncedTask";
import { withPerfMeasure } from "../../../app/lib/perf/perf";
import { sanitizeJsonString } from "../../../app/lib/validation/sanitizeJson";

const PARSE_MEASURE_NAME = "spfmt:json:parse";

interface MeasureStats {
  count: number;
  totalDurationMs: number;
}

type MeasureEntry = PerformanceEntry;

type PerformanceProbe = Pick<
  Performance,
  "mark" | "measure" | "clearMarks" | "clearMeasures" | "getEntriesByType"
>;

const createPerformanceProbe = (): PerformanceProbe => {
  const marks = new Map<string, number>();
  let measures: MeasureEntry[] = [];

  const nowMs = () => Number(process.hrtime.bigint()) / 1_000_000;

  return {
    mark: (markName: string) => {
      marks.set(markName, nowMs());
    },
    measure: (measureName: string, startMark: string, endMark: string) => {
      const start = marks.get(startMark);
      const end = marks.get(endMark);
      if (start === undefined || end === undefined) {
        return;
      }
      measures.push({
        name: measureName,
        entryType: "measure",
        startTime: start,
        duration: Math.max(0, end - start),
        toJSON: () => ({ name: measureName, entryType: "measure", startTime: start, duration: Math.max(0, end - start) }),
      } as MeasureEntry);
    },
    clearMarks: (markName?: string) => {
      if (typeof markName === "string") {
        marks.delete(markName);
        return;
      }
      marks.clear();
    },
    clearMeasures: (measureName?: string) => {
      if (typeof measureName === "string") {
        measures = measures.filter((measure) => measure.name !== measureName);
        return;
      }
      measures = [];
    },
    getEntriesByType: (type: string): PerformanceEntryList => {
      if (type !== "measure") {
        return [];
      }
      return [...measures];
    },
  };
};

const buildEditPayload = (index: number): string =>
  JSON.stringify({
    elmType: "div",
    txtContent: `label-${index}`,
    children: Array.from({ length: 120 }, (_value, childIndex) => ({
      elmType: "span",
      txtContent: `child-${index}-${childIndex}`,
      style: {
        color: childIndex % 2 === 0 ? "#ffffff" : "#000000",
        fontWeight: childIndex % 3 === 0 ? "bold" : "normal",
      },
    })),
  });

const clearParseMeasures = (): void => {
  performance.clearMarks();
  performance.clearMeasures(PARSE_MEASURE_NAME);
};

const getParseMeasureStats = (): MeasureStats => {
  const entries = performance
    .getEntriesByType("measure")
    .filter((entry) => entry.name === PARSE_MEASURE_NAME);

  return {
    count: entries.length,
    totalDurationMs: entries.reduce((total, entry) => total + entry.duration, 0),
  };
};

const measuredSanitize = (raw: string): void => {
  withPerfMeasure(PARSE_MEASURE_NAME, () => sanitizeJsonString(raw));
};

const runImmediateParseScenario = (payloads: string[]): MeasureStats => {
  clearParseMeasures();
  payloads.forEach((payload) => {
    measuredSanitize(payload);
  });
  return getParseMeasureStats();
};

const runDebouncedParseScenario = (
  payloads: string[],
  debounceMs: number,
  cadenceMs: number,
): MeasureStats => {
  clearParseMeasures();
  jest.useFakeTimers({ doNotFake: ["performance"] });

  try {
    const task = createDebouncedTask<string>({
      delayMs: debounceMs,
      onRun: (raw) => {
        measuredSanitize(raw);
      },
    });

    payloads.forEach((payload) => {
      task.schedule(payload);
      jest.advanceTimersByTime(cadenceMs);
    });

    jest.advanceTimersByTime(debounceMs);
    task.dispose();

    return getParseMeasureStats();
  } finally {
    jest.useRealTimers();
  }
};

const runDebouncedScenarioWithPause = (
  payloads: string[],
  debounceMs: number,
  prePauseCadenceMs: number,
  pauseMs: number,
): MeasureStats => {
  clearParseMeasures();
  jest.useFakeTimers({ doNotFake: ["performance"] });

  try {
    const task = createDebouncedTask<string>({
      delayMs: debounceMs,
      onRun: (raw) => {
        measuredSanitize(raw);
      },
    });

    const midpoint = Math.floor(payloads.length / 2);
    payloads.forEach((payload, index) => {
      task.schedule(payload);
      if (index === midpoint) {
        jest.advanceTimersByTime(pauseMs);
      } else {
        jest.advanceTimersByTime(prePauseCadenceMs);
      }
    });

    jest.advanceTimersByTime(debounceMs);
    task.dispose();

    return getParseMeasureStats();
  } finally {
    jest.useRealTimers();
  }
};

describe("json parse profiling", () => {
  const originalPerformance = globalThis.performance;

  beforeEach(() => {
    Object.defineProperty(globalThis, "performance", {
      configurable: true,
      writable: true,
      value: createPerformanceProbe() as Performance,
    });
  });

  afterEach(() => {
    clearParseMeasures();
    Object.defineProperty(globalThis, "performance", {
      configurable: true,
      writable: true,
      value: originalPerformance,
    });
  });

  it("shows lower measured parse cost for debounced burst edits", () => {
    const payloads = Array.from({ length: 16 }, (_value, index) =>
      buildEditPayload(index),
    );

    const immediateStats = runImmediateParseScenario(payloads);
    const debouncedStats = runDebouncedParseScenario(payloads, 170, 70);

    expect(immediateStats.count).toBe(payloads.length);
    expect(debouncedStats.count).toBe(1);
    expect(debouncedStats.totalDurationMs).toBeLessThanOrEqual(
      immediateStats.totalDurationMs,
    );
  });

  it("keeps 170ms debounce from over-triggering across short typing pauses", () => {
    const payloads = Array.from({ length: 10 }, (_value, index) =>
      buildEditPayload(index),
    );

    const shortWindowStats = runDebouncedScenarioWithPause(payloads, 120, 70, 150);
    const tunedWindowStats = runDebouncedScenarioWithPause(payloads, 170, 70, 150);

    expect(shortWindowStats.count).toBeGreaterThan(tunedWindowStats.count);
    expect(tunedWindowStats.count).toBe(1);
  });
});
