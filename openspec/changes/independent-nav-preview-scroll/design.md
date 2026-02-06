## Context

The editor view currently renders navigation and preview in two main sections, but the overall page layout still allows the document to become the primary scroll container. This creates friction when users need to switch between controls in navigation and results in the preview pane being pushed out of view while working on longer JSON and sample data content.

The change is scoped to layout behaviour in the existing Next.js + Fluent UI. No data model, API, schema, or persistence changes are required.

## Goals / Non-Goals

**Goals:**
- Make navigation and preview panes independently scrollable in the desktop workspace.
- Keep both panes visible and usable without forcing users to scroll the full page to reach controls or preview output.
- Preserve existing component structure and behaviour, with minimal and reviewable CSS/layout changes.

**Non-Goals:**
- Redesign panel content, ordering, or visual style.
- Change validation, preview rendering logic, or export functionality.
- Introduce new dependencies or a new layout paradigm.

## Decisions

### 1. Constrain scrolling to panes, not the document

Decision:
- Use the application shell and main workspace as bounded containers (`min-height: 0` and `overflow: hidden` where appropriate).
- Keep `overflow-y: auto` on both navigation and preview pane containers so each pane owns its own scroll.

Rationale:
- Independent pane scrolling only works reliably when ancestor containers do not expand with content.
- This approach aligns with the current two-column architecture and requires minimal structural change.

Alternatives considered:
- Set fixed viewport heights on panes directly.
  - Rejected: brittle with header size changes and less resilient across breakpoints.
- Use JavaScript resize observers to recalculate pane heights.
  - Rejected: unnecessary complexity for a CSS-solvable layout issue.

### 2. Preserve current responsive behaviour

Decision:
- Keep the existing responsive breakpoint and section ordering.
- Apply scroll-container constraints in a way that does not force a visual redesign on narrow viewports.

Rationale:
- The change request targets UX friction in the existing layout, not a broader responsive redesign.
- Limiting scope reduces regression risk and keeps the diff small.

Alternatives considered:
- Introduce a mobile split-view with two fixed-height independently scrollable rows.
  - Rejected: changes interaction model and increases risk for smaller screens.

### 3. Validate behaviour with targeted UI tests

Decision:
- Add/extend component-level tests to assert the intended overflow-related layout styles on key containers.

Rationale:
- This change is behaviourally subtle and prone to regression through future CSS edits.
- Lightweight style assertions provide coverage without requiring end-to-end browser tests.

Alternatives considered:
- Rely on manual QA only.
  - Rejected: insufficient protection for recurring layout regressions.

## Risks / Trade-offs

- [Risk] Nested scroll containers may reduce discoverability of hidden content for some users.
  - Mitigation: keep spacing, borders, and panel grouping clear so scroll regions remain visually obvious.
- [Risk] Small CSS changes in shell or page containers can unintentionally break independent scrolling.
  - Mitigation: document the scroll-container contract and cover key style expectations in tests.
- [Trade-off] Desktop behaviour is prioritised; narrow viewport interaction remains largely unchanged.
  - Mitigation: explicitly track mobile UX improvements separately if needed.

## Migration Plan

1. Update shell and page layout styles to establish bounded containers and pane-level scrolling.
2. Verify desktop behaviour manually in dev mode with long navigation content and long preview/editor content.
3. Add/adjust tests covering layout style contracts for scroll behaviour.
4. Release with no data migration and no runtime configuration changes.

Rollback strategy:
- Revert the layout style changes in shell/page styles to restore current scrolling behaviour.

## Open Questions

- Should independent pane scrolling also be enforced on narrow/mobile layouts, or remain desktop-focused?
- Do we need explicit visual affordances (for example subtle pane shadows) to signal scrollable regions?
