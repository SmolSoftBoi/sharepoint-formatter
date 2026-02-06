import { render, screen } from "@testing-library/react";
import { ValidationPanel } from "../../../app/editor/components/ValidationPanel";
import type { ValidationError } from "../../../app/lib/validation/validator";

describe("ValidationPanel", () => {
  it("renders an empty state when there are no errors", () => {
    render(<ValidationPanel errors={[]} />);

    expect(screen.getByText("No validation errors.")).toBeInTheDocument();
  });

  it("renders the parse error message", () => {
    render(<ValidationPanel parseError="Unexpected token" errors={[]} />);

    expect(screen.getByText("JSON parse error")).toBeInTheDocument();
    expect(screen.getByText("Unexpected token")).toBeInTheDocument();
  });

  it("renders validation errors with paths and hints", () => {
    const errors: ValidationError[] = [
      {
        message: "Missing property",
        path: "/fields/0",
        hint: "Add required property \"title\".",
      },
    ];

    render(<ValidationPanel errors={errors} />);

    expect(screen.getByText("Missing property")).toBeInTheDocument();
    expect(screen.getByText(/\(\/fields\/0\)/)).toBeInTheDocument();
    expect(screen.getByText("Hint:")).toBeInTheDocument();
    expect(screen.getByText('Add required property "title".')).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
