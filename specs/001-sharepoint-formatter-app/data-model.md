# Data Model: SharePoint Formatter App

## Entities

### FormatterType
- **Fields**: id, name, supportedElmTypes, schemaRef
- **Validation**: Must be one of Column, Row/View (List/Compact), Tiles, Board (Kanban), Calendar.
- **Relationships**: Has many Templates; uses one Schema.

### Template
- **Fields**: id, name, description, formatterTypeId, jsonDefinition, tags
- **Validation**: formatterTypeId must match a valid FormatterType; jsonDefinition must pass schema validation.
- **Relationships**: Belongs to FormatterType.

### FormattingJson
- **Fields**: id, formatterTypeId, content, version, lastUpdated
- **Validation**: content must be valid JSON and pass schema for formatterTypeId.
- **Relationships**: References FormatterType; derived from Template or GuidedPattern.

### GuidedPattern
- **Fields**: id, name, formatterTypeId, inputs, outputTransform
- **Validation**: inputs required for pattern; outputTransform must yield schema-valid JSON.
- **Relationships**: Applies to FormatterType; updates FormattingJson.

### SampleListItem
- **Fields**: id, fields (map of fieldName → typed value), sampleSetName
- **Validation**: field names unique; values conform to allowed types (text, number, date, person, boolean, choice, lookup).
- **Relationships**: Used by PreviewState.

### PreviewState
- **Fields**: formatterTypeId, formattingJsonId, sampleListItemId, renderOutput, lastRendered
- **Validation**: renderOutput must be generated from current formattingJson and sample data.
- **Relationships**: References FormattingJson and SampleListItem.

### Draft
- **Fields**: id, name, formatterTypeId, formattingJsonId, sampleListItemId, createdAt, updatedAt
- **Validation**: Must persist locally; deleted only via explicit user action.
- **Relationships**: References FormattingJson and SampleListItem.

### ExportArtifact
- **Fields**: id, type (clipboard|download|sharepointSnippet), formatterTypeId, content, createdAt
- **Validation**: content must match current FormattingJson; sharepointSnippet must match formatterTypeId.
- **Relationships**: Derived from FormattingJson.

### Schema
- **Fields**: id, formatterTypeId, version, schemaJson
- **Validation**: Must be official SharePoint v2 schema for formatter type.
- **Relationships**: Used by Validator.

## State Transitions

- **Template selected** → FormattingJson created/updated.
- **Guided pattern applied** → FormattingJson updated and revalidated.
- **JSON edited** → Validation state updated; PreviewState recalculated.
- **Sample data edited** → PreviewState recalculated.
- **Export triggered** → ExportArtifact generated.
