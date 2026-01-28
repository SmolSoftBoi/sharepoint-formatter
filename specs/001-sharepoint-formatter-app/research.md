# Research: SharePoint Formatter App

## Decisions

### Validation approach
- **Decision**: Use AJV with Microsoft SharePoint v2 JSON schemas, bundled locally per formatter type.
- **Rationale**: Provides schema-accurate validation aligned with SharePoint rendering while remaining offline-capable.
- **Alternatives considered**: Custom validators; JSON-only syntax validation without schema.

### Editor technology
- **Decision**: Monaco Editor for JSON editing with schema assistance and diagnostics.
- **Rationale**: Best-in-class JSON UX with inline errors and schema hints; integrates well in modern web apps.
- **Alternatives considered**: CodeMirror; simple textarea with manual validation.

### Rendering strategy
- **Decision**: Client-side preview renderer supporting major elmTypes, styles, attributes, expressions, and actions with high-fidelity rendering consistent with the reasonable tolerance for minor visual differences defined in spec.md.
- **Rationale**: Enables offline previews without SharePoint dependency while aiming for SharePoint-like visual output, while explicitly allowing minor visual differences as permitted by spec.md.
- **Alternatives considered**: Basic preview (structural only); embedding SharePoint iframe (requires network/access).

### Persistence
- **Decision**: Local persistence using IndexedDB/localStorage with auto-save plus user-initiated save/export.
- **Rationale**: Satisfies offline-first and explicit export requirements while minimizing user data loss.
- **Alternatives considered**: No persistence; export-only flows.

### Application framework
- **Decision**: Next.js 16 with TypeScript and Yarn.
- **Rationale**: Stable React-based platform with strong tooling and TypeScript-first development.
- **Alternatives considered**: Vite + React; vanilla SPA.

### Testing focus
- **Decision**: Unit tests for validator, schema loader, expression helpers, template generator.
- **Rationale**: These are the highest-risk, correctness-critical modules.
- **Alternatives considered**: End-to-end-only testing; manual validation.
