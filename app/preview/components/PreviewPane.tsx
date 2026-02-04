"use client";

import createDOMPurify from "dompurify";
import { useMemo } from "react";
import { renderPreview } from "../renderer/render";

interface PreviewPaneProps {
  json: unknown;
  sampleData: Record<string, unknown>;
}

export const PreviewPane = ({ json, sampleData }: PreviewPaneProps) => {
  const { html, warnings } = renderPreview(json, sampleData);
  const purifier = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return createDOMPurify(window);
  }, []);
  const safeHtml = purifier ? purifier.sanitize(html) : "";

  return (
    <section>
      <h2>Preview</h2>
      {warnings.length > 0 && (
        <ul>
          {warnings.map((warning, index) => (
            <li key={`${index}-${warning}`}>{warning}</li>
          ))}
        </ul>
      )}
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </section>
  );
};
