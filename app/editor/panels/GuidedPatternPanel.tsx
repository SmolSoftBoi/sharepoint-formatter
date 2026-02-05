"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  ColorArea,
  ColorPicker,
  ColorSlider,
  Field,
  Input,
  Label,
  makeStyles,
  MessageBar,
  MessageBarBody,
  Select,
  tokens,
} from "@fluentui/react-components";
import { PanelCard } from "../components/PanelCard";
import { GuidedPattern, GUIDED_PATTERNS } from "../../templates/catalog/guidedPatterns";
import { FormatterTypeId } from "../../lib/formatters/types";
import {
  hexToHsv,
  HsvColor,
  hsvToHex,
  normalizeHexInput,
  resolvePatternValues,
  toHexColor,
} from "../utils/color";

interface GuidedPatternPanelProps {
  formatterTypeId: FormatterTypeId;
  onApply: (pattern: GuidedPattern, values: Record<string, string>) => void;
}

export const GuidedPatternPanel = ({
  formatterTypeId,
  onApply,
}: GuidedPatternPanelProps) => {
  const styles = useStyles();
  const patterns = useMemo(
    () => GUIDED_PATTERNS.filter((pattern) => pattern.formatterTypeId === formatterTypeId),
    [formatterTypeId],
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    patterns[0]?.id ?? null,
  );
  const selectedPattern = patterns.find((pattern) => pattern.id === selectedId);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedId(patterns[0]?.id ?? null);
  }, [patterns]);

  useEffect(() => {
    setValues({});
  }, [selectedId]);

  const handleInputChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleColorChange = (id: string, hsvColor: HsvColor) => {
    handleInputChange(id, hsvToHex(hsvColor));
  };

  return (
    <PanelCard title="Guided Patterns">
      {patterns.length === 0 ? (
        <MessageBar>
          <MessageBarBody>
            No guided patterns available for this formatter type.
          </MessageBarBody>
        </MessageBar>
      ) : (
        <Field label="Pattern">
          <Select
            value={selectedId ?? ""}
            onChange={(_event, data) => setSelectedId(data.value)}
          >
            {patterns.map((pattern) => (
              <option key={pattern.id} value={pattern.id}>
                {pattern.name}
              </option>
            ))}
          </Select>
        </Field>
      )}
      {selectedPattern && (
        <div className={styles.inputs}>
          {selectedPattern.inputs.map((input) => {
            if (input.type === "color") {
              const rawHex = values[input.id] ?? "#000000";
              const resolvedHex = toHexColor(rawHex) ?? "#000000";
              const hsvColor = hexToHsv(resolvedHex);
              const labelId = `${input.id}-label`;

              return (
                <div key={input.id} className={styles.colorField}>
                  <Label id={labelId}>{input.label}</Label>
                  <div className={styles.colorPicker}>
                    <ColorPicker
                      aria-labelledby={labelId}
                      color={hsvColor}
                      onColorChange={(_event, data) => handleColorChange(input.id, data.color)}
                    >
                      <ColorArea aria-labelledby={labelId} />
                      <ColorSlider aria-labelledby={labelId} />
                    </ColorPicker>
                  </div>
                  <Input
                    value={rawHex}
                    onChange={(_event, data) =>
                      handleInputChange(input.id, normalizeHexInput(data.value))
                    }
                    aria-label={`${input.label} hex value`}
                    placeholder="#000000"
                  />
                </div>
              );
            }

            const type = input.type === "number" ? "number" : "text";
            return (
              <Field key={input.id} label={input.label}>
                <Input
                  type={type}
                  value={values[input.id] ?? ""}
                  onChange={(_event, data) => handleInputChange(input.id, data.value)}
                />
              </Field>
            );
          })}
          <Button
            appearance="primary"
            onClick={() =>
              onApply(selectedPattern, resolvePatternValues(selectedPattern, values))
            }
          >
            Apply Pattern
          </Button>
        </div>
      )}
    </PanelCard>
  );
};

const useStyles = makeStyles({
  inputs: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  colorField: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  colorPicker: {
    maxWidth: "220px",
  },
});
