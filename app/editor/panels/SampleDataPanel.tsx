import { useEffect, useState } from "react";

interface SampleDataPanelProps {
  sampleData: Record<string, unknown>;
  onUpdate: (next: Record<string, unknown>) => void;
}

export const SampleDataPanel = ({
  sampleData,
  onUpdate,
}: SampleDataPanelProps) => {
  const [rawValue, setRawValue] = useState(
    JSON.stringify(sampleData, null, 2),
  );
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    setRawValue(JSON.stringify(sampleData, null, 2));
    setParseError(null);
  }, [sampleData]);

  const handleChange = (value: string) => {
    setRawValue(value);
    try {
      const parsed = JSON.parse(value) as Record<string, unknown>;
      onUpdate(parsed);
      setParseError(null);
    } catch {
      setParseError("Invalid JSON");
    }
  };

  return (
    <section>
      <h2>Sample Data</h2>
      <textarea
        value={rawValue}
        onChange={(event) => handleChange(event.target.value)}
        rows={8}
        aria-label="Sample data JSON"
      />
      {parseError && (
        <p role="alert">Invalid sample JSON: {parseError}</p>
      )}
    </section>
  );
};
