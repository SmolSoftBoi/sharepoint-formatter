let measureSequence = 0;
export const PERF_MEASURE_SEQUENCE_MODULO = 10_000;

type PerfApi = Pick<Performance, "mark" | "measure" | "clearMarks" | "clearMeasures">;

const getPerfApi = (): PerfApi | null => {
  // Restrict instrumentation to browser-like runtimes and non-production builds.
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  const perf = globalThis.performance;
  if (
    perf === undefined ||
    typeof perf.mark !== "function" ||
    typeof perf.measure !== "function" ||
    typeof perf.clearMarks !== "function" ||
    typeof perf.clearMeasures !== "function"
  ) {
    return null;
  }

  return perf;
};

export const withPerfMeasure = <T>(name: string, fn: () => T): T => {
  const perf = getPerfApi();
  if (perf === null) {
    return fn();
  }

  const id = measureSequence;
  // Keep the sequence bounded in long-lived sessions and intentionally reset at rollover.
  measureSequence = (measureSequence + 1) % PERF_MEASURE_SEQUENCE_MODULO;
  const startMark = `${name}:start:${id}`;
  const endMark = `${name}:end:${id}`;

  if (id === 0) {
    perf.clearMeasures(name);
  }

  perf.mark(startMark);
  try {
    return fn();
  } finally {
    perf.mark(endMark);
    perf.measure(name, startMark, endMark);
    perf.clearMarks(startMark);
    perf.clearMarks(endMark);
  }
};
