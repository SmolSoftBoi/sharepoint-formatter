import {
  hexToHsv,
  hsvToHex,
  normalizeHexInput,
  resolvePatternValues,
  toHexColor,
} from "../../../app/editor/utils/color";
import type { GuidedPattern } from "../../../app/templates/catalog/guidedPatterns";

describe("color utilities", () => {
  it("normalises hex input without breaking partial values", () => {
    expect(normalizeHexInput("")).toBe("");
    expect(normalizeHexInput("#")).toBe("#");
    expect(normalizeHexInput("abc")).toBe("#abc");
    expect(normalizeHexInput(" #aBc ")).toBe("#aBc");
    expect(normalizeHexInput("not-hex")).toBe("not-hex");
  });

  it("normalises valid hex values and rejects invalid ones", () => {
    expect(toHexColor("#abc")).toBe("#aabbcc");
    expect(toHexColor("ABC")).toBe("#aabbcc");
    expect(toHexColor("nope")).toBeNull();
  });

  it("converts between hex and HSV values", () => {
    const redHsv = hexToHsv("#ff0000");
    expect(redHsv.h).toBeCloseTo(0, 1);
    expect(redHsv.s).toBeCloseTo(1, 3);
    expect(redHsv.v).toBeCloseTo(1, 3);
    expect(hsvToHex({ h: 0, s: 1, v: 1 })).toBe("#ff0000");
    expect(hsvToHex(hexToHsv("#00ff00"))).toBe("#00ff00");
  });

  it("clamps HSV conversions to valid hex output", () => {
    expect(hsvToHex({ h: 0, s: 0, v: 1.1 })).toBe("#ffffff");
  });

  it("resolves colour values for guided patterns", () => {
    const pattern: GuidedPattern = {
      id: "test",
      name: "Test",
      formatterTypeId: "column",
      inputs: [
        { id: "title", label: "Title", type: "text" },
        { id: "colour", label: "Colour", type: "color" },
      ],
      outputTransform: (values) => values,
    };

    const resolved = resolvePatternValues(pattern, {
      title: "Hello",
      colour: "#abc",
    });

    expect(resolved.title).toBe("Hello");
    expect(resolved.colour).toBe("#aabbcc");

    const removed = resolvePatternValues(pattern, {
      title: "Hello",
      colour: "nope",
    });
    expect(removed).toEqual({ title: "Hello" });
  });
});
