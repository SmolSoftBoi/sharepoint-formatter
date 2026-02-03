import Ajv from "ajv-draft-04";
import { ErrorObject, ValidateFunction } from "ajv";
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

const ajv = new Ajv({ allErrors: true, strict: false, unicodeRegExp: false });
const formatterValidatorCache = new Map<FormatterTypeId, ValidateFunction>();

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
  let validate = formatterValidatorCache.get(formatterTypeId);

  if (!validate) {
    const schema = getSchemaForType(formatterTypeId);
    validate = ajv.compile(schema);
    formatterValidatorCache.set(formatterTypeId, validate);
  }
  const valid = validate(json);

  return {
    valid: Boolean(valid),
    errors: valid ? [] : formatErrors(validate.errors),
  };
};
