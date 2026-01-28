export interface ExpressionExample {
  expression: string;
  description: string;
}

export const EXPRESSION_EXAMPLES: ExpressionExample[] = [
  {
    expression: "@currentField",
    description: "Use the current field value.",
  },
  {
    expression: "@currentField.title",
    description: "Use a sub-property of a person or lookup field.",
  },
  {
    expression: "=if(@currentField == 'Done', '✅', '⏳')",
    description: "Conditional expression for status output.",
  },
];
