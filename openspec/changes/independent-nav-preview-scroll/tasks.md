## 1. Layout updates

- [x] 1.1 Update the workspace container styles to ensure the desktop editor area is height-bounded and does not rely on page-level scrolling.
- [x] 1.2 Update navigation and preview pane styles so each pane has independent `overflow-y` scrolling in the desktop layout.
- [x] 1.3 Ensure the stacked mobile layout remains unchanged in behaviour and does not enforce independent pane scrolling.

## 2. Validation and regression coverage

- [x] 2.1 Add or update component-level tests to assert the desktop layout keeps pane-level scrolling enabled for navigation and preview sections.
- [x] 2.2 Add or update tests to assert mobile/stacked layout behaviour remains desktop-focused for independent scrolling requirements.

## 3. Verification

- [x] 3.1 Manually verify desktop behaviour with long navigation and preview content to confirm panes scroll independently.
- [x] 3.2 Run quality gates (`yarn test` then `yarn lint`) and resolve any regressions related to layout or tests.
