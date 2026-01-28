"use client";

import { useState } from "react";
import { saveDraft } from "../../lib/persistence/storage";
import { useEditorState } from "../state/editorStore";

const createDraftId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `draft-${Date.now()}`;
};

export const SaveDraftButton = () => {
  const editorState = useEditorState();
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = () => {
    const now = new Date();
    const draftId = createDraftId();

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
    <div>
      <button type="button" onClick={handleSave}>
        Save Draft
      </button>
      {status && <span>{status}</span>}
    </div>
  );
};
