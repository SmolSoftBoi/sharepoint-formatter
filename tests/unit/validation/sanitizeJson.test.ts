import { sanitizeJsonString } from "../../../app/lib/validation/sanitizeJson";

describe("sanitizeJsonString", () => {
  it("returns sanitized JSON for valid input", () => {
    const result = sanitizeJsonString("{\"name\":\"Apollo\",\"count\":2}");

    expect(result.ok).toBe(true);
    expect(result.value).toEqual({ name: "Apollo", count: 2 });
  });

  it("returns an error for invalid JSON", () => {
    const result = sanitizeJsonString("{name:}\n");

    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns a deep-cloned value", () => {
    const raw = "{\"meta\":{\"name\":\"Apollo\"},\"items\":[1,2]}";
    const parsed = JSON.parse(raw) as { meta: { name: string }; items: number[] };
    const result = sanitizeJsonString(raw);

    expect(result.ok).toBe(true);
    expect(result.value).toEqual(parsed);
    expect(result.value).not.toBe(parsed);
    expect((result.value as typeof parsed).meta).not.toBe(parsed.meta);
  });
});
