import { homePageStyleConfig } from "../../../app/editor/layoutStyles";

const createOverflowPane = (
  tagName: "aside" | "section",
  testId: string,
  overflowY: string,
) => {
  const pane = document.createElement(tagName);
  pane.setAttribute("data-testid", testId);
  pane.style.overflowY = overflowY;

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
        overflowX: "hidden",
        overflowY: "hidden",
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

  it("documents pane overflow style wiring for scroll isolation", () => {
    // jsdom does not implement real layout/scroll rendering. This contract test
    // verifies we wire production overflow styles to both panes; browser-level
    // scroll isolation should be validated with E2E coverage.
    const layout = document.createElement("div");
    Object.assign(layout.style, {
      height: "240px",
      overflowX: String(homePageStyleConfig.layout.overflowX),
      overflowY: String(homePageStyleConfig.layout.overflowY),
    });

    const navPane = createOverflowPane(
      "aside",
      "editor-nav",
      String(homePageStyleConfig.nav.overflowY),
    );
    const previewPane = createOverflowPane(
      "section",
      "editor-preview",
      String(homePageStyleConfig.preview.overflowY),
    );

    layout.append(navPane, previewPane);
    document.body.appendChild(layout);

    expect(layout.style.overflowX).toBe("hidden");
    expect(layout.style.overflowY).toBe("hidden");
    expect(navPane.style.overflowY).toBe("auto");
    expect(previewPane.style.overflowY).toBe("auto");
    expect(navPane.firstElementChild).not.toBeNull();
    expect(previewPane.firstElementChild).not.toBeNull();
  });
});
