import { type GriffelStyle, tokens } from "@fluentui/react-components";

type HomePageStyleSlots = "layout" | "nav" | "preview";

export const homePageStyleConfig: Record<HomePageStyleSlots, GriffelStyle> = {
  layout: {
    display: "grid",
    flex: 1,
    gridTemplateColumns: "minmax(0, 320px) minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr)",
    gap: 0,
    alignItems: "stretch",
    minHeight: 0,
    overflowX: "hidden",
    overflowY: "hidden",
    "@media (max-width: 960px)": {
      flex: "none",
      gridTemplateColumns: "minmax(0, 1fr)",
      gridTemplateRows: "auto",
      gap: tokens.spacingVerticalL,
      overflowY: "auto",
    },
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    padding: [tokens.spacingVerticalM, tokens.spacingHorizontalL],
    backgroundColor: tokens.colorNeutralBackground4,
    borderRightStyle: "solid",
    borderRightWidth: tokens.strokeWidthThin,
    borderRightColor: tokens.colorNeutralStroke4,
    overflowY: "auto",
    minHeight: 0,
    // Keep pane children at intrinsic height so overflow becomes scrollable
    // instead of compressing panel content inside the desktop split layout.
    "& > *": {
      flexShrink: 0,
    },
    "@media (max-width: 960px)": {
      overflowY: "visible",
      minHeight: "auto",
      borderRightStyle: "none",
      borderRightWidth: 0,
    },
  },
  preview: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    padding: [tokens.spacingVerticalM, tokens.spacingHorizontalL],
    backgroundColor: tokens.colorNeutralBackground2,
    overflowY: "auto",
    minHeight: 0,
    // Match nav behaviour so preview content also overflows and scrolls.
    "& > *": {
      flexShrink: 0,
    },
    "@media (max-width: 960px)": {
      overflowY: "visible",
      minHeight: "auto",
    },
  },
};
