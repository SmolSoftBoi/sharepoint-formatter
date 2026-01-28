import { getOfflineStatus, initOfflineCache, teardownOfflineCache } from "../../app/lib/persistence/offlineCache";

describe("offline cache", () => {
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

  afterEach(() => {
    teardownOfflineCache();
  });
});
