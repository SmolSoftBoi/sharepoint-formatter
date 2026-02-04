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

const registerSchemas = () => {
  if (schemasRegistered) {
    return;
  }
  FORMATTER_TYPES.forEach((type) => {
    try {
      const schema = getSchemaForType(type.id);
      ajv.addSchema(schema, type.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Schema registration failed.";
      console.error(message);
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
    try {
      registerSchemas();
      const schema = getSchemaForType(formatterTypeId);
      validate = ajv.compile(schema);
      formatterValidatorCache.set(formatterTypeId, validate);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Schema compilation failed.";
      console.error(message);
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
