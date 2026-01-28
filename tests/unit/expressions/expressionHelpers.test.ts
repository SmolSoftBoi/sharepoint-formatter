import { extractFieldReferences } from "../../../app/lib/expressions/expressionHelpers";

describe("expression helpers", () => {
  it("extracts field references from bracket expressions", () => {
    const fields = extractFieldReferences("=if([$Status] == 'Done', '✅', '⏳')");
    expect(fields).toEqual(["$Status"]);
  });
});
