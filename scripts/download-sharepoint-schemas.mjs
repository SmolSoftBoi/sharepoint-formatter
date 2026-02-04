import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const schemaDir = path.resolve(process.cwd(), "app", "schemas", "sharepoint-v2");

const schemas = [
  {
    url: "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
    filename: "column-formatting.json",
  },
  {
    url: "https://developer.microsoft.com/json-schemas/sp/v2/view-formatting.schema.json",
    filename: "view-formatting.json",
  },
  {
    url: "https://developer.microsoft.com/json-schemas/sp/v2/row-formatting.schema.json",
    filename: "row-formatting.json",
  },
  {
    url: "https://developer.microsoft.com/json-schemas/sp/v2/tile-formatting.schema.json",
    filename: "tile-formatting.json",
  },
  {
    url: "https://developer.microsoft.com/json-schemas/sp/v2/board-formatting.schema.json",
    filename: "board-formatting.json",
  },
  {
    url: "https://developer.microsoft.com/json-schemas/sp/v2/calendar-formatting.schema.json",
    filename: "calendar-formatting.json",
  },
];

const run = async () => {
  await mkdir(schemaDir, { recursive: true });

  for (const schema of schemas) {
    const response = await fetch(schema.url);
    if (!response.ok) {
      throw new Error(`Failed to download ${schema.url}: ${response.status} ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const outputPath = path.join(schemaDir, schema.filename);
    await writeFile(outputPath, buffer);
  }

  console.log(`Downloaded SharePoint schemas to ${schemaDir}`);
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
