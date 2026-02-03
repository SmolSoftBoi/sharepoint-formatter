# SharePoint Formatter

Create, validate, preview, and export SharePoint list formatting JSON. Works offline, no account required.

## Features

- Formatter type selection (Column, Row, View, Tiles, Board, Calendar)
- Templates and guided patterns
- Monaco JSON editor with schema validation
- Live preview with sample data
- Export: copy JSON, download JSON, SharePoint snippet
- Local drafts (auto-save + manual save)
- Offline status indicator

## Getting started

### Prerequisites

- Node.js 20+
- Yarn

### Install

1. Install dependencies.
2. Download official SharePoint schemas.
3. Start the dev server.

## Scripts

- `yarn dev` — start dev server
- `yarn build` — build for production
- `yarn start` — run production server
- `yarn test` — run tests
- `yarn schemas:download` — download official SharePoint schemas

## Offline support

The app uses local storage for drafts and a lightweight cache bootstrap. After the initial load, core editor, validation, and preview flows should work offline.

## Tests

- Unit tests for validation, schema loading, expressions, templates, export
- Integration test for offline cache

## Project structure (high-level)

```text
app/
	editor/
	preview/
	schemas/
	lib/
tests/
specs/
```

## Notes

- SharePoint schema files are downloaded into `app/schemas/sharepoint-v2/`.
- Preview renderer has an initial implementation and will continue to evolve toward higher-fidelity SharePoint output.