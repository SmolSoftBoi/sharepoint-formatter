import escapeHtmlLib from "escape-html";

export interface PreviewRenderResult {
  html: string;
  warnings: string[];
}

// Preview render cache uses an LRU-like strategy:
// - The cache key is the JSON + sample data payload.
// - Cache hits are promoted by deleting and re-inserting the entry.
// - When the size exceeds the max, the least recently used (oldest) entry is evicted.
// This bounds memory usage while keeping recent previews fast.
// The default limit (10 entries) is chosen as a conservative value based on:
// - Typical usage of 1–2 formatter types per workspace.
// - A small number of recent previews per formatter (roughly 3–5 that users switch between).
// - Each entry is relatively small (JSON payload + rendered HTML), keeping memory use
//   low without needing specific sizing assumptions.
// When the limit is exceeded, the least recently used entry is evicted.
// The limit can be overridden via PREVIEW_MAX_CACHE_ENTRIES (must be a positive integer).
const DEFAULT_MAX_CACHE_ENTRIES = 10;

const envMaxCacheEntries =
  typeof process !== "undefined" &&
  process.env &&
  process.env.PREVIEW_MAX_CACHE_ENTRIES
    ? Number.parseInt(process.env.PREVIEW_MAX_CACHE_ENTRIES, 10)
    : NaN;

const MAX_CACHE_ENTRIES =
  Number.isNaN(envMaxCacheEntries) || envMaxCacheEntries <= 0
    ? DEFAULT_MAX_CACHE_ENTRIES
    : envMaxCacheEntries;
const previewCache = new Map<string, PreviewRenderResult>();

const ALLOWED_ELEMENTS = new Set([
  "div",
  "span",
  "a",
  "img",
  "svg",
  "path",
  "button",
  "p",
  "filepreview",
]);

const ALLOWED_STYLE_PROPERTIES = new Set([
  "background-color",
  "fill",
  "background-image",
  "border",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-style",
  "border-bottom-width",
  "border-color",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-style",
  "border-top-width",
  "border-width",
  "outline",
  "outline-color",
  "outline-style",
  "outline-width",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-radius",
  "border-top-left-radius",
  "border-top-right-radius",
  "box-decoration-break",
  "box-shadow",
  "box-sizing",
  "overflow-x",
  "overflow-y",
  "overflow-style",
  "rotation",
  "rotation-point",
  "opacity",
  "cursor",
  "height",
  "max-height",
  "max-width",
  "min-height",
  "min-width",
  "width",
  "flex-grow",
  "flex-shrink",
  "flex-flow",
  "flex-direction",
  "flex-wrap",
  "flex",
  "justify-content",
  "align-items",
  "box-align",
  "box-direction",
  "box-flex",
  "box-flex-group",
  "box-lines",
  "box-ordinal-group",
  "box-orient",
  "box-pack",
  "font",
  "font-family",
  "font-size",
  "font-style",
  "font-variant",
  "font-weight",
  "font-size-adjust",
  "font-stretch",
  "grid-columns",
  "grid-rows",
  "margin",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "margin-top",
  "column-count",
  "column-fill",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-style",
  "column-rule-width",
  "column-span",
  "column-width",
  "columns",
  "padding",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "padding-top",
  "bottom",
  "clear",
  "clip",
  "display",
  "float",
  "left",
  "overflow",
  "position",
  "right",
  "top",
  "visibility",
  "z-index",
  "border-collapse",
  "border-spacing",
  "caption-side",
  "empty-cells",
  "table-layout",
  "color",
  "direction",
  "letter-spacing",
  "line-height",
  "text-align",
  "text-decoration",
  "text-indent",
  "text-transform",
  "unicode-bidi",
  "vertical-align",
  "white-space",
  "word-spacing",
  "hanging-punctuation",
  "punctuation-trim",
  "text-align-last",
  "text-justify",
  "text-outline",
  "text-overflow",
  "text-wrap",
  "word-break",
  "word-wrap",
  "stroke",
  "fill-opacity",
  "--inline-editor-border-width",
  "--inline-editor-border-style",
  "--inline-editor-border-radius",
  "--inline-editor-border-color",
  "-webkit-line-clamp",
  "object-fit",
  "transform",
]);

export const renderPreview = (
  json: unknown,
  sampleData: Record<string, unknown>,
): PreviewRenderResult => {
  const key = JSON.stringify({ json, sampleData });
  const cached = previewCache.get(key);
  if (cached) {
    previewCache.delete(key);
    previewCache.set(key, cached);
    return cached;
  }

  const warnings: string[] = [];
  let html = "";

  try {
    html = renderNode(json, sampleData, warnings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Preview render failed.";
    warnings.push(message);
    html = `<div>Preview error: ${escapeHtml(message)}</div>`;
  }

  const result = {
    html: html || "<div>Nothing to preview yet.</div>",
    warnings,
  };

  previewCache.set(key, result);
  if (previewCache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = previewCache.keys().next().value;
    if (oldestKey) {
      previewCache.delete(oldestKey);
    }
  }
  return result;
};

const escapeHtml = (value: string) => escapeHtmlLib(value);

const escapeAttr = (value: string) => escapeHtml(value);

const sanitizeUrl = (value: string): string | null => {
  const trimmed = value.trim();
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  if (/^data:image\//i.test(trimmed)) {
    return trimmed;
  }
  return null;
};

const isAllowedAttribute = (elmType: string, key: string) => {
  if (key.startsWith("data-") || key.startsWith("aria-")) {
    return true;
  }

  const shared = new Set(["class", "id", "title", "role"]);
  if (shared.has(key)) {
    return true;
  }

  if (elmType === "img") {
    return key === "src" || key === "alt";
  }

  if (elmType === "a") {
    return key === "href" || key === "target" || key === "rel";
  }

  if (elmType === "svg") {
    return key === "viewBox" || key === "xmlns" || key === "width" || key === "height" || key === "fill" || key === "stroke";
  }

  if (elmType === "path") {
    return key === "d" || key === "fill" || key === "stroke";
  }

  return false;
};

const sanitizeAttributes = (
  elmType: string,
  attributes: Record<string, unknown>,
  sampleData: Record<string, unknown>,
  warnings: string[],
) => {
  const parts: string[] = [];
  let hasTargetBlank = false;
  let hasRel = false;

  for (const [key, rawValue] of Object.entries(attributes)) {
    if (rawValue === undefined || rawValue === null) {
      continue;
    }
    if (!isAllowedAttribute(elmType, key)) {
      warnings.push(`Dropped unsupported attribute "${key}" on <${elmType}>.`);
      continue;
    }

    const resolved = resolveExpression(String(rawValue), sampleData);
    if (key === "href" || key === "src") {
      const sanitized = sanitizeUrl(resolved);
      if (!sanitized) {
        warnings.push(`Dropped unsafe ${key} value on <${elmType}>.`);
        continue;
      }
      parts.push(`${key}="${escapeAttr(sanitized)}"`);
      continue;
    }

    if (key === "target") {
      hasTargetBlank = resolved === "_blank";
    }
    if (key === "rel") {
      hasRel = true;
    }

    parts.push(`${key}="${escapeAttr(resolved)}"`);
  }

  if (elmType === "a" && hasTargetBlank && !hasRel) {
    parts.push('rel="noopener noreferrer"');
  }

  return parts.join(" ");
};

const sanitizeStyle = (
  style: Record<string, unknown>,
  sampleData: Record<string, unknown>,
  warnings: string[],
) => {
  return Object.entries(style)
    .map(([key, value]) => {
      const normalizedKey = key.includes("-")
        ? key
        : key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      if (!ALLOWED_STYLE_PROPERTIES.has(normalizedKey)) {
        warnings.push(`Dropped unsupported style "${key}".`);
        return "";
      }
      if (typeof value !== "string" && typeof value !== "number") {
        return "";
      }
      const resolved = resolveExpression(String(value), sampleData);
      if (normalizedKey === "transform") {
        const match = resolved.match(/^translate\(([^)]+)\)$/);
        if (!match) {
          warnings.push(`Dropped unsupported transform value for "${key}".`);
          return "";
        }
        const args = match[1].split(/,\s*|\s+/).filter(Boolean);
        if (args.length < 1 || args.length > 2) {
          warnings.push(`Dropped unsupported transform value for "${key}".`);
          return "";
        }
      }
      if (/url\s*\(/i.test(resolved) || /expression\s*\(/i.test(resolved)) {
        warnings.push(`Dropped unsafe style value for "${key}".`);
        return "";
      }
      return `${normalizedKey}:${resolved}`;
    })
    .filter(Boolean)
    .join(";");
};

const pickCurrentFieldValue = (sampleData: Record<string, unknown>): unknown => {
  if ("Title" in sampleData) {
    return sampleData.Title;
  }
  const entries = Object.entries(sampleData);
  for (const [, value] of entries) {
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
  }
  return entries[0]?.[1];
};

const resolveExpression = (
  raw: unknown,
  sampleData: Record<string, unknown>,
): string => {
  if (raw === null || raw === undefined) {
    return "";
  }
  if (typeof raw === "number" || typeof raw === "boolean") {
    return String(raw);
  }
  if (typeof raw !== "string") {
    return JSON.stringify(raw);
  }

  if (raw.startsWith("@currentField")) {
    const current = pickCurrentFieldValue(sampleData);
    const path = raw.replace("@currentField", "").replace(/^\./, "");
    if (!path) {
      return current ? String(current) : "";
    }
    if (current && typeof current === "object") {
      const value = (current as Record<string, unknown>)[path];
      return value ? String(value) : "";
    }
    return "";
  }

  const fieldMatch = raw.match(/^\[\$?([A-Za-z0-9_ ]+)\]$/);
  if (fieldMatch) {
    const field = fieldMatch[1].replace(/^\$/, "");
    const value = sampleData[field];
    return value ? String(value) : "";
  }

  return raw;
};

const renderNode = (
  node: unknown,
  sampleData: Record<string, unknown>,
  warnings: string[],
): string => {
  if (node === null || node === undefined) {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return `<span>${escapeHtml(resolveExpression(node, sampleData))}</span>`;
  }
  if (Array.isArray(node)) {
    return node.map((child) => renderNode(child, sampleData, warnings)).join("");
  }
  if (typeof node !== "object") {
    return "";
  }

  const record = node as Record<string, unknown>;
  const elmTypeRaw = record.elmType;
  const normalizedElmType = typeof elmTypeRaw === "string" ? elmTypeRaw : "div";
  if (!ALLOWED_ELEMENTS.has(normalizedElmType)) {
    throw new Error(`Unsupported element type "${String(elmTypeRaw)}".`);
  }
  const elmType = normalizedElmType;

  const txtContent = resolveExpression(record.txtContent, sampleData);
  const style = record.style && typeof record.style === "object" ? (record.style as Record<string, unknown>) : {};
  const attributes = record.attributes && typeof record.attributes === "object" ? (record.attributes as Record<string, unknown>) : {};
  const children = Array.isArray(record.children) ? record.children : [];

  const styleString = sanitizeStyle(style, sampleData, warnings);

  const attributeString = sanitizeAttributes(elmType, attributes, sampleData, warnings);

  const textPart = txtContent ? escapeHtml(txtContent) : "";
  const childParts = children.map((child) => renderNode(child, sampleData, warnings));
  const content = [textPart, ...childParts].join("");

  if (elmType === "img") {
    if (!attributes.src) {
      warnings.push("Image element missing src attribute.");
    }
    return `<img ${attributeString} style="${escapeAttr(styleString)}" />`;
  }

  return `<${elmType} ${attributeString} style="${escapeAttr(styleString)}">${content}</${elmType}>`;
};
