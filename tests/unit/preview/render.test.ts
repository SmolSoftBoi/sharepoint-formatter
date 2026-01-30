import { renderPreview } from "../../../app/preview/renderer/render";

describe("renderPreview", () => {
  it("renders field expressions from sample data", () => {
    const result = renderPreview({ elmType: "span", txtContent: "[$Title]" }, { Title: "Alpha" });

    expect(result.html).toContain("<span");
    expect(result.html).toContain("Alpha");
    expect(result.warnings).toEqual([]);
  });

  it("renders dollar-prefixed field expressions", () => {
    const result = renderPreview(
      { elmType: "span", txtContent: "[$Status]" },
      { Status: "Done" },
    );

    expect(result.html).toContain("Done");
  });

  it("resolves @currentField paths", () => {
    const result = renderPreview(
      { elmType: "span", txtContent: "@currentField.title" },
      { Title: { title: "Nested" } },
    );

    expect(result.html).toContain("Nested");
  });

  it("renders child nodes", () => {
    const result = renderPreview(
      {
        elmType: "div",
        children: [
          { elmType: "span", txtContent: "One" },
          { elmType: "span", txtContent: "Two" },
        ],
      },
      {},
    );

    expect(result.html).toContain("One");
    expect(result.html).toContain("Two");
  });

  it("warns when image is missing src", () => {
    const result = renderPreview({ elmType: "img" }, {});

    expect(result.html).toContain("<img");
    expect(result.warnings).toContain("Image element missing src attribute.");
  });

  it("renders styles and attributes with expression resolution", () => {
    const result = renderPreview(
      {
        elmType: "div",
        style: { backgroundColor: "red", width: "@currentField" },
        attributes: { title: "[$Title]" },
        txtContent: "[$Title]",
      },
      { Title: "Hello" },
    );

    expect(result.html).toContain("background-color:red");
    expect(result.html).toContain("width:Hello");
    expect(result.html).toContain("title=\"Hello\"");
    expect(result.html).toContain("Hello");
  });

  it("escapes attribute values", () => {
    const result = renderPreview(
      {
        elmType: "div",
        attributes: { title: "Hello & \"World\"" },
        txtContent: "Safe",
      },
      {},
    );

    expect(result.html).toContain("title=\"Hello &amp; &quot;World&quot;\"");
  });

  it("renders number and boolean expressions", () => {
    const result = renderPreview(
      {
        elmType: "div",
        txtContent: 42,
        children: [{ elmType: "span", txtContent: true }],
      },
      {},
    );

    expect(result.html).toContain("42");
    expect(result.html).toContain("true");
  });

  it("renders arrays of nodes", () => {
    const result = renderPreview([
      { elmType: "span", txtContent: "A" },
      { elmType: "span", txtContent: "B" },
    ], {});

    expect(result.html).toContain("A");
    expect(result.html).toContain("B");
  });

  it("returns a fallback message when no content is rendered", () => {
    const result = renderPreview(null, {});

    expect(result.html).toBe("<div>Nothing to preview yet.</div>");
  });
});
