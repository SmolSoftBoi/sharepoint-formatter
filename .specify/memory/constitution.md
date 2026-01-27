<!--
Sync Impact Report
- Version change: N/A (template) → 1.0.0
- Modified principles: None (template placeholders replaced)
- Added sections: Core Principles, Additional Constraints, Development Workflow, Governance
- Removed sections: None
- Templates requiring updates: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md, ⚠ .specify/templates/commands/*.md (directory missing)
- Follow-up TODOs: TODO(RATIFICATION_DATE): original adoption date not provided
-->
# SharePoint Formatter Constitution

## Core Principles

### I. TypeScript-First, Strict Typing
All production code MUST be written in TypeScript with strict compiler settings
enabled. The `any` type is forbidden; use unknown + narrowing or precise types.
Rationale: prevents runtime errors and preserves schema safety.

### II. Specs Define WHAT/WHY, Plans Define HOW
Specs MUST describe user needs, requirements, and rationale without
implementation details. Plans MUST contain implementation strategy, tooling,
and architecture decisions. Rationale: keeps intent stable while designs evolve.

### III. SharePoint v2 Schema Validation
All formatter JSON MUST be validated against Microsoft SharePoint v2 schemas
for column, row, view, tile, board, and calendar formats. Rationale: ensures
output compatibility with SharePoint rendering.

### IV. Offline-First, Local-Only by Default
User data MUST remain local unless a user explicitly exports it. The app MUST
function offline without degraded core editing or validation workflows.
Rationale: privacy and reliability.

### V. Security and Sanitization
Secrets MUST NOT be committed to the repository. Any pasted JSON MUST be
sanitized, and eval-style logic is prohibited. Rationale: protect users and
prevent code injection.

### VI. Tests for Core Validation and Serialization
Core validation and serialization logic MUST have automated tests. Rationale:
these are safety-critical paths and must not regress.

### VII. Accessibility, Keyboard-First
Editor and preview experiences MUST be usable via keyboard alone, with
accessible focus order and clear focus visibility. Rationale: inclusive UX.

## Additional Constraints

- Formatter validation MUST use official Microsoft SharePoint v2 schemas.
- Data storage MUST default to local persistence with explicit export controls.
- Input handling MUST sanitize pasted JSON before processing or preview.

## Development Workflow

- Specs stay implementation-free; implementation details belong in plans/tasks.
- Strict typing (no `any`) enforced in CI and code review.
- Core validation/serialization tests are required for merge.
- Accessibility checks must include keyboard-only workflows for editor/preview.

## Governance

- This constitution supersedes all other development guidance.
- Amendments require a documented rationale, updated version, and review.
- Versioning follows semantic versioning:
	- MAJOR: principle removal or incompatible governance change
	- MINOR: new principle or materially expanded guidance
	- PATCH: clarifications and wording fixes
- All PRs MUST confirm compliance with Core Principles and Workflow.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date not provided | **Last Amended**: 2026-01-27
