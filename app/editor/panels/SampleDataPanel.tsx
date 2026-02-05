"use client";

import { useEffect, useState } from "react";
import { Field, Textarea } from "@fluentui/react-components";
import { PanelCard } from "../components/PanelCard";

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
      const parsed = JSON.parse(value) as unknown;
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        onUpdate(parsed as Record<string, unknown>);
        setParseError(null);
      } else {
        setParseError("Sample data must be a JSON object.");
      }
    } catch {
      setParseError("Invalid sample JSON.");
    }
  };

  return (
    <PanelCard title="Sample Data">
      <Field
        label="Sample data JSON"
        validationMessage={parseError ?? undefined}
        validationState={parseError ? "error" : "none"}
      >
        <Textarea
          value={rawValue}
          onChange={(_event, data) => handleChange(data.value)}
          rows={8}
          resize="vertical"
        />
      </Field>
    </PanelCard>
  );
};
