export type FormatterTypeId =
  | "column"
  | "row"
  | "view"
  | "tile"
  | "board"
  | "calendar";

export interface FormatterType {
  id: FormatterTypeId;
  name: string;
  description?: string;
  schemaFile: string;
  containerKey: string;
}

export const FORMATTER_TYPES: FormatterType[] = [
  {
    id: "column",
    name: "Column",
    schemaFile: "column-formatting.json",
    containerKey: "columnFormatting",
  },
  {
    id: "row",
    name: "Row",
    schemaFile: "row-formatting.json",
    containerKey: "rowFormatting",
  },
  {
    id: "view",
    name: "View (List/Compact)",
    schemaFile: "view-formatting.json",
    containerKey: "viewFormatting",
  },
  {
    id: "tile",
    name: "Tiles",
    schemaFile: "tile-formatting.json",
    containerKey: "tileFormatting",
  },
  {
    id: "board",
    name: "Board (Kanban)",
    schemaFile: "board-formatting.json",
    containerKey: "boardFormatting",
  },
  {
    id: "calendar",
    name: "Calendar",
    schemaFile: "calendar-formatting.json",
    containerKey: "calendarFormatting",
  },
];

export const FORMATTER_TYPE_BY_ID = FORMATTER_TYPES.reduce(
  (acc, type) => {
    acc[type.id] = type;
    return acc;
  },
  {} as Record<FormatterTypeId, FormatterType>,
);
