import { validateFormatterJson } from "../../../app/lib/validation/validator";

describe("validator", () => {
  it("reports valid JSON for schema placeholders", () => {
    const result = validateFormatterJson("column", { elmType: "div" });
    expect(result.valid).toBe(true);
  });
});
