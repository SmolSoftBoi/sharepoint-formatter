export interface ExpressionHint {
  expression: string;
  description: string;
}

export const COMMON_EXPRESSION_HINTS: ExpressionHint[] = [
  {
    expression: "@currentField",
    description: "Reference the current field value.",
  },
  {
    expression: "@currentField.title",
    description: "Reference a sub-property on complex field values.",
  },
];

export const extractFieldReferences = (expression: string): string[] => {
  const matches = expression.match(/\[(?:\"|')([A-Za-z0-9_ ]+)(?:\"|')\]/g) ?? [];
  return matches.map((match) => match.replace(/\[|\]|\"|'/g, "")).filter(Boolean);
};
