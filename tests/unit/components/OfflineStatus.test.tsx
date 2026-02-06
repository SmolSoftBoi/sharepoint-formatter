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

jest.mock("../../../app/lib/persistence/offlineCache", () => ({
  initOfflineCache: jest.fn(),
  subscribeOfflineStatus: jest.fn(),
  teardownOfflineCache: jest.fn(),
}));

describe("OfflineStatus", () => {
  const initOfflineCacheMock = initOfflineCache as jest.MockedFunction<typeof initOfflineCache>;
  const subscribeOfflineStatusMock =
    subscribeOfflineStatus as jest.MockedFunction<typeof subscribeOfflineStatus>;
  const teardownOfflineCacheMock =
    teardownOfflineCache as jest.MockedFunction<typeof teardownOfflineCache>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows a checking state before receiving the connectivity status", () => {
    subscribeOfflineStatusMock.mockImplementation(() => jest.fn());

    render(<OfflineStatus />);

    expect(screen.getByText("Checking status")).toBeInTheDocument();
    expect(screen.getByText("Detecting connectivity state.")).toBeInTheDocument();
    expect(initOfflineCacheMock).toHaveBeenCalledTimes(1);
  });

  it("renders the online state when the listener reports true", () => {
    subscribeOfflineStatusMock.mockImplementation((listener: SubscribeListener) => {
      act(() => {
        listener(true);
      });
      return jest.fn();
    });

    render(<OfflineStatus />);

    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByText("Offline cache is ready.")).toBeInTheDocument();
  });

  it("renders the offline state when the listener reports false", () => {
    subscribeOfflineStatusMock.mockImplementation((listener: SubscribeListener) => {
      act(() => {
        listener(false);
      });
      return jest.fn();
    });

    render(<OfflineStatus />);

    expect(screen.getByText("Offline")).toBeInTheDocument();
    expect(screen.getByText("Working from local cache only.")).toBeInTheDocument();
  });

  it("unsubscribes and tears down the cache on unmount", () => {
    const unsubscribe = jest.fn();
    subscribeOfflineStatusMock.mockImplementation(() => unsubscribe);

    const { unmount } = render(<OfflineStatus />);

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(teardownOfflineCacheMock).toHaveBeenCalledTimes(1);
  });
});
