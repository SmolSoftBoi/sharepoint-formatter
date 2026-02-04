## 1. Dependency & Theme Setup

- [x] 1.1 Add Fluent UI v9 stable dependencies (`@fluentui/react-components`, `@fluentui/react-icons`) via yarn
- [x] 1.2 Configure `FluentProvider` at `app/layout.tsx` with light and dark themes driven by system colour scheme
- [x] 1.3 Wire up theme tokens and `makeStyles` for any necessary custom styling hooks

## 2. Component & Icon Migration

- [x] 2.1 Replace all buttons, inputs, and form controls with Fluent UI components
- [x] 2.2 Replace panels, layout containers, and messaging components with Fluent UI equivalents
- [x] 2.3 Swap all icon usage to `@fluentui/react-icons`
- [x] 2.4 Remove or refactor legacy UI primitives and component wrappers

## 3. Styling Cleanup & Accessibility

- [x] 3.1 Remove redundant global CSS that conflicts with Fluent UI styles
- [x] 3.2 Verify Fluent UI focus and interaction states across all user‑facing components
- [x] 3.3 Validate light/dark theme switching follows the OS setting with no manual toggle

## 4. Verification

- [x] 4.1 Run `yarn test` and resolve any regressions
- [x] 4.2 Run `yarn lint` and fix any lint failures
- [x] 4.3 Perform a full UI pass to confirm all components are Fluent UI and visually consistent
