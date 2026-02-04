import { FormatterTypeId } from "../../lib/formatters/types";

export interface GuidedPatternInput {
  id: string;
  label: string;
  type: "text" | "number" | "color" | "field";
}

export interface GuidedPattern {
  id: string;
  name: string;
  formatterTypeId: FormatterTypeId;
  inputs: GuidedPatternInput[];
  outputTransform: (values: Record<string, string>) => Record<string, unknown>;
}

export const GUIDED_PATTERNS: GuidedPattern[] = [
  {
    id: "badge",
    name: "Badge",
    formatterTypeId: "column",
    inputs: [
      { id: "label", label: "Badge label", type: "text" },
      { id: "color", label: "Badge color", type: "color" },
    ],
    outputTransform: (values) => ({
      elmType: "div",
      txtContent: values.label || "Badge",
      style: {
        backgroundColor: values.color || "#dfe4ff",
        padding: "2px 8px",
        borderRadius: "999px",
      },
    }),
  },
];
