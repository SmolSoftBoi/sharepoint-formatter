import { ValidationError } from "../../lib/validation/validator";

interface ValidationPanelProps {
  parseError?: string;
  errors: ValidationError[];
}

export const ValidationPanel = ({ parseError, errors }: ValidationPanelProps) => {
  if (!parseError && errors.length === 0) {
    return (
      <section>
        <h2>Validation</h2>
        <p>No validation errors.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Validation</h2>
      {parseError && <p>JSON parse error: {parseError}</p>}
      {errors.length > 0 && (
        <ul>
          {errors.map((error, index) => (
            <li key={`${error.message}-${index}`}>
              {error.message}
              {error.path ? ` (${error.path})` : ""}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
