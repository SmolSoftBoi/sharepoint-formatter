"use client";

import { useMemo, useState } from "react";
import { GuidedPattern, GUIDED_PATTERNS } from "../../templates/catalog/guidedPatterns";
import { FormatterTypeId } from "../../lib/formatters/types";

interface GuidedPatternPanelProps {
  formatterTypeId: FormatterTypeId;
  onApply: (pattern: GuidedPattern, values: Record<string, string>) => void;
}

export const GuidedPatternPanel = ({
  formatterTypeId,
  onApply,
}: GuidedPatternPanelProps) => {
  const patterns = useMemo(
    () => GUIDED_PATTERNS.filter((pattern) => pattern.formatterTypeId === formatterTypeId),
    [formatterTypeId],
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    patterns[0]?.id ?? null,
  );
  const selectedPattern = patterns.find((pattern) => pattern.id === selectedId);
  const [values, setValues] = useState<Record<string, string>>({});

  const handleInputChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section>
      <h2>Guided Patterns</h2>
      <select
        value={selectedId ?? ""}
        onChange={(event) => setSelectedId(event.target.value)}
      >
        {patterns.map((pattern) => (
          <option key={pattern.id} value={pattern.id}>
            {pattern.name}
          </option>
        ))}
      </select>
      {selectedPattern && (
        <div>
          {selectedPattern.inputs.map((input) => (
            <label key={input.id}>
              {input.label}
              <input
                type={input.type === "color" ? "color" : "text"}
                value={values[input.id] ?? ""}
                onChange={(event) => handleInputChange(input.id, event.target.value)}
              />
            </label>
          ))}
          <button
            type="button"
            onClick={() => onApply(selectedPattern, values)}
          >
            Apply Pattern
          </button>
        </div>
      )}
    </section>
  );
};
