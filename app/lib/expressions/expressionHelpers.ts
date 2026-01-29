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
  const regex = /\[(?:["'])?(\$?[A-Za-z0-9_]+)(?:["'])?\]/g;
  const results: string[] = [];
  let match: RegExpExecArray | null = null;

  while ((match = regex.exec(expression)) !== null) {
    const value = match[1]?.trim();
    if (value) {
      results.push(value);
    }
  }

  return results;
};
