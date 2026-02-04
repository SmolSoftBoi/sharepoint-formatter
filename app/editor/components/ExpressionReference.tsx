import { EXPRESSION_EXAMPLES } from "../../lib/expressions/examples";

export const ExpressionReference = () => {
  return (
    <section>
      <h2>Expression Examples</h2>
      <ul>
        {EXPRESSION_EXAMPLES.map((example) => (
          <li key={example.expression}>
            <code>{example.expression}</code>
            <p>{example.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
