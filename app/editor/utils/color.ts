import { TinyColor } from "@ctrl/tinycolor";
import type { GuidedPattern } from "../../templates/catalog/guidedPatterns";

export type HsvColor = {
  h: number;
  s: number;
  v: number;
  a?: number;
};

const toTinyColor = (value: string): TinyColor | null => {
  const color = new TinyColor(value);
  return color.isValid ? color : null;
};

export const normalizeHexInput = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "#") {
    return trimmed;
  }
  const cleaned = trimmed.replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(cleaned)) {
    return `#${cleaned}`;
  }
  return trimmed;
};

export const hexToHsv = (value: string): HsvColor => {
  const color = toTinyColor(value);
  if (!color) {
    return { h: 0, s: 0, v: 0 };
  }
  const hsv = color.toHsv();
  return { h: hsv.h, s: hsv.s, v: hsv.v, a: hsv.a };
};

export const hsvToHex = (hsv: HsvColor): string => {
  const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
  return new TinyColor({
    h: hsv.h,
    s: clamp01(hsv.s),
    v: clamp01(hsv.v),
    a: hsv.a === undefined ? undefined : clamp01(hsv.a),
  }).toHexString();
};

export const toHexColor = (value: string): string | null => {
  const color = toTinyColor(value);
  return color ? color.toHexString() : null;
};

export const resolvePatternValues = (
  pattern: GuidedPattern,
  values: Record<string, string>,
): Record<string, string> => {
  const resolved: Record<string, string> = { ...values };
  pattern.inputs.forEach((input) => {
    if (input.type !== "color") {
      return;
    }

    const normalised = toHexColor(values[input.id] ?? "");
    if (normalised) {
      resolved[input.id] = normalised;
      return;
    }

    delete resolved[input.id];
  });
  return resolved;
};
