import { FormatterTypeId } from "../formatters/types";
import { buildSharePointSnippet } from "./sharepointSnippet";

export const getJsonText = (json: unknown): string => {
  return JSON.stringify(json, null, 2);
};

export const getSharePointSnippetText = (
  formatterTypeId: FormatterTypeId,
  json: unknown,
): string => {
  return buildSharePointSnippet(formatterTypeId, json);
};

export const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    throw new Error("Clipboard API not available");
  }
  await navigator.clipboard.writeText(text);
};

export const downloadTextFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
