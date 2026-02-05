"use client";

import {
  Body2,
  Button,
  Caption1,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { PanelCard } from "../components/PanelCard";
import { TemplateDefinition } from "../../templates/catalog/templates";

interface TemplatePanelProps {
  templates: TemplateDefinition[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export const TemplatePanel = ({
  templates,
  selectedId,
  onSelect,
}: TemplatePanelProps) => {
  const styles = useStyles();

  return (
    <PanelCard title="Templates">
      {templates.length === 0 ? (
        <Body2>No templates are available for this formatter type.</Body2>
      ) : (
        <div className={styles.list}>
          {templates.map((template) => {
            const isSelected = template.id === selectedId;
            return (
              <div key={template.id} className={styles.item}>
                <Button
                  appearance={isSelected ? "primary" : "secondary"}
                  onClick={() => onSelect(template.id)}
                  aria-pressed={isSelected}
                  aria-label={`Apply template ${template.name}`}
                >
                  {template.name}
                </Button>
                <Caption1>{template.description}</Caption1>
              </div>
            );
          })}
        </div>
      )}
    </PanelCard>
  );
};

const useStyles = makeStyles({
  list: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
  },
});
