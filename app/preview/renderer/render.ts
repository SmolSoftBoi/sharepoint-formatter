export interface PreviewRenderResult {
  html: string;
  warnings: string[];
}

export const renderPreview = (
  json: unknown,
  sampleData: Record<string, unknown>,
): PreviewRenderResult => {
  const payload = {
    json,
    sampleData,
  };

  return {
    html: `<pre>${JSON.stringify(payload, null, 2)}</pre>`,
    warnings: ["Preview renderer placeholder output."],
  };
};
