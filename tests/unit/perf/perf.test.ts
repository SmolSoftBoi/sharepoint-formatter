describe("withPerfMeasure", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalPerformance = globalThis.performance;

  interface PerformanceMock {
    mark: jest.Mock<void, [string]>;
    measure: jest.Mock<void, [string, string, string]>;
    clearMarks: jest.Mock<void, [string]>;
    clearMeasures: jest.Mock<void, [string]>;
  }

  const installPerformanceMock = (): PerformanceMock => {
    const performanceMock: PerformanceMock = {
      mark: jest.fn(),
      measure: jest.fn(),
      clearMarks: jest.fn(),
      clearMeasures: jest.fn(),
    };

    Object.defineProperty(globalThis, "performance", {
      configurable: true,
      writable: true,
      value: performanceMock as unknown as Performance,
    });

    return performanceMock;
  };

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    Object.defineProperty(globalThis, "performance", {
      configurable: true,
      writable: true,
      value: originalPerformance,
    });
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("records marks and measure names in non-production environments", async () => {
    process.env.NODE_ENV = "test";
    const performanceMock = installPerformanceMock();

    const { withPerfMeasure } = await import("../../../app/lib/perf/perf");
    const result = withPerfMeasure("spfmt:test", () => "ok");

    expect(result).toBe("ok");
    expect(performanceMock.mark).toHaveBeenNthCalledWith(1, "spfmt:test:start:0");
    expect(performanceMock.mark).toHaveBeenNthCalledWith(2, "spfmt:test:end:0");
    expect(performanceMock.measure).toHaveBeenCalledWith(
      "spfmt:test",
      "spfmt:test:start:0",
      "spfmt:test:end:0",
    );
    expect(performanceMock.clearMeasures).toHaveBeenCalledWith("spfmt:test");
    expect(performanceMock.clearMarks).toHaveBeenCalledWith("spfmt:test:start:0");
    expect(performanceMock.clearMarks).toHaveBeenCalledWith("spfmt:test:end:0");
  });

  it("skips instrumentation in production", async () => {
    process.env.NODE_ENV = "production";
    const performanceMock = installPerformanceMock();

    const { withPerfMeasure } = await import("../../../app/lib/perf/perf");
    const result = withPerfMeasure("spfmt:test", () => 42);

    expect(result).toBe(42);
    expect(performanceMock.mark).not.toHaveBeenCalled();
    expect(performanceMock.measure).not.toHaveBeenCalled();
    expect(performanceMock.clearMeasures).not.toHaveBeenCalled();
  });

  it("skips instrumentation when required performance APIs are missing", async () => {
    process.env.NODE_ENV = "test";
    const incompletePerformanceMock = {
      mark: jest.fn(),
      measure: jest.fn(),
      clearMarks: jest.fn(),
    };
    Object.defineProperty(globalThis, "performance", {
      configurable: true,
      writable: true,
      value: incompletePerformanceMock as unknown as Performance,
    });

    const { withPerfMeasure } = await import("../../../app/lib/perf/perf");
    const result = withPerfMeasure("spfmt:test", () => "ok");

    expect(result).toBe("ok");
    expect(incompletePerformanceMock.mark).not.toHaveBeenCalled();
    expect(incompletePerformanceMock.measure).not.toHaveBeenCalled();
    expect(incompletePerformanceMock.clearMarks).not.toHaveBeenCalled();
  });

  it("skips instrumentation when performance is fully unavailable", async () => {
    process.env.NODE_ENV = "test";
    Object.defineProperty(globalThis, "performance", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    const { withPerfMeasure } = await import("../../../app/lib/perf/perf");
    const result = withPerfMeasure("spfmt:test", () => "ok");

    expect(result).toBe("ok");
  });

  it("still measures when the wrapped callback throws", async () => {
    process.env.NODE_ENV = "test";
    const performanceMock = installPerformanceMock();

    const { withPerfMeasure } = await import("../../../app/lib/perf/perf");
    const error = new Error("boom");

    expect(() => withPerfMeasure("spfmt:test", () => {
      throw error;
    })).toThrow("boom");
    expect(performanceMock.mark).toHaveBeenNthCalledWith(1, "spfmt:test:start:0");
    expect(performanceMock.mark).toHaveBeenNthCalledWith(2, "spfmt:test:end:0");
    expect(performanceMock.measure).toHaveBeenCalledWith(
      "spfmt:test",
      "spfmt:test:start:0",
      "spfmt:test:end:0",
    );
    expect(performanceMock.clearMeasures).toHaveBeenCalledWith("spfmt:test");
    expect(performanceMock.clearMarks).toHaveBeenCalledWith("spfmt:test:start:0");
    expect(performanceMock.clearMarks).toHaveBeenCalledWith("spfmt:test:end:0");
  });

  it("rolls over sequence ids using modulo to avoid unbounded growth", async () => {
    process.env.NODE_ENV = "test";
    const performanceMock = installPerformanceMock();

    const { PERF_MEASURE_SEQUENCE_MODULO, withPerfMeasure } = await import("../../../app/lib/perf/perf");

    for (let index = 0; index < PERF_MEASURE_SEQUENCE_MODULO + 2; index += 1) {
      withPerfMeasure("spfmt:rollover", () => index);
    }

    const startMarkNames = performanceMock.mark.mock.calls
      .map(([markName]) => String(markName))
      .filter((markName) => markName.startsWith("spfmt:rollover:start:"));

    expect(startMarkNames[0]).toBe("spfmt:rollover:start:0");
    expect(startMarkNames[PERF_MEASURE_SEQUENCE_MODULO]).toBe("spfmt:rollover:start:0");
    expect(startMarkNames[PERF_MEASURE_SEQUENCE_MODULO + 1]).toBe("spfmt:rollover:start:1");
    expect(performanceMock.clearMeasures).toHaveBeenCalledTimes(2);
    expect(performanceMock.clearMeasures).toHaveBeenNthCalledWith(1, "spfmt:rollover");
    expect(performanceMock.clearMeasures).toHaveBeenNthCalledWith(2, "spfmt:rollover");
  });

  it("clears each seen measure name when the sequence rolls over", async () => {
    process.env.NODE_ENV = "test";
    const performanceMock = installPerformanceMock();

    const { PERF_MEASURE_SEQUENCE_MODULO, withPerfMeasure } = await import("../../../app/lib/perf/perf");

    withPerfMeasure("spfmt:rare", () => 1);
    withPerfMeasure("spfmt:hot", () => 2);

    for (let index = 0; index < PERF_MEASURE_SEQUENCE_MODULO - 2; index += 1) {
      withPerfMeasure("spfmt:hot", () => index);
    }
    withPerfMeasure("spfmt:hot", () => 3);

    expect(performanceMock.clearMeasures).toHaveBeenCalledTimes(3);
    expect(performanceMock.clearMeasures).toHaveBeenNthCalledWith(1, "spfmt:rare");
    expect(performanceMock.clearMeasures).toHaveBeenNthCalledWith(2, "spfmt:rare");
    expect(performanceMock.clearMeasures).toHaveBeenNthCalledWith(3, "spfmt:hot");
  });
});
