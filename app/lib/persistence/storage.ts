import { FormatterTypeId } from "../formatters/types";

export interface DraftMetadata {
  id: string;
  name: string;
  formatterTypeId: FormatterTypeId;
  updatedAt: string;
}

export interface DraftPayload {
  metadata: DraftMetadata;
  json: unknown;
  sampleData: Record<string, unknown>;
}

const STORAGE_KEY = "sharepoint-formatter:drafts";

const readDrafts = (): DraftPayload[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as DraftPayload[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeDrafts = (drafts: DraftPayload[]) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
};

export const saveDraft = (draft: DraftPayload) => {
  const drafts = readDrafts();
  const next = drafts.filter((item) => item.metadata.id !== draft.metadata.id);
  next.unshift(draft);
  writeDrafts(next);
};

export const listDrafts = (): DraftMetadata[] => {
  return readDrafts().map((draft) => draft.metadata);
};

export const loadDraft = (id: string): DraftPayload | undefined => {
  return readDrafts().find((draft) => draft.metadata.id === id);
};

export const deleteDraft = (id: string) => {
  const next = readDrafts().filter((draft) => draft.metadata.id !== id);
  writeDrafts(next);
};
