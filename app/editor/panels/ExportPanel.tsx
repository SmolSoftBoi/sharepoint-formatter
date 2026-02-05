"use client";

import { useState } from "react";
import {
  Button,
  MessageBar,
  MessageBarBody,
  MessageBarIntent,
  MessageBarTitle,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  ArrowDownload24Regular,
  Code24Regular,
  Copy24Regular,
} from "@fluentui/react-icons";
import { PanelCard } from "../components/PanelCard";
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
  const styles = useStyles();
  const [status, setStatus] = useState<{
    message: string;
    intent: MessageBarIntent;
  } | null>(null);

  const handleCopy = async (content: string, label: string) => {
    try {
      await copyToClipboard(content);
      setStatus({ message: `${label} copied`, intent: "success" });
    } catch (error) {
      setStatus({
        message: error instanceof Error ? error.message : "Copy failed",
        intent: "error",
      });
    } finally {
      setTimeout(() => setStatus(null), 2000);
    }
  };

  const handleDownload = () => {
    const content = getJsonText(json);
    downloadTextFile(`formatter-${formatterTypeId}.json`, content);
    setStatus({ message: "Download started", intent: "success" });
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <PanelCard title="Export">
      <div className={styles.actions}>
        <Button
          icon={<Copy24Regular />}
          onClick={() => handleCopy(getJsonText(json), "JSON")}
        >
          Copy JSON
        </Button>
        <Button icon={<ArrowDownload24Regular />} onClick={handleDownload}>
          Download JSON
        </Button>
        <Button
          icon={<Code24Regular />}
          onClick={() =>
            handleCopy(
              getSharePointSnippetText(formatterTypeId, json),
              "SharePoint snippet",
            )
          }
        >
          Copy SharePoint Snippet
        </Button>
      </div>
      {status && (
        <MessageBar intent={status.intent}>
          <MessageBarBody>
            <MessageBarTitle>Status</MessageBarTitle>
            {status.message}
          </MessageBarBody>
        </MessageBar>
      )}
    </PanelCard>
  );
};

const useStyles = makeStyles({
  actions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))",
    gap: tokens.spacingVerticalS,
  },
});
