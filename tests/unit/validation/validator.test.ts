import { validateFormatterJson } from "../../../app/lib/validation/validator";
import { FORMATTER_TYPES } from "../../../app/lib/formatters/types";

describe("validator", () => {
  it("reports valid JSON for schema placeholders", () => {
    const result = validateFormatterJson("column", { elmType: "div" });
    expect(result.valid).toBe(true);
  });

  it("compiles schemas for all formatter types", () => {
    for (const formatterType of FORMATTER_TYPES) {
      const result = validateFormatterJson(formatterType.id, {});
      const hasCompileError = result.errors.some(
        (error) =>
          error.hint === "Schema compilation failed. Check schema references." ||
          error.message.includes("can't resolve reference"),
      );

      expect(hasCompileError).toBe(false);
    }
  });
});
