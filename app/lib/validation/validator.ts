import Ajv from "ajv-draft-04";
import { ErrorObject, ValidateFunction } from "ajv";
import { FormatterTypeId, FORMATTER_TYPES } from "../formatters/types";
import { getSchemaForType } from "./schemaLoader";

export interface ValidationError {
  message: string;
  path?: string;
  hint?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const ajv = new Ajv({ allErrors: true, strict: false, unicodeRegExp: false });
const formatterValidatorCache = new Map<FormatterTypeId, ValidateFunction>();
let schemasRegistered = false;

const SHAREPOINT_SCHEMA_BASE_URL = "https://developer.microsoft.com/json-schemas/sp/v2";
const COMMAND_BAR_SCHEMA_URL = `${SHAREPOINT_SCHEMA_BASE_URL}/command-bar-formatting.schema.json`;
const COMMAND_BAR_SCHEMA_PLACEHOLDER: Record<string, unknown> = {
  $schema: "http://json-schema.org/draft-04/schema#",
  title: "CommandBarFormatter JSON",
  description:
    "Permissive placeholder schema for command bar customisation options (bundled schemas reference this URL).",
  type: "object",
  additionalProperties: true,
};

const FORMATTER_TYPE_META_BY_ID: ReadonlyMap<FormatterTypeId, { schemaFile: string }> = new Map(
  FORMATTER_TYPES.map((type) => [type.id, { schemaFile: type.schemaFile }] as const),
);

const getSchemaFileForFormatterType = (formatterTypeId: FormatterTypeId): string => {
  const meta = FORMATTER_TYPE_META_BY_ID.get(formatterTypeId);
  if (!meta) {
    throw new Error(`Unknown formatter type "${formatterTypeId}".`);
  }
  return meta.schemaFile;
};

const schemaUrlForFile = (schemaFile: string): string => {
  return `${SHAREPOINT_SCHEMA_BASE_URL}/${schemaFile.replace(/\.json$/u, ".schema.json")}`;
};

const schemaUrlForFormatterType = (formatterTypeId: FormatterTypeId): string => {
  return schemaUrlForFile(getSchemaFileForFormatterType(formatterTypeId));
};

const schemaRegistrationOrder: FormatterTypeId[] = (() => {
  const priorityByFormatterTypeId: Partial<Record<FormatterTypeId, number>> = {
    column: -100,
    view: 100,
  };

  return FORMATTER_TYPES
    .map((type, index) => ({
      formatterTypeId: type.id,
      priority: priorityByFormatterTypeId[type.id] ?? 0,
      index,
    }))
    .sort((a, b) => a.priority - b.priority || a.index - b.index)
    .map((entry) => entry.formatterTypeId);
})();

const registerSchemas = () => {
  if (schemasRegistered) {
    return;
  }

  try {
    ajv.addSchema(COMMAND_BAR_SCHEMA_PLACEHOLDER, COMMAND_BAR_SCHEMA_URL);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Schema registration failed.";
    console.error(
      `[schemas] Failed to register command-bar schema (${COMMAND_BAR_SCHEMA_URL}): ${message}`,
    );
  }

  schemaRegistrationOrder.forEach((formatterTypeId) => {
    let schemaUrl: string | undefined;
    try {
      schemaUrl = schemaUrlForFormatterType(formatterTypeId);
      const schema = getSchemaForType(formatterTypeId);
      ajv.addSchema(schema, schemaUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Schema registration failed.";
      const urlSuffix = schemaUrl ? ` (${schemaUrl})` : "";
      console.error(
        `[schemas] Failed to register schema for "${formatterTypeId}"${urlSuffix}: ${message}`,
      );
    }
  });
  schemasRegistered = true;
};

const buildHint = (error: ErrorObject): string | undefined => {
  switch (error.keyword) {
    case "required": {
      const missing = (error.params as { missingProperty?: string }).missingProperty;
      return missing ? `Add required property "${missing}".` : undefined;
    }
    case "type": {
      const expected = (error.params as { type?: string }).type;
      return expected ? `Expected type "${expected}".` : "Update the value to the expected type.";
    }
    case "enum":
      return "Update the value to one of the allowed options.";
    case "additionalProperties": {
      const property = (error.params as { additionalProperty?: string }).additionalProperty;
      return property ? `Remove unsupported property "${property}".` : "Remove unsupported properties.";
    }
    case "minLength":
      return "Provide a longer value.";
    case "maxLength":
      return "Provide a shorter value.";
    case "minimum":
    case "exclusiveMinimum":
      return "Provide a number that is large enough.";
    case "maximum":
    case "exclusiveMaximum":
      return "Provide a number that is small enough.";
    case "pattern":
      return "Match the required format.";
    default:
      return undefined;
  }
};

const formatErrors = (errors: ErrorObject[] | null | undefined): ValidationError[] => {
  if (!errors) {
    return [];
  }

  return errors.map((error) => ({
    message: error.message ?? "Schema validation error",
    path: error.instancePath || error.schemaPath,
    hint: buildHint(error),
  }));
};

export const validateFormatterJson = (
  formatterTypeId: FormatterTypeId,
  json: unknown,
): ValidationResult => {
  let validate = formatterValidatorCache.get(formatterTypeId);

  if (!validate) {
    let schemaUrl: string | undefined;
    try {
      registerSchemas();
      schemaUrl = schemaUrlForFormatterType(formatterTypeId);
      validate = ajv.getSchema(schemaUrl);

      if (!validate) {
        const schema = getSchemaForType(formatterTypeId);
        validate = ajv.compile(schema);
      }
      formatterValidatorCache.set(formatterTypeId, validate);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Schema compilation failed.";
      const urlSuffix = schemaUrl ? ` (${schemaUrl})` : "";
      console.error(`[schemas] Schema compilation failed for "${formatterTypeId}"${urlSuffix}: ${message}`);
      return {
        valid: false,
        errors: [
          {
            message,
            hint: "Schema compilation failed. Check schema references.",
          },
        ],
      };
    }
  }
  const valid = validate(json);

  return {
    valid: Boolean(valid),
    errors: valid ? [] : formatErrors(validate.errors),
  };
};
