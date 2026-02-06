import { act, render, screen } from "@testing-library/react";
import { OfflineStatus } from "../../../app/editor/components/OfflineStatus";
import {
  initOfflineCache,
  subscribeOfflineStatus,
  teardownOfflineCache,
} from "../../../app/lib/persistence/offlineCache";

type SubscribeFn = typeof subscribeOfflineStatus;

type SubscribeArgs = Parameters<SubscribeFn>;

type SubscribeListener = SubscribeArgs[0];

const mockedOfflineCache = {
  initOfflineCache: initOfflineCache as jest.MockedFunction<typeof initOfflineCache>,
  subscribeOfflineStatus:
    subscribeOfflineStatus as jest.MockedFunction<typeof subscribeOfflineStatus>,
  teardownOfflineCache: teardownOfflineCache as jest.MockedFunction<typeof teardownOfflineCache>,
};

jest.mock("../../../app/lib/persistence/offlineCache", () => ({
  initOfflineCache: jest.fn(),
  subscribeOfflineStatus: jest.fn(),
  teardownOfflineCache: jest.fn(),
}));

describe("OfflineStatus", () => {
  const { initOfflineCache: initOfflineCacheMock } = mockedOfflineCache;
  const { subscribeOfflineStatus: subscribeOfflineStatusMock } = mockedOfflineCache;
  const { teardownOfflineCache: teardownOfflineCacheMock } = mockedOfflineCache;

  const mockStatusNotification = (nextStatus: boolean) => {
    let listener: SubscribeListener | null = null;

    subscribeOfflineStatusMock.mockImplementation((nextListener: SubscribeListener) => {
      listener = nextListener;
      return jest.fn();
    });

    initOfflineCacheMock.mockImplementation(() => {
      if (listener) {
        act(() => {
          listener(nextStatus);
        });
      }
    });
  };

  beforeEach(() => {
    subscribeOfflineStatusMock.mockImplementation(() => jest.fn());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("shows a checking state before receiving the connectivity status", () => {
    render(<OfflineStatus />);

    expect(screen.getByText("Checking status")).toBeInTheDocument();
    expect(screen.getByText("Detecting connectivity state.")).toBeInTheDocument();
    expect(initOfflineCacheMock).toHaveBeenCalledTimes(1);
  });

  it("renders the online state when the listener reports true", () => {
    mockStatusNotification(true);

    render(<OfflineStatus />);

    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByText("Offline cache is ready.")).toBeInTheDocument();
  });

  it("renders the offline state when the listener reports false", () => {
    mockStatusNotification(false);

    render(<OfflineStatus />);

    expect(screen.getByText("Offline")).toBeInTheDocument();
    expect(screen.getByText("Working from local cache only.")).toBeInTheDocument();
  });

  it("unsubscribes and tears down the cache on unmount", () => {
    const unsubscribe = jest.fn();
    subscribeOfflineStatusMock.mockImplementation(() => unsubscribe);

    const { unmount } = render(<OfflineStatus />);
    unsubscribe.mockClear();
    teardownOfflineCacheMock.mockClear();

    expect(unsubscribe).toHaveBeenCalledTimes(0);
    expect(teardownOfflineCacheMock).toHaveBeenCalledTimes(0);

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(teardownOfflineCacheMock).toHaveBeenCalledTimes(1);
  });
});
