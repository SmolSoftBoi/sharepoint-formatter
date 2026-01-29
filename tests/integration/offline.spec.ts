import { getOfflineStatus, initOfflineCache, teardownOfflineCache } from "../../app/lib/persistence/offlineCache";
import { renderPreview } from "../../app/preview/renderer/render";
import { validateFormatterJson } from "../../app/lib/validation/validator";

describe("offline cache", () => {
  const originalOnline = window.navigator.onLine;

  beforeEach(() => {
    Object.defineProperty(window.navigator, "onLine", {
      value: false,
      configurable: true,
    });
  });

  it("tracks offline status after init", async () => {
    await initOfflineCache();
    expect(getOfflineStatus().isOnline).toBe(false);
  });

  it("supports validation and preview while offline", async () => {
    await initOfflineCache();

    const validation = validateFormatterJson("column", { elmType: "div" });
    expect(validation.valid).toBe(true);

    const preview = renderPreview({ elmType: "span", txtContent: "[$Title]" }, { Title: "Offline" });
    expect(preview.html).toContain("Offline");
  });

  afterEach(() => {
    teardownOfflineCache();
    Object.defineProperty(window.navigator, "onLine", {
      value: originalOnline,
      configurable: true,
    });
  });
});
