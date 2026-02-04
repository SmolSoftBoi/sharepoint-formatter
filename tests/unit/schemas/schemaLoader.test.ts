import { getSchemaForType } from "../../../app/lib/validation/schemaLoader";

describe("schema loader", () => {
  it("returns a schema for column formatting", () => {
    const schema = getSchemaForType("column");
    expect(schema).toBeDefined();
  });
});
