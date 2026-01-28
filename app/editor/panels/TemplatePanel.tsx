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
  return (
    <section>
      <h2>Templates</h2>
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            <button
              type="button"
              onClick={() => onSelect(template.id)}
              aria-pressed={template.id === selectedId}
            >
              {template.name}
            </button>
            <p>{template.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
