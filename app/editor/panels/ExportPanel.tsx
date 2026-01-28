"use client";

import { useState } from "react";
import { FormatterTypeId } from "../../lib/formatters/types";
import {
  copyToClipboard,
  downloadTextFile,
  getJsonText,
  getSharePointSnippetText,
} from "../../lib/export/exporters";

interface ExportPanelProps {
  formatterTypeId: FormatterTypeId;
  json: unknown;
}

export const ExportPanel = ({ formatterTypeId, json }: ExportPanelProps) => {
  const [status, setStatus] = useState<string | null>(null);

  const handleCopy = async (content: string, label: string) => {
    try {
      await copyToClipboard(content);
      setStatus(`${label} copied`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Copy failed");
    } finally {
      setTimeout(() => setStatus(null), 2000);
    }
  };

  const handleDownload = () => {
    const content = getJsonText(json);
    downloadTextFile(`formatter-${formatterTypeId}.json`, content);
    setStatus("Download started");
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <section>
      <h2>Export</h2>
      <div className="export-actions">
        <button
          type="button"
          onClick={() => handleCopy(getJsonText(json), "JSON")}
        >
          Copy JSON
        </button>
        <button type="button" onClick={handleDownload}>
          Download JSON
        </button>
        <button
          type="button"
          onClick={() =>
            handleCopy(
              getSharePointSnippetText(formatterTypeId, json),
              "SharePoint snippet",
            )
          }
        >
          Copy SharePoint Snippet
        </button>
      </div>
      {status && <p>{status}</p>}
    </section>
  );
};
