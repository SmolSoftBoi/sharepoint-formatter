import { FORMATTER_TYPES, FormatterTypeId } from "../../lib/formatters/types";

interface FormatterTypePanelProps {
  selectedId: FormatterTypeId;
  onSelect: (id: FormatterTypeId) => void;
}

export const FormatterTypePanel = ({
  selectedId,
  onSelect,
}: FormatterTypePanelProps) => {
  return (
    <section>
      <h2>Formatter Type</h2>
      <ul>
        {FORMATTER_TYPES.map((type) => (
          <li key={type.id}>
            <button
              type="button"
              onClick={() => onSelect(type.id)}
              aria-pressed={type.id === selectedId}
            >
              {type.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
