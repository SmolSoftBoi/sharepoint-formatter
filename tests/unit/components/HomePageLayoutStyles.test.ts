import { fireEvent } from "@testing-library/react";
import { homePageStyleConfig } from "../../../app/editor/layoutStyles";

const setOverflowMetrics = (
  element: HTMLElement,
  clientHeight: number,
  scrollHeight: number,
) => {
  Object.defineProperty(element, "clientHeight", {
    configurable: true,
    value: clientHeight,
  });
  Object.defineProperty(element, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
};

const createOverflowPane = (tagName: "aside" | "section", testId: string) => {
  const pane = document.createElement(tagName);
  pane.setAttribute("data-testid", testId);
  pane.style.overflowY = "auto";

  const filler = document.createElement("div");
  filler.style.height = "1600px";
  pane.appendChild(filler);

  return pane;
};

describe("HomePage layout styles", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("uses bounded desktop containers with independent pane scrolling", () => {
    expect(homePageStyleConfig.layout).toEqual(
      expect.objectContaining({
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        gridTemplateRows: "minmax(0, 1fr)",
      }),
    );

    expect(homePageStyleConfig.nav).toEqual(
      expect.objectContaining({
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        minHeight: 0,
      }),
    );
    expect(homePageStyleConfig.nav["& > *"]).toEqual(
      expect.objectContaining({
        flexShrink: 0,
      }),
    );

    expect(homePageStyleConfig.preview).toEqual(
      expect.objectContaining({
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        minHeight: 0,
      }),
    );
    expect(homePageStyleConfig.preview["& > *"]).toEqual(
      expect.objectContaining({
        flexShrink: 0,
      }),
    );
  });

  it("keeps stacked mobile layout desktop-focused for pane scrolling", () => {
    const mobileLayout = homePageStyleConfig.layout["@media (max-width: 960px)"];
    const mobileNav = homePageStyleConfig.nav["@media (max-width: 960px)"];
    const mobilePreview = homePageStyleConfig.preview["@media (max-width: 960px)"];

    expect(mobileLayout).toEqual(
      expect.objectContaining({
        flex: "none",
        gridTemplateColumns: "minmax(0, 1fr)",
        gridTemplateRows: "auto",
        overflowY: "auto",
      }),
    );

    expect(mobileNav).toEqual(
      expect.objectContaining({
        overflowY: "visible",
      }),
    );

    expect(mobilePreview).toEqual(
      expect.objectContaining({
        overflowY: "visible",
      }),
    );
  });

  it("keeps navigation and preview scrolling isolated when both panes overflow", () => {
    const layout = document.createElement("div");
    layout.style.height = "240px";
    layout.style.overflow = "hidden";

    const navPane = createOverflowPane("aside", "editor-nav");
    const previewPane = createOverflowPane("section", "editor-preview");

    layout.append(navPane, previewPane);
    document.body.appendChild(layout);

    setOverflowMetrics(navPane, 240, 1600);
    setOverflowMetrics(previewPane, 240, 1800);

    expect(navPane.scrollHeight).toBeGreaterThan(navPane.clientHeight);
    expect(previewPane.scrollHeight).toBeGreaterThan(previewPane.clientHeight);

    navPane.scrollTop = 220;
    fireEvent.scroll(navPane);

    expect(navPane.scrollTop).toBe(220);
    expect(previewPane.scrollTop).toBe(0);

    previewPane.scrollTop = 360;
    fireEvent.scroll(previewPane);

    expect(previewPane.scrollTop).toBe(360);
    expect(navPane.scrollTop).toBe(220);
  });
});
