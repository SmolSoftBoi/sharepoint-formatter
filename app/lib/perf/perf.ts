let measureSequence = 0;

const isPerfEnabled = () => {
  // Avoid shipping instrumentation overhead in production builds.
  return (
    process.env.NODE_ENV !== "production" &&
    typeof performance !== "undefined" &&
    typeof performance.mark === "function" &&
    typeof performance.measure === "function"
  );
};

export const withPerfMeasure = <T>(name: string, fn: () => T): T => {
  if (!isPerfEnabled()) {
    return fn();
  }

  const id = measureSequence++;
  const startMark = `${name}:start:${id}`;
  const endMark = `${name}:end:${id}`;

  performance.mark(startMark);
  try {
    return fn();
  } finally {
    performance.mark(endMark);
    performance.measure(name, startMark, endMark);
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
  }
};

