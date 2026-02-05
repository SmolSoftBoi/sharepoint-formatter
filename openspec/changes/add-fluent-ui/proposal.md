## Why

Align the formatter UI with Microsoft’s design language to improve familiarity, accessibility, and trust for users. This reduces bespoke styling and makes future UI changes faster and more consistent.

## What Changes

- Adopt Fluent UI React components for core UI elements (buttons, inputs, layout, panels, and messaging).
- Introduce Fluent UI design tokens (spacing, typography, colour) to replace custom styles.
- Standardise interaction and focus states to match Microsoft’s accessibility expectations.

## Capabilities

### New Capabilities
- `fluent-ui-alignment`: Replace custom UI primitives with Fluent UI components and tokens so the app follows Microsoft’s visual and interaction standards.

### Modified Capabilities

None.

## Impact

- UI layer in `app/` will shift to Fluent UI components and tokens.
- New dependency on Fluent UI React packages and related styling setup.
- Existing custom CSS and component styling will be reduced or removed where redundant.
- Potential bundle size changes and updated theming configuration.
