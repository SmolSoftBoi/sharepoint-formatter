import { renderPreview } from "../../../app/preview/renderer/render";

describe("renderPreview", () => {
  it("renders field expressions from sample data", () => {
    const result = renderPreview({ elmType: "span", txtContent: "[$Title]" }, { Title: "Alpha" });

    expect(result.html).toContain("<span");
    expect(result.html).toContain("Alpha");
    expect(result.warnings).toEqual([]);
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

  it("returns a fallback message when no content is rendered", () => {
    const result = renderPreview(null, {});

    expect(result.html).toBe("<div>Nothing to preview yet.</div>");
  });
});
