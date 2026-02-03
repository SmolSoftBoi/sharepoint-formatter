"use client";

import { useEffect } from "react";
import { FormatterTypePanel } from "./editor/panels/FormatterTypePanel";
import { TemplatePanel } from "./editor/panels/TemplatePanel";
import { SampleDataPanel } from "./editor/panels/SampleDataPanel";
import { GuidedPatternPanel } from "./editor/panels/GuidedPatternPanel";
import { JsonEditor } from "./editor/components/JsonEditor";
import { ValidationPanel } from "./editor/components/ValidationPanel";
import { ExpressionReference } from "./editor/components/ExpressionReference";
import { ExportPanel } from "./editor/panels/ExportPanel";
import { SaveDraftButton } from "./editor/components/SaveDraftButton";
import { OfflineStatus } from "./editor/components/OfflineStatus";
import { PreviewPane } from "./preview/components/PreviewPane";
import { TEMPLATE_CATALOG } from "./templates/catalog/templates";
import { SAMPLE_DATA_PRESETS } from "./editor/state/sampleData";
import {
  setFormatterType,
  setJson,
  setJsonParseError,
  setSampleData,
  setTemplateId,
  useEditorState,
} from "./editor/state/editorStore";

/**
 * Render the editor page UI that wires the centralized editor state to all panels and the live JSON preview.
 *
 * The component keeps the template list in sync with the selected formatter type, initializes default sample
 * data when none is present, and provides handlers to apply templates or guided patterns which update the
 * editor's template selection and JSON definition.
 *
 * @returns The Home page editor UI as a JSX element
 */
export default function HomePage() {
  const editorState = useEditorState();
  const templates = TEMPLATE_CATALOG.filter(
    (template) => template.formatterTypeId === editorState.formatterTypeId,
  );

  useEffect(() => {
    if (Object.keys(editorState.sampleData).length === 0) {
      setSampleData(SAMPLE_DATA_PRESETS["Default Sample"]);
    }
  }, [editorState.sampleData]);

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATE_CATALOG.find((item) => item.id === templateId);
    if (!template) {
      return;
    }
    setTemplateId(template.id);
    setJson(template.jsonDefinition);
  };

  return (
    <div className="editor-layout">
      <aside className="editor-nav">
        <FormatterTypePanel
          selectedId={editorState.formatterTypeId}
          onSelect={setFormatterType}
        />
        <TemplatePanel
          templates={templates}
          selectedId={editorState.templateId}
          onSelect={applyTemplate}
        />
        <GuidedPatternPanel
          formatterTypeId={editorState.formatterTypeId}
          onApply={(pattern, values) => {
            setTemplateId(undefined);
            setJson(pattern.outputTransform(values));
          }}
        />
        <ExpressionReference />
        <SampleDataPanel
          sampleData={editorState.sampleData}
          onUpdate={setSampleData}
        />
        <SaveDraftButton />
        <OfflineStatus />
      </aside>
      <section className="editor-preview">
        <JsonEditor
          value={editorState.json}
          onValidJson={setJson}
          onParseError={setJsonParseError}
        />
        <ValidationPanel
          parseError={editorState.parseError}
          errors={editorState.validationErrors}
        />
        <ExportPanel
          formatterTypeId={editorState.formatterTypeId}
          json={editorState.json}
        />
        <PreviewPane json={editorState.json} sampleData={editorState.sampleData} />
      </section>
    </div>
  );
}