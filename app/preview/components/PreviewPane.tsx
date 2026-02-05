"use client";

import createDOMPurify from "dompurify";
import { useMemo } from "react";
import {
  CardPreview,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { PanelCard } from "../../editor/components/PanelCard";
import { renderPreview } from "../renderer/render";
import { withPerfMeasure } from "../../lib/perf/perf";

interface PreviewPaneProps {
  json: unknown;
  sampleData: Record<string, unknown>;
}

const normaliseSanitisedHtml = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }
  if (value instanceof Node) {
    const container = document.createElement("div");
    container.append(value.cloneNode(true));
    return container.innerHTML;
  }
  return String(value ?? "");
};

export const PreviewPane = ({ json, sampleData }: PreviewPaneProps) => {
  const styles = useStyles();
  const { html, warnings } = useMemo(
    () => withPerfMeasure("spfmt:preview:render", () => renderPreview(json, sampleData)),
    [json, sampleData],
  );
  const purifier = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return createDOMPurify(window);
  }, []);
  const safeHtml = useMemo(() => {
    if (!purifier) {
      return "";
    }
    return withPerfMeasure("spfmt:preview:sanitize", () =>
      normaliseSanitisedHtml(purifier.sanitize(html)),
    );
  }, [html, purifier]);

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
      <CardPreview>
        <div
          className={styles.preview}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </CardPreview>
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
