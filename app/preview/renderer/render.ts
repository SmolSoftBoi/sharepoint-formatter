export interface PreviewRenderResult {
  html: string;
  warnings: string[];
}

const MAX_CACHE_ENTRIES = 10;
const previewCache = new Map<string, PreviewRenderResult>();

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
  const html = renderNode(json, sampleData, warnings);
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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeAttr = (value: string) => escapeHtml(value);

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
    const field = fieldMatch[1];
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
  const elmType = typeof elmTypeRaw === "string" ? elmTypeRaw : "div";

  const txtContent = resolveExpression(record.txtContent, sampleData);
  const style = record.style && typeof record.style === "object" ? (record.style as Record<string, unknown>) : {};
  const attributes = record.attributes && typeof record.attributes === "object" ? (record.attributes as Record<string, unknown>) : {};
  const children = Array.isArray(record.children) ? record.children : [];

  const styleString = Object.entries(style)
    .map(([key, value]) => {
      if (typeof value !== "string" && typeof value !== "number") {
        return "";
      }
      const resolved = resolveExpression(String(value), sampleData);
      return `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${resolved}`;
    })
    .filter(Boolean)
    .join(";");

  const attributeString = Object.entries(attributes)
    .map(([key, value]) => {
      if (value === undefined || value === null) {
        return "";
      }
      const resolved = resolveExpression(String(value), sampleData);
      return `${key}="${escapeAttr(resolved)}"`;
    })
    .filter(Boolean)
    .join(" ");

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
