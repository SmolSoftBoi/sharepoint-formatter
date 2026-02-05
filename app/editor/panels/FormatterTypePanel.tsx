"use client";

import { Caption1, makeStyles, Radio, RadioGroup, tokens } from "@fluentui/react-components";
import { PanelCard } from "../components/PanelCard";
import { FORMATTER_TYPES, FormatterTypeId } from "../../lib/formatters/types";

interface FormatterTypePanelProps {
  selectedId: FormatterTypeId;
  onSelect: (id: FormatterTypeId) => void;
}

export const FormatterTypePanel = ({
  selectedId,
  onSelect,
}: FormatterTypePanelProps) => {
  const styles = useStyles();

  return (
    <PanelCard title="Formatter Type">
      <RadioGroup
        value={selectedId}
        onChange={(_event, data) => onSelect(data.value as FormatterTypeId)}
        className={styles.group}
      >
        {FORMATTER_TYPES.map((type) => (
          <Radio key={type.id} value={type.id} label={
            <>
              {type.name}<br/>
              {type.description && <Caption1>{type.description}</Caption1>}
            </>} />
        ))}
      </RadioGroup>
    </PanelCard>
  );
};

const useStyles = makeStyles({
  group: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
});
