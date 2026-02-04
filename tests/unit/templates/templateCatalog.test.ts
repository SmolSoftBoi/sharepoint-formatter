import { TEMPLATE_CATALOG } from "../../../app/templates/catalog/templates";

describe("template catalog", () => {
  it("provides at least one template", () => {
    expect(TEMPLATE_CATALOG.length).toBeGreaterThan(0);
  });

  it("has unique template ids", () => {
    const ids = TEMPLATE_CATALOG.map((template) => template.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
