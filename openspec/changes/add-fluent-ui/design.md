## Context

The app currently uses bespoke styling and custom UI elements in `app/`. This change introduces Fluent UI React v9 components, icons, and tokens to align the interface with Microsoft’s design language, improving consistency and accessibility while reducing custom CSS maintenance.

Constraints: Next.js 16 App Router and TypeScript strict mode.

## Goals / Non-Goals

**Goals:**
- Provide a consistent Fluent UI foundation (provider, theme, tokens) for the app.
- Migrate all user‑facing UI components to Fluent UI equivalents (no legacy UI primitives remain).
- Standardise focus and interaction states using Fluent UI defaults.
- Use Fluent UI icons for all iconography.
- Follow the system colour scheme for light/dark themes without a manual toggle.

**Non-Goals:**
- A full visual redesign beyond Fluent UI alignment.
- Bespoke theming beyond Fluent UI defaults.

## Decisions

- **Use Fluent UI React v9 stable components (`@fluentui/react-components`)** over v8 to match Microsoft’s current design system and reduce legacy surface area.
  - *Alternative considered:* v8 (`@fluentui/react`) for wider component coverage, but it is heavier and less aligned with current Fluent guidance.

- **Wrap the app with `FluentProvider` at the root layout** to apply theme tokens and enable consistent styling.
  - *Alternative considered:* ad‑hoc per‑component providers, which fragments theme usage and increases boilerplate.

- **Adopt tokens and `makeStyles` for any necessary custom styles** to keep custom CSS aligned with Fluent UI spacing and typography.
  - *Alternative considered:* retaining global CSS overrides, which risks specificity conflicts and inconsistent spacing.

- **Use Fluent UI icons (`@fluentui/react-icons`)** as the single icon source.
  - *Alternative considered:* mixed icon sets, which reduces consistency and increases bundle variability.

- **Follow the system colour scheme for light and dark themes** without exposing a manual toggle.
  - *Alternative considered:* user‑selectable themes, which adds UI surface area and state persistence requirements.

- **Migrate all user‑facing components in one pass**, ensuring no legacy primitives remain.
  - *Alternative considered:* incremental migration, which prolongs mixed styling and increases maintenance complexity.

## Risks / Trade-offs

- **Bundle size increase** → Mitigate by importing only required components and auditing bundle impact after migration.
- **Visual regressions from a full swap** → Mitigate with targeted UI checks across all views before release.
- **Style precedence conflicts with existing CSS** → Mitigate by removing redundant CSS and avoiding global overrides.
- **SSR/styling integration issues** → Mitigate by using Fluent UI’s recommended provider setup for Next.js and validating in local builds.

## Migration Plan

1. Add Fluent UI dependencies (v9 stable components and icons) and configure the root `FluentProvider` in `app/layout.tsx`.
2. Replace all user‑facing UI components and iconography with Fluent UI equivalents.
3. Remove or refactor redundant CSS where Fluent UI provides equivalent styling.
4. Verify keyboard/focus states, system theme behaviour, and accessibility behaviour.
5. Audit bundle size and performance, adjusting imports if needed.

## Open Questions

- None at present.
