import { useSyncExternalStore } from "react";
import { FormatterTypeId, FORMATTER_TYPES } from "../../lib/formatters/types";
import {
  ValidationError,
  validateFormatterJson,
} from "../../lib/validation/validator";

export interface EditorState {
  formatterTypeId: FormatterTypeId;
  templateId?: string;
  json: unknown;
  sampleData: Record<string, unknown>;
  isValid: boolean;
  validationErrors: ValidationError[];
  parseError?: string;
}

const defaultFormatterType = FORMATTER_TYPES[0]?.id ?? "column";

const state: EditorState = {
  formatterTypeId: defaultFormatterType,
  json: {},
  sampleData: {},
  isValid: true,
  validationErrors: [],
};

const listeners = new Set<() => void>();

export const getEditorState = (): EditorState => ({ ...state });

const notify = () => {
  listeners.forEach((listener) => listener());
};

const recomputeValidation = () => {
  const result = validateFormatterJson(state.formatterTypeId, state.json);
  state.isValid = result.valid;
  state.validationErrors = result.errors;
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
  recomputeValidation();
  notify();
};

export const setTemplateId = (templateId?: string) => {
  state.templateId = templateId;
  notify();
};

export const setJson = (json: unknown) => {
  state.json = json;
  state.parseError = undefined;
  recomputeValidation();
  notify();
};

export const setJsonParseError = (error?: string) => {
  state.parseError = error;
  notify();
};

export const setSampleData = (sampleData: Record<string, unknown>) => {
  state.sampleData = sampleData;
  notify();
};
