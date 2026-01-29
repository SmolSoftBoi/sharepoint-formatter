import { getOfflineStatus, initOfflineCache, teardownOfflineCache } from "../../app/lib/persistence/offlineCache";
import { renderPreview } from "../../app/preview/renderer/render";
import { validateFormatterJson } from "../../app/lib/validation/validator";

type WindowCaches = Window & { caches?: CacheStorage };

describe("offline cache", () => {
  let originalOnline: boolean;

  beforeEach(() => {
    originalOnline = window.navigator.onLine;
    Object.defineProperty(window.navigator, "onLine", {
      value: false,
      configurable: true,
    });
    expect(window.navigator.onLine).toBe(false);
  });

  it("tracks offline status after init", async () => {
    await initOfflineCache();
    expect(getOfflineStatus().isOnline).toBe(false);
  });

  it("supports validation and preview while offline", async () => {
    const windowWithCaches = window as WindowCaches;
    const originalCaches = windowWithCaches.caches;
    const cacheMock = {
      add: jest.fn().mockRejectedValue(new Error("Network down")),
      addAll: jest.fn().mockRejectedValue(new Error("Network down")),
      delete: jest.fn().mockResolvedValue(false),
      keys: jest.fn().mockResolvedValue([]),
      match: jest.fn().mockResolvedValue(undefined),
      put: jest.fn().mockResolvedValue(undefined),
    } as unknown as Cache;

    windowWithCaches.caches = {
      delete: jest.fn().mockResolvedValue(false),
      has: jest.fn().mockResolvedValue(false),
      keys: jest.fn().mockResolvedValue([]),
      match: jest.fn().mockResolvedValue(undefined),
      open: jest.fn().mockResolvedValue(cacheMock),
    } as unknown as CacheStorage;

    await initOfflineCache();

    const validation = validateFormatterJson("column", { elmType: "div" });
    expect(validation.valid).toBe(true);

    const preview = renderPreview({ elmType: "span", txtContent: "[$Title]" }, { Title: "Offline" });
    expect(preview.html).toContain("Offline");

    windowWithCaches.caches = originalCaches;
  });

  afterEach(() => {
    teardownOfflineCache();
    Object.defineProperty(window.navigator, "onLine", {
      value: originalOnline,
      configurable: true,
    });
  });
});
