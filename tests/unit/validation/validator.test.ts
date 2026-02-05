import { validateFormatterJson } from "../../../app/lib/validation/validator";
import { FormatterTypeId, FORMATTER_TYPES } from "../../../app/lib/formatters/types";

describe("validator", () => {
  it("reports valid JSON for schema placeholders", () => {
    const result = validateFormatterJson("column", { elmType: "div" });
    expect(result.valid).toBe(true);
  });

  const formatterTypeIds: FormatterTypeId[] = FORMATTER_TYPES.map((formatterType) => formatterType.id);

  it.each(formatterTypeIds)('compiles schema for "%s"', (formatterTypeId) => {
    const result = validateFormatterJson(formatterTypeId, {});
    const hasCompileError = result.errors.some(
      (error) =>
        error.hint === "Schema compilation failed. Check schema references." ||
        error.message.includes("can't resolve reference"),
    );

    expect(hasCompileError).toBe(false);
  });
});
