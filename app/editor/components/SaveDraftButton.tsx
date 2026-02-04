"use client";

import { useState } from "react";
import {
  Button,
  Caption1,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { Save24Regular } from "@fluentui/react-icons";
import { PanelCard } from "./PanelCard";
import { saveDraft } from "../../lib/persistence/storage";
import { setDraftId, useEditorState } from "../state/editorStore";

const createDraftId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `draft-${Date.now()}`;
};

export const SaveDraftButton = () => {
  const editorState = useEditorState();
  const styles = useStyles();
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = () => {
    const now = new Date();
    const existingDraftId = editorState.draftId;
    const draftId = existingDraftId ?? createDraftId();

    if (!existingDraftId) {
      setDraftId(draftId);
    }

    saveDraft({
      metadata: {
        id: draftId,
        name: `Draft ${now.toLocaleString()}`,
        formatterTypeId: editorState.formatterTypeId,
        updatedAt: now.toISOString(),
      },
      json: editorState.json,
      sampleData: editorState.sampleData,
    });

    setStatus("Draft saved");
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <PanelCard title="Drafts">
      <Button icon={<Save24Regular />} onClick={handleSave}>
        Save Draft
      </Button>
      {status && (
        <Caption1 role="status" className={styles.status}>
          {status}
        </Caption1>
      )}
    </PanelCard>
  );
};

const useStyles = makeStyles({
  status: {
    color: tokens.colorNeutralForeground3,
  },
});
