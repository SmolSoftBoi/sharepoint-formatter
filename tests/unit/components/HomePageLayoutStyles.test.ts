import { homePageStyleConfig } from "../../../app/editor/layoutStyles";

describe("HomePage layout styles", () => {
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
});
