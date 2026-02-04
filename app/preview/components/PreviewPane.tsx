"use client";

import DOMPurify from "dompurify";
import { renderPreview } from "../renderer/render";

interface PreviewPaneProps {
  json: unknown;
  sampleData: Record<string, unknown>;
}

export const PreviewPane = ({ json, sampleData }: PreviewPaneProps) => {
  const { html, warnings } = renderPreview(json, sampleData);
  const safeHtml = DOMPurify.sanitize(html);

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
      <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
    </section>
  );
};
