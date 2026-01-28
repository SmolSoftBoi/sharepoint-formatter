export interface SanitizeResult {
  ok: boolean;
  value?: unknown;
  error?: string;
}

export const sanitizeJsonString = (raw: string): SanitizeResult => {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const sanitized = JSON.parse(JSON.stringify(parsed)) as unknown;
    return { ok: true, value: sanitized };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return { ok: false, error: message };
  }
};
