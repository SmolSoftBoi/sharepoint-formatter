# Quickstart: SharePoint Formatter App

## Prerequisites
- Node.js 20+
- Yarn

## Install
1. Install dependencies.
2. Start the dev server.

## Core Workflows to Verify
- Select formatter type and template; confirm JSON and preview update.
- Edit JSON; confirm schema validation errors appear.
- Modify sample list item data; confirm preview updates.
- Export via clipboard, download, and SharePoint-ready snippet.
- Disable network and confirm editor/validation/preview still function.

## Tests
- Run unit tests for validator, schema loader, expression helpers, template generator.
- Run integration test for offline cache (`tests/integration/offline.spec.ts`).
