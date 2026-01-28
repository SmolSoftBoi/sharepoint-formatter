import columnSchema from "./column-formatting.json";
import rowSchema from "./row-formatting.json";
import viewSchema from "./view-formatting.json";
import tileSchema from "./tile-formatting.json";
import boardSchema from "./board-formatting.json";
import calendarSchema from "./calendar-formatting.json";
import { FormatterTypeId } from "../../lib/formatters/types";

export type JsonSchema = Record<string, unknown>;

export const SCHEMA_BY_TYPE: Record<FormatterTypeId, JsonSchema> = {
  column: columnSchema as JsonSchema,
  row: rowSchema as JsonSchema,
  view: viewSchema as JsonSchema,
  tile: tileSchema as JsonSchema,
  board: boardSchema as JsonSchema,
  calendar: calendarSchema as JsonSchema,
};
