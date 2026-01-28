export interface PreviewRenderResult {
  html: string;
  warnings: string[];
}

let lastKey: string | null = null;
let lastResult: PreviewRenderResult | null = null;

export const renderPreview = (
  json: unknown,
  sampleData: Record<string, unknown>,
): PreviewRenderResult => {
  const payload = {
    json,
    sampleData,
  };

  const key = JSON.stringify(payload);
  if (lastKey === key && lastResult) {
    return lastResult;
  }

  const result = {
    html: `<pre>${JSON.stringify(payload, null, 2)}</pre>`,
    warnings: ["Preview renderer placeholder output."],
  };

  lastKey = key;
  lastResult = result;
  return result;
};
