import { useSyncExternalStore } from "react";
import { FormatterTypeId, FORMATTER_TYPES } from "../../lib/formatters/types";
import {
  ValidationError,
  validateFormatterJson,
} from "../../lib/validation/validator";

export interface EditorState {
  formatterTypeId: FormatterTypeId;
  templateId?: string;
  draftId?: string;
  json: unknown;
  sampleData: Record<string, unknown>;
  isValid: boolean;
  validationErrors: ValidationError[];
  parseError?: string;
}

const defaultFormatterType = FORMATTER_TYPES[0]?.id ?? "column";

const initialValidation = validateFormatterJson(defaultFormatterType, {});

const state: EditorState = {
  formatterTypeId: defaultFormatterType,
  json: {},
  sampleData: {},
  isValid: initialValidation.valid,
  validationErrors: initialValidation.errors,
};

const listeners = new Set<() => void>();
let cachedSnapshot: EditorState = { ...state };

export const getEditorState = (): EditorState => {
  return cachedSnapshot;
};

const notify = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

const bumpVersion = () => {
  cachedSnapshot = { ...state };
};

const recomputeValidation = () => {
  if (state.parseError) {
    state.isValid = false;
    state.validationErrors = [
      {
        message: state.parseError,
      },
    ];
    return;
  }
  const result = validateFormatterJson(state.formatterTypeId, state.json);
  state.isValid = result.valid;
  state.validationErrors = result.errors;
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getServerSnapshot = (() => {
  const snapshot = getEditorState();
  return () => snapshot;
})();

export const useEditorState = (): EditorState => {
  return useSyncExternalStore(subscribe, getEditorState, getServerSnapshot);
};

export const setFormatterType = (formatterTypeId: FormatterTypeId) => {
  state.formatterTypeId = formatterTypeId;
  recomputeValidation();
  bumpVersion();
  notify();
};

export const setTemplateId = (templateId?: string) => {
  state.templateId = templateId;
  bumpVersion();
  notify();
};

export const setDraftId = (draftId?: string) => {
  state.draftId = draftId;
  bumpVersion();
  notify();
};

export const setJson = (json: unknown) => {
  state.json = json;
  state.parseError = undefined;
  recomputeValidation();
  bumpVersion();
  notify();
};

export const setJsonParseError = (error?: string) => {
  state.parseError = error;
  if (error) {
    state.isValid = false;
    state.validationErrors = [];
  } else {
    recomputeValidation();
  }
  bumpVersion();
  notify();
};

export const setSampleData = (sampleData: Record<string, unknown>) => {
  state.sampleData = sampleData;
  bumpVersion();
  notify();
};
