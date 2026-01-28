interface SampleDataPanelProps {
  sampleData: Record<string, unknown>;
  onUpdate: (next: Record<string, unknown>) => void;
}

export const SampleDataPanel = ({
  sampleData,
  onUpdate,
}: SampleDataPanelProps) => {
  const handleChange = (value: string) => {
    try {
      const parsed = JSON.parse(value) as Record<string, unknown>;
      onUpdate(parsed);
    } catch {
      // ignore invalid JSON edits for now
    }
  };

  return (
    <section>
      <h2>Sample Data</h2>
      <textarea
        value={JSON.stringify(sampleData, null, 2)}
        onChange={(event) => handleChange(event.target.value)}
        rows={8}
      />
    </section>
  );
};
