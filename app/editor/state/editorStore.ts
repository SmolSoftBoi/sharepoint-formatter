import { useSyncExternalStore } from "react";
import { FormatterTypeId, FORMATTER_TYPES } from "../../lib/formatters/types";

export interface EditorState {
  formatterTypeId: FormatterTypeId;
  templateId?: string;
  json: unknown;
  sampleData: Record<string, unknown>;
}

const defaultFormatterType = FORMATTER_TYPES[0]?.id ?? "column";

const state: EditorState = {
  formatterTypeId: defaultFormatterType,
  json: {},
  sampleData: {},
};

const listeners = new Set<() => void>();

export const getEditorState = (): EditorState => ({ ...state });

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useEditorState = (): EditorState => {
  return useSyncExternalStore(subscribe, getEditorState, getEditorState);
};

export const setFormatterType = (formatterTypeId: FormatterTypeId) => {
  state.formatterTypeId = formatterTypeId;
  notify();
};

export const setTemplateId = (templateId?: string) => {
  state.templateId = templateId;
  notify();
};

export const setJson = (json: unknown) => {
  state.json = json;
  notify();
};

export const setSampleData = (sampleData: Record<string, unknown>) => {
  state.sampleData = sampleData;
  notify();
};
