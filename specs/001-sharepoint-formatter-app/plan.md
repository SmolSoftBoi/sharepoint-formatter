# Implementation Plan: SharePoint Formatter App

**Branch**: `001-sharepoint-formatter-app` | **Date**: 2026-01-27 | **Spec**: `/specs/001-sharepoint-formatter-app/spec.md`
**Input**: Feature specification from `/specs/001-sharepoint-formatter-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build an offline-first SharePoint formatter editor that supports type selection, templates, schema-aware validation, guided patterns, previews with sample data, and export options. The implementation will use a Next.js 16 single-page editor with Monaco for JSON editing, AJV-backed SharePoint v2 schema validation, and a client-side preview renderer aligned to SharePoint output fidelity.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (strict) with Next.js 16  
**Primary Dependencies**: Next.js 16, React, Monaco Editor, AJV, SharePoint v2 JSON schemas (bundled locally)  
**Storage**: Local persistence via IndexedDB/localStorage (drafts)  
**Testing**: Jest + React Testing Library (unit tests for validator, schema loader, expression helpers, template generator)  
**Target Platform**: Modern evergreen browsers (offline-capable)  
**Project Type**: Web application (single-page editor experience)  
**Performance Goals**: Preview updates under 2 seconds for up to 20 fields  
**Constraints**: Offline-first, no account required, pixel-perfect preview target  
**Scale/Scope**: Single feature app with editor, preview, templates, and export flows

### Preview Fidelity Tolerances

The preview renderer should match SharePoint rendering closely in the latest stable Edge and Chrome. Acceptable visual differences are limited to browser/OS rendering variations:

- Spacing/alignment differences no greater than ±1 CSS pixel in any direction.
- Font rendering differences limited to sub-pixel anti-aliasing and hinting, without changing the chosen font family or nominal font size/weight beyond ±0.5 CSS pixels or one weight step.
- Color differences limited to imperceptible shifts consistent with sRGB anti-aliasing or device pixel density behavior.

Any deviation beyond these tolerances should be treated as a preview fidelity defect.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Strict TypeScript with `any` prohibited.
- Spec contains WHAT/WHY only; plan covers HOW and tooling.
- SharePoint v2 schemas used for column/row/view/tile/board/calendar validation.
- Offline-first: local data by default, explicit export only.
- Security: no secrets in repo, sanitize pasted JSON, no eval-style logic.
- Core validation/serialization tests required.
- Accessibility: keyboard-first editor and preview flows.

**Gate Status**: PASS (no violations)

**Post-Design Gate Status**: PASS (no violations)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
app/
├── layout.tsx
├── page.tsx
├── editor/
│   ├── components/
│   ├── panels/
│   └── state/
├── preview/
│   ├── components/
│   └── renderer/
├── templates/
│   └── catalog/
├── schemas/
│   └── sharepoint-v2/
├── lib/
│   ├── validation/
│   ├── expressions/
│   ├── persistence/
│   └── export/
└── styles/

tests/
├── unit/
│   ├── validation/
│   ├── schemas/
│   ├── expressions/
│   └── templates/
└── fixtures/
```

**Structure Decision**: Single Next.js web application using the app router with feature-focused modules for editor, preview, templates, schemas, and shared libraries.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
