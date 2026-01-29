import { extractFieldReferences } from "../../../app/lib/expressions/expressionHelpers";

describe("expression helpers", () => {
  it("extracts field references from bracket expressions", () => {
    const fields = extractFieldReferences("=if([$Status] == 'Done', '✅', '⏳')");
    expect(fields).toEqual(["$Status"]);
  });

  it("extracts multiple field references in order", () => {
    const fields = extractFieldReferences("=concat([$Title], ' - ', [$Owner_Name])");
    expect(fields).toEqual(["$Title", "$Owner_Name"]);
  });

  it("handles quoted field names", () => {
    const fields = extractFieldReferences("=if(['Status'] == 'Done', '✅', '⏳')");
    expect(fields).toEqual(["Status"]);
  });

  it("handles field names with spaces", () => {
    const fields = extractFieldReferences("=concat([$Title], ' - ', [$Owner Name])");
    expect(fields).toEqual(["$Title", "$Owner Name"]);
  });

  it("captures field references with dollar prefix", () => {
    const fields = extractFieldReferences("=if([$Status] == 'Done', [$Status], '')");
    expect(fields).toEqual(["$Status", "$Status"]);
  });

  it("returns an empty array when no references exist", () => {
    const fields = extractFieldReferences("=if(1 == 1, 'Yes', 'No')");
    expect(fields).toEqual([]);
  });
});
