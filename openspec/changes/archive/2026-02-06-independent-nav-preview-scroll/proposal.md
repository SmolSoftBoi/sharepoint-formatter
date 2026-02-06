## Why

The current editor experience makes long navigation and preview content compete for the same viewport attention, which slows editing and increases context switching. Improving independent scrolling now addresses a visible UX friction point in the core authoring workflow.

## What Changes

- Update the editor layout so the navigation section and preview section are independently scrollable within the main workspace.
- Preserve responsive behaviour, including stacked layout on smaller viewports, while maintaining predictable access to both sections.
- Capture the independent-scroll behaviour as a formal requirement update to prevent regressions.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `001-sharepoint-formatter-app`: Refine layout requirements so navigation and preview sections scroll independently as part of the core editing experience.

## Impact

- Affected code: `app/page.tsx`, `app/components/AppShell.tsx` (`appShellStyleConfig`, `AppShellStyleSlots`), and `app/editor/layoutStyles.ts`.
- Affected tests: editor layout and UX behaviour checks for section scrolling.
- No API, data model, or dependency changes expected.
