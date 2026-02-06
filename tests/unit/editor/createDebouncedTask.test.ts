import { createDebouncedTask } from "../../../app/editor/utils/createDebouncedTask";

describe("createDebouncedTask", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("runs only the latest scheduled callback payload", () => {
    const onRun = jest.fn();
    const task = createDebouncedTask<string>({
      delayMs: 120,
      onRun,
    });

    task.schedule("first");
    task.schedule("second");

    jest.advanceTimersByTime(120);

    expect(onRun).toHaveBeenCalledTimes(1);
    expect(onRun).toHaveBeenCalledWith("second");
  });

  it("guards scheduled callbacks after dispose", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const onRun = jest.fn();
    const task = createDebouncedTask<string>({
      delayMs: 120,
      onRun,
    });

    task.schedule("pending");
    task.dispose();
    jest.advanceTimersByTime(120);

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(onRun).not.toHaveBeenCalled();
  });
});
