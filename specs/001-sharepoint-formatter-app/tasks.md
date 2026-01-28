---

description: "Task list for SharePoint Formatter app"

---

# Tasks: SharePoint Formatter App

**Input**: Design documents from `/specs/001-sharepoint-formatter-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED for core validation/serialization logic and requested for validator, schema loader, expression helpers, template generator.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of the stories.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize a Next.js 16 app using TypeScript with strict type checking and a basic app shell consistent with the design requirements in `spec.md` and `plan.md`.
- [x] T002 [P] Add Monaco Editor, AJV, and the `idb` IndexedDB helper library to `package.json` with explicit semver version ranges or minimum versions specified for each dependency.
- [x] T003 [P] Configure Jest + React Testing Library in `jest.config.ts`, `jest.setup.ts`, `package.json`, root-level `tests/` directory.
- [x] T004 [P] Create base app shell layout and styles in `app/layout.tsx`, `app/page.tsx`, `app/styles/globals.css`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T005 Define formatter types and shared models in `app/lib/formatters/types.ts`.
- [x] T006 [P] Add SharePoint v2 schemas in `app/schemas/sharepoint-v2/*.json` and index in `app/schemas/sharepoint-v2/index.ts`.
- [x] T007 [P] Implement schema loader in `app/lib/validation/schemaLoader.ts`.
- [x] T008 Implement AJV validator service in `app/lib/validation/validator.ts`.
- [x] T009 [P] Implement expression helper utilities in `app/lib/expressions/expressionHelpers.ts`.
- [x] T010 Implement local persistence (auto-save + drafts) in `app/lib/persistence/storage.ts`.
- [x] T011 [P] Implement editor state store in `app/editor/state/editorStore.ts`.
- [x] T012 [P] Create template catalog data in `app/templates/catalog/templates.ts`.
- [x] T013 [P] Create guided pattern definitions in `app/templates/catalog/guidedPatterns.ts`.
- [x] T014 [P] Define sample list item presets in `app/editor/state/sampleData.ts`.
- [x] T015 Implement preview renderer core in `app/preview/renderer/render.ts`.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create a formatter from a template (Priority: P1) 🎯 MVP

**Goal**: Users select a formatter type and template, then see a live preview with sample data.

**Independent Test**: Select a formatter type and template and confirm JSON and preview update with sample data edits.

### Tests for User Story 1

- [x] T016 [P] [US1] Unit test template catalog integrity in `tests/unit/templates/templateCatalog.test.ts`.

### Implementation for User Story 1

- [x] T017 [P] [US1] Build formatter type selector panel in `app/editor/panels/FormatterTypePanel.tsx`.
- [x] T018 [P] [US1] Build template selector panel in `app/editor/panels/TemplatePanel.tsx`.
- [x] T019 [P] [US1] Build sample data editor panel in `app/editor/panels/SampleDataPanel.tsx`.
- [x] T020 [P] [US1] Build preview pane UI in `app/preview/components/PreviewPane.tsx`.
- [x] T021 [US1] Wire template selection to JSON state in `app/editor/state/editorStore.ts`.
- [x] T022 [US1] Connect preview pane to renderer in `app/preview/components/PreviewPane.tsx`.
- [x] T023 [US1] Compose left nav + split view layout in `app/page.tsx`.

**Checkpoint**: User Story 1 functional and independently testable

---

## Phase 4: User Story 2 - Validate and refine JSON with guidance (Priority: P2)

**Goal**: Users edit JSON with schema-aware help, guided patterns, and clear errors/hints.

**Independent Test**: Introduce invalid JSON or expressions and verify actionable validation feedback appears.

### Tests for User Story 2

- [ ] T024 [P] [US2] Unit test schema loader in `tests/unit/schemas/schemaLoader.test.ts`.
- [ ] T025 [P] [US2] Unit test AJV validator in `tests/unit/validation/validator.test.ts`.
- [ ] T026 [P] [US2] Unit test expression helpers in `tests/unit/expressions/expressionHelpers.test.ts`.

### Implementation for User Story 2

- [ ] T027 [P] [US2] Implement JSON sanitization helper in `app/lib/validation/sanitizeJson.ts`.
- [ ] T028 [P] [US2] Add Monaco JSON editor component in `app/editor/components/JsonEditor.tsx`.
- [ ] T029 [P] [US2] Add validation errors panel in `app/editor/components/ValidationPanel.tsx`.
- [ ] T030 [P] [US2] Add guided pattern panel in `app/editor/panels/GuidedPatternPanel.tsx`.
- [ ] T031 [P] [US2] Add expression examples reference in `app/lib/expressions/examples.ts` and `app/editor/components/ExpressionReference.tsx`.
- [ ] T032 [US2] Wire validation + hints into editor state in `app/editor/state/editorStore.ts`.
- [ ] T033 [US2] Connect guided patterns to JSON updates in `app/editor/state/editorStore.ts`.

**Checkpoint**: User Stories 1 and 2 functional and independently testable

---

## Phase 5: User Story 3 - Export formatter outputs (Priority: P3)

**Goal**: Users export their formatter via clipboard, download, or SharePoint-ready snippet.

**Independent Test**: Export in each format and confirm content matches current JSON and formatter type.

### Implementation for User Story 3

- [ ] T034 [P] [US3] Implement export helpers in `app/lib/export/exporters.ts`.
- [ ] T035 [P] [US3] Implement SharePoint-ready snippet generator in `app/lib/export/sharepointSnippet.ts`.
- [ ] T036 [P] [US3] Add export panel actions in `app/editor/panels/ExportPanel.tsx`.
- [ ] T037 [P] [US3] Add user-initiated save action in `app/editor/components/SaveDraftButton.tsx`.
- [ ] T038 [US3] Wire export + save actions into editor state in `app/editor/state/editorStore.ts`.
- [ ] T039 [P] [US3] Unit test export helpers and snippet generation in `tests/unit/export/exporters.test.ts`.

**Checkpoint**: All user stories functional and independently testable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T040 [P] Add keyboard focus styles and ARIA labels in `app/styles/accessibility.css` and `app/editor/components/*.tsx`.
- [ ] T041 [P] Add offline status indicator in `app/editor/components/OfflineStatus.tsx`.
- [ ] T042 [P] Add offline caching strategy in `app/lib/persistence/offlineCache.ts`, `app/layout.tsx` (acceptance: core editor, validation, and preview work after disabling network post-initial-load).
- [ ] T043 [P] Add automated offline smoke test in `tests/integration/offline.spec.ts` to verify offline behavior after initial load.
- [ ] T044 [P] Document and perform manual offline smoke test workflow in `specs/001-sharepoint-formatter-app/quickstart.md`.
- [ ] T045 Performance tune preview rendering in `app/preview/renderer/render.ts`.
- [ ] T046 Run quickstart workflow validation and update notes in `specs/001-sharepoint-formatter-app/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - no dependencies on other stories
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - no dependencies on other stories

### Parallel Opportunities

- Setup tasks T002–T004 can run in parallel.
- Foundational tasks T006–T014 can run in parallel after T005.
- User stories can proceed in parallel once Foundational completes.
- Test tasks T016, T024–T026 can run in parallel.

---

## Parallel Example: User Story 1

```bash
T017 [P] [US1] Build formatter type selector panel in app/editor/panels/FormatterTypePanel.tsx
T018 [P] [US1] Build template selector panel in app/editor/panels/TemplatePanel.tsx
T019 [P] [US1] Build sample data editor panel in app/editor/panels/SampleDataPanel.tsx
T020 [P] [US1] Build preview pane UI in app/preview/components/PreviewPane.tsx
```

---

## Parallel Example: User Story 2

```bash
T024 [P] [US2] Unit test schema loader in tests/unit/schemas/schemaLoader.test.ts
T025 [P] [US2] Unit test AJV validator in tests/unit/validation/validator.test.ts
T026 [P] [US2] Unit test expression helpers in tests/unit/expressions/expressionHelpers.test.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate User Story 1 independently

### Incremental Delivery

1. Setup + Foundational
2. User Story 1 → validate
3. User Story 2 → validate
4. User Story 3 → validate
5. Polish tasks as needed

---

## Notes

- Tasks marked with [P] can be implemented in parallel because they affect different files and have no interdependencies.
- Each user story can be delivered independently after foundational work
- Tests for validator, schema loader, expression helpers, and templates are required
