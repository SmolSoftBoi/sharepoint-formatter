export interface DebouncedTask<T> {
  schedule: (value: T) => void;
  dispose: () => void;
}

interface CreateDebouncedTaskOptions<T> {
  delayMs: number;
  onRun: (value: T) => void;
}

export const createDebouncedTask = <T>({
  delayMs,
  onRun,
}: CreateDebouncedTaskOptions<T>): DebouncedTask<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;

  return {
    schedule: (value: T) => {
      if (disposed) {
        return;
      }

      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        timer = null;
        if (disposed) {
          return;
        }
        onRun(value);
      }, delayMs);
    },
    dispose: () => {
      disposed = true;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    },
  };
};
