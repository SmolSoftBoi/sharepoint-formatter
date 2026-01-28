import { FormatterTypeId } from "../../lib/formatters/types";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  formatterTypeId: FormatterTypeId;
  jsonDefinition: Record<string, unknown>;
  tags: string[];
}

export const TEMPLATE_CATALOG: TemplateDefinition[] = [
  {
    id: "status-pill",
    name: "Status Pill",
    description: "Rounded status indicator with conditional colors.",
    formatterTypeId: "column",
    jsonDefinition: {
      elmType: "div",
      txtContent: "@currentField",
      style: {
        padding: "4px 8px",
        borderRadius: "999px",
      },
    },
    tags: ["status", "pill"],
  },
  {
    id: "progress-bar",
    name: "Progress Bar",
    description: "Inline progress indicator with percent value.",
    formatterTypeId: "column",
    jsonDefinition: {
      elmType: "div",
      children: [
        {
          elmType: "div",
          style: {
            width: "@currentField",
            height: "8px",
            backgroundColor: "#4f6bed",
          },
        },
      ],
    },
    tags: ["progress", "bar"],
  },
  {
    id: "people-card",
    name: "People Card",
    description: "Avatar and name layout for a person field.",
    formatterTypeId: "tile",
    jsonDefinition: {
      elmType: "div",
      children: [
        {
          elmType: "img",
          attributes: {
            src: "@currentField.photo",
          },
        },
        {
          elmType: "div",
          txtContent: "@currentField.title",
        },
      ],
    },
    tags: ["people", "card"],
  },
];
