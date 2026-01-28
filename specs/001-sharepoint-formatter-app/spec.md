# Feature Specification: SharePoint Formatter App

**Feature Branch**: `001-sharepoint-formatter-app`  
**Created**: 2026-01-27  
**Status**: Draft  
**Input**: User description: "Build a SharePoint Formatter app that helps users create, validate, and preview SharePoint list formatting JSON. Core user journeys: - Choose formatter type: Column, Row/View (List/Compact), Tiles, Board (Kanban), Calendar - Start from templates (badges, status pills, due-date warnings, progress bars, people cards) - Edit JSON with schema-aware help (errors, hints), plus a guided form for common patterns - Preview rendering using sample list item data (mock fields + values) - Export: copy-to-clipboard, download JSON, and “SharePoint-ready” snippets Non-functional: - Fast, reliable, works offline, no account required - Clear error messages and examples for SharePoint expressions"

## Clarifications

### Session 2026-01-27

- Q: What level of validation is required? → A: Validate against official SharePoint formatting schema per formatter type.
- Q: How should work be persisted locally? → A: Both auto-save in browser storage and user-initiated save.
- Q: What preview fidelity is required? → A: High-fidelity preview closely matching SharePoint rendering in the latest stable Edge and Chrome, using SharePoint v2 schema-compatible HTML/CSS behavior as the baseline.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a formatter from a template (Priority: P1)

A user selects a formatter type, picks a starter template, and immediately sees a preview based on sample list item data.

**Why this priority**: This is the fastest path to value and proves the tool’s usefulness in minutes.

**Independent Test**: Can be fully tested by selecting a formatter type, applying a template, and verifying the preview renders with sample data.

**Acceptance Scenarios**:

1. **Given** the app is open, **When** a user selects a formatter type and a template, **Then** the JSON populates and a preview renders.
2. **Given** a template is applied, **When** the user edits sample field values, **Then** the preview updates to reflect the new data.

---

### User Story 2 - Validate and refine JSON with guidance (Priority: P2)

A user edits the formatting JSON directly or via guided form patterns and receives clear errors and hints.

**Why this priority**: Editing and validation are essential for real-world formatting beyond templates.

**Independent Test**: Can be fully tested by introducing an invalid JSON or expression and confirming actionable feedback appears.

**Acceptance Scenarios**:

1. **Given** a user edits JSON, **When** the JSON is invalid or contains an invalid expression, **Then** the app shows a clear error and a helpful example.
2. **Given** a user chooses a guided pattern, **When** they fill in the form, **Then** the JSON updates accordingly and the preview reflects it.

---

### User Story 3 - Export formatter outputs (Priority: P3)

A user exports their formatter via copy, download, or a SharePoint-ready snippet.

**Why this priority**: Sharing and applying the formatter is the final step to getting value from the tool.

**Independent Test**: Can be fully tested by exporting in each format and confirming the output matches the current JSON.

**Acceptance Scenarios**:

1. **Given** a valid formatter, **When** the user selects copy-to-clipboard, **Then** the clipboard contains the current JSON.
2. **Given** a valid formatter, **When** the user selects download or SharePoint-ready snippet, **Then** the exported content matches the current JSON and type.

---

### Edge Cases

- Invalid JSON syntax prevents preview rendering.
- Expressions reference fields not present in the sample data.
- A template is selected that is not compatible with the chosen formatter type.
- User works offline after initial load.
- Large numbers of sample fields cause slower previews.

## Requirements *(mandatory)*

**Constraint**: Requirements in this spec MUST stay implementation-free.
Capture WHAT and WHY here; defer HOW to plan.md.

### Functional Requirements

- **FR-001**: The system MUST allow users to choose a formatter type from Column, Row/View (List/Compact), Tiles, Board (Kanban), and Calendar.
- **FR-002**: The system MUST provide starter templates for badges, status pills, due-date warnings, progress bars, and people cards.
- **FR-003**: The system MUST apply a selected template to the chosen formatter type and show the resulting JSON.
- **FR-004**: The system MUST validate JSON against the official SharePoint formatting schema for the selected formatter type, with clear error locations and helpful hints.
- **FR-005**: The system MUST provide a guided form for common formatting patterns that updates the JSON.
- **FR-006**: The system MUST render a preview using editable sample list item data.
- **FR-007**: The system MUST support export via copy-to-clipboard, JSON download, and SharePoint-ready snippets that wrap the formatter JSON in the SharePoint v2 schema container defined in the official schema file for the selected formatter type (e.g., `column-formatting.json`, `row-formatting.json`, `view-formatting.json`, `tile-formatting.json`, `board-formatting.json`, `calendar-formatting.json`).
- **FR-008**: The system MUST function without an account and without a network connection after initial load.
- **FR-009**: The system MUST provide clear, example-driven error messages for SharePoint expressions.
- **FR-010**: The system MUST auto-save work to local browser storage and also provide a user-initiated save action.
- **FR-011**: The system MUST provide high-fidelity preview output that closely matches SharePoint rendering for the selected formatter type in the latest stable Edge and Chrome, using SharePoint v2 schema-compatible HTML/CSS behavior as the baseline.

**SharePoint v2 container mapping (reference)**

| Formatter Type | Schema File | Container Key |
| --- | --- | --- |
| Column | `column-formatting.json` | `columnFormatting` |
| Row | `row-formatting.json` | `rowFormatting` |
| View (List/Compact) | `view-formatting.json` | `viewFormatting` |
| Tiles | `tile-formatting.json` | `tileFormatting` |
| Board (Kanban) | `board-formatting.json` | `boardFormatting` |
| Calendar | `calendar-formatting.json` | `calendarFormatting` |

### Key Entities *(include if feature involves data)*

- **Formatter Type**: The selected presentation style (e.g., Column, Row/View, Tiles, Board, Calendar).
- **Template**: A predefined starting configuration for a formatter type.
- **Formatting JSON**: The current formatter definition the user edits and exports.
- **Sample List Item**: Mock fields and values used to render previews.
- **Export Artifact**: A formatted output variant (clipboard content, downloadable JSON, or SharePoint-ready snippet).

### Assumptions

- Templates are scoped to compatible formatter types.
- Sample data includes common field types (text, number, date, person) to demonstrate typical expressions.
- SharePoint-ready snippets include the minimal JSON structure needed for the chosen formatter type.

### Dependencies

- None identified beyond a modern web browser environment.

### Out of Scope

- Direct publishing of formatting to a live SharePoint site.
- User accounts, collaboration, or cloud-saved projects.
- Importing live SharePoint list schemas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of users can create a formatter (from template or guided form) and export it within 5 minutes.
- **SC-002**: Previews update within 2 seconds for a standard sample item set of up to 20 fields.
- **SC-003**: 95% of invalid JSON or expression errors surface a specific, actionable message with an example.
- **SC-004**: All core workflows (type selection, template use, editing, preview, export) work with the network disabled after initial load.
