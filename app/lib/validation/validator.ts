import Ajv, { ErrorObject } from "ajv";
import { FormatterTypeId } from "../formatters/types";
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

const ajv = new Ajv({ allErrors: true, strict: false });

const formatErrors = (errors: ErrorObject[] | null | undefined): ValidationError[] => {
  if (!errors) {
    return [];
  }

  return errors.map((error) => ({
    message: error.message ?? "Schema validation error",
    path: error.instancePath || error.schemaPath,
  }));
};

export const validateFormatterJson = (
  formatterTypeId: FormatterTypeId,
  json: unknown,
): ValidationResult => {
  const schema = getSchemaForType(formatterTypeId);
  const validate = ajv.compile(schema);
  const valid = validate(json);

  return {
    valid: Boolean(valid),
    errors: formatErrors(validate.errors),
  };
};
