import type { GuidedPattern } from "../../templates/catalog/guidedPatterns";

export type HsvColor = {
  h: number;
  s: number;
  v: number;
  a?: number;
};

const hexToRgb = (value: string): { r: number; g: number; b: number } | null => {
  const cleaned = value.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(cleaned)) {
    return null;
  }
  const normalized = cleaned.length === 3
    ? cleaned
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : cleaned;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
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

const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (channel: number) => Math.round(channel).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const rgbToHsv = ({ r, g, b }: { r: number; g: number; b: number }): HsvColor => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h *= 60;
    if (h < 0) {
      h += 360;
    }
  }

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return { h, s, v };
};

const hsvToRgb = ({ h, s, v }: HsvColor): { r: number; g: number; b: number } => {
  const hue = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = v - c;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (hue < 60) {
    rPrime = c;
    gPrime = x;
  } else if (hue < 120) {
    rPrime = x;
    gPrime = c;
  } else if (hue < 180) {
    gPrime = c;
    bPrime = x;
  } else if (hue < 240) {
    gPrime = x;
    bPrime = c;
  } else if (hue < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  return {
    r: (rPrime + m) * 255,
    g: (gPrime + m) * 255,
    b: (bPrime + m) * 255,
  };
};

export const hexToHsv = (value: string): HsvColor => {
  const rgb = hexToRgb(value) ?? { r: 0, g: 0, b: 0 };
  return rgbToHsv(rgb);
};

export const hsvToHex = (hsv: HsvColor): string => {
  const { r, g, b } = hsvToRgb(hsv);
  return rgbToHex(r, g, b);
};

export const toHexColor = (value: string): string | null => {
  const rgb = hexToRgb(value);
  if (!rgb) {
    return null;
  }
  return rgbToHex(rgb.r, rgb.g, rgb.b);
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
