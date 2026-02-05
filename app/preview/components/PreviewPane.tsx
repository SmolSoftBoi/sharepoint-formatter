"use client";

import createDOMPurify from "dompurify";
import { useMemo } from "react";
import {
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { PanelCard } from "../../editor/components/PanelCard";
import { renderPreview } from "../renderer/render";

interface PreviewPaneProps {
  json: unknown;
  sampleData: Record<string, unknown>;
}

export const PreviewPane = ({ json, sampleData }: PreviewPaneProps) => {
  const styles = useStyles();
  const { html, warnings } = renderPreview(json, sampleData);
  const purifier = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return createDOMPurify(window);
  }, []);
  const safeHtml = purifier ? purifier.sanitize(html) : "";

  return (
    <PanelCard title="Preview">
      {warnings.length > 0 && (
        <MessageBar intent="warning">
          <MessageBarBody>
            <MessageBarTitle>Preview warnings</MessageBarTitle>
            <ul className={styles.warnings}>
              {warnings.map((warning, index) => (
                <li key={`${index}-${warning}`}>{warning}</li>
              ))}
            </ul>
          </MessageBarBody>
        </MessageBar>
      )}
      <div
        className={styles.preview}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </PanelCard>
  );
};

const useStyles = makeStyles({
  preview: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    padding: tokens.spacingHorizontalM,
    minHeight: "200px",
  },
  warnings: {
    margin: 0,
    paddingLeft: tokens.spacingHorizontalL,
    display: "grid",
    gap: tokens.spacingVerticalXXS,
  },
});
