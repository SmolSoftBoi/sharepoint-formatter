import { FormatterTypeId } from "../formatters/types";
import { JsonSchema, SCHEMA_BY_TYPE } from "../../schemas/sharepoint-v2";

export const getSchemaForType = (formatterTypeId: FormatterTypeId): JsonSchema => {
  return SCHEMA_BY_TYPE[formatterTypeId];
};
