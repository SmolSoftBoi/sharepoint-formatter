import {
  getJsonText,
  getSharePointSnippetText,
} from "../../../app/lib/export/exporters";

describe("export helpers", () => {
  it("serializes JSON with indentation", () => {
    const text = getJsonText({ a: 1 });
    expect(text).toContain("\n");
    expect(text).toContain("\"a\": 1");
  });

  it("wraps JSON in SharePoint container", () => {
    const text = getSharePointSnippetText("column", { foo: "bar" });
    expect(text).toContain("columnFormatting");
    expect(text).toContain("foo");
  });
});
