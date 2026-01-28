import { FormatterTypeId, FORMATTER_TYPE_BY_ID } from "../formatters/types";

export const buildSharePointSnippet = (
  formatterTypeId: FormatterTypeId,
  json: unknown,
): string => {
  const containerKey = FORMATTER_TYPE_BY_ID[formatterTypeId]?.containerKey ?? "formatter";
  return JSON.stringify({ [containerKey]: json }, null, 2);
};
