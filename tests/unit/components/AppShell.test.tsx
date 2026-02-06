import { act, render, screen, waitFor } from "@testing-library/react";
import { AppShell, appShellStyleConfig } from "../../../app/components/AppShell";

type MatchMediaController = MediaQueryList & {
  dispatch: (nextMatches: boolean) => void;
};

const createMatchMedia = (matches: boolean): MatchMediaController => {
  let listeners: Array<(event: MediaQueryListEvent) => void> = [];

  const mql: MatchMediaController = {
    matches,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: (_event, listener) => {
      listeners = [...listeners, listener];
    },
    removeEventListener: (_event, listener) => {
      listeners = listeners.filter((stored) => stored !== listener);
    },
    addListener: () => {},
    removeListener: () => {},
    dispatch: (nextMatches: boolean) => {
      mql.matches = nextMatches;
      const event = {
        matches: nextMatches,
        media: mql.media,
        type: "change",
      } as MediaQueryListEvent;
      listeners.forEach((listener) => {
        listener(event);
      });
    },
    dispatchEvent: () => true,
  };

  return mql;
};

describe("AppShell", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    document.documentElement.style.colorScheme = "";
  });

  it("renders the header title and subtitle", () => {
    window.matchMedia = jest.fn().mockReturnValue(createMatchMedia(false));

    render(
      <AppShell>
        <div>Body content</div>
      </AppShell>,
    );

    expect(screen.getByText("SharePoint Formatter")).toBeInTheDocument();
    expect(
      screen.getByText("Create, validate, preview, and export SharePoint list formatting JSON."),
    ).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("updates the document colour scheme on preference changes", async () => {
    const media = createMatchMedia(true);
    window.matchMedia = jest.fn().mockReturnValue(media);

    render(
      <AppShell>
        <div>Content</div>
      </AppShell>,
    );

    await waitFor(() => {
      expect(document.documentElement.style.colorScheme).toBe("dark");
    });

    act(() => {
      media.dispatch(false);
    });

    await waitFor(() => {
      expect(document.documentElement.style.colorScheme).toBe("light");
    });
  });

  it("uses a bounded main container to support pane-level scrolling", () => {
    expect(appShellStyleConfig.main).toEqual(
      expect.objectContaining({
        display: "flex",
        minHeight: 0,
        overflow: "hidden",
      }),
    );
  });
});
