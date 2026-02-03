type OfflineListener = (isOnline: boolean) => void;

const listeners = new Set<OfflineListener>();
let isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
let initialized = false;

const notify = () => {
  listeners.forEach((listener) => {
    listener(isOnline);
  });
};

export const getOfflineStatus = () => ({ isOnline });

export const subscribeOfflineStatus = (listener: OfflineListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const handleOnline = () => {
  isOnline = true;
  notify();
};

const handleOffline = () => {
  isOnline = false;
  notify();
};

export const initOfflineCache = async () => {
  if (typeof window === "undefined") {
    return;
  }
  if (initialized) {
    return;
  }
  initialized = true;

  isOnline = navigator.onLine;
  notify();

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  try {
    if ("caches" in window) {
      const cache = await caches.open("sharepoint-formatter-v1");
      await cache.addAll(["/", "/favicon.ico"]);
    }
  } catch {
    // best-effort caching
  }
};

export const teardownOfflineCache = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (!initialized) {
    return;
  }
  initialized = false;
  listeners.clear();

  window.removeEventListener("online", handleOnline);
  window.removeEventListener("offline", handleOffline);
};
