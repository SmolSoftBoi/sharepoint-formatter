# Capability Specification: Fluent UI Alignment

## Purpose

Align the SharePoint Formatter UI with Microsoft’s Fluent UI v9 design system so the interface is consistent, accessible, and predictable across all user‑facing surfaces.

## Requirements

### Requirement: Fluent UI v9 stable baseline
The system SHALL use Fluent UI React v9 stable packages for all UI components and theming.

#### Scenario: Baseline packages are in use
- **WHEN** the application dependencies are inspected
- **THEN** the Fluent UI component package is `@fluentui/react-components` at a v9 stable release

#### Scenario: Provider-backed theming is enabled
- **WHEN** the application renders any page
- **THEN** it is wrapped in a Fluent UI provider so tokens are applied consistently

### Requirement: Fluent UI icons are standardised
The system SHALL use Fluent UI icons from `@fluentui/react-icons` for UI iconography.

#### Scenario: Icons render from Fluent UI
- **WHEN** a UI icon is rendered
- **THEN** it is sourced from `@fluentui/react-icons`

### Requirement: Full component migration
The system SHALL migrate all user-facing UI components to Fluent UI equivalents so no legacy UI primitives remain.

#### Scenario: Primary UI primitives are Fluent UI components
- **WHEN** the main formatter view renders
- **THEN** all buttons, inputs, panels, and messaging elements are Fluent UI components

### Requirement: System-driven theme selection
The system SHALL follow the operating system colour scheme for light and dark themes and SHALL not expose a manual theme toggle.

#### Scenario: System is set to dark theme
- **WHEN** the operating system colour scheme is dark
- **THEN** the UI uses the dark theme tokens

#### Scenario: System is set to light theme
- **WHEN** the operating system colour scheme is light
- **THEN** the UI uses the light theme tokens

#### Scenario: No manual theme toggle
- **WHEN** a user views settings or page controls
- **THEN** no manual theme selection control is present

### Requirement: Fluent UI focus and interaction states
The system SHALL use Fluent UI default focus and interaction states to meet Microsoft accessibility expectations.

#### Scenario: Keyboard focus is visible
- **WHEN** a user navigates with the keyboard
- **THEN** focused controls display Fluent UI focus styling
