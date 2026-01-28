"use client";

import { useEffect, useRef, useState } from "react";
import type { editor as MonacoEditor } from "monaco-editor";
import { sanitizeJsonString } from "../../lib/validation/sanitizeJson";

interface JsonEditorProps {
  value: unknown;
  onValidJson: (value: unknown) => void;
  onParseError: (message?: string) => void;
}

export const JsonEditor = ({
  value,
  onValidJson,
  onParseError,
}: JsonEditorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [fallbackText, setFallbackText] = useState(
    JSON.stringify(value, null, 2),
  );

  useEffect(() => {
    setFallbackText(JSON.stringify(value, null, 2));
  }, [value]);

  useEffect(() => {
    let disposed = false;

    const setupEditor = async () => {
      if (!containerRef.current) {
        return;
      }
      const monaco = await import("monaco-editor");
      if (disposed || !containerRef.current) {
        return;
      }
      const editorInstance = monaco.editor.create(containerRef.current, {
        value: JSON.stringify(value, null, 2),
        language: "json",
        minimap: { enabled: false },
        automaticLayout: true,
      });
      editorInstance.onDidChangeModelContent(() => {
        const raw = editorInstance.getValue();
        const result = sanitizeJsonString(raw);
        if (result.ok) {
          onParseError(undefined);
          onValidJson(result.value);
        } else {
          onParseError(result.error);
        }
      });
      editorRef.current = editorInstance;
      setIsReady(true);
    };

    setupEditor();

    return () => {
      disposed = true;
      editorRef.current?.dispose();
    };
  }, [onParseError, onValidJson, value]);

  const handleFallbackChange = (raw: string) => {
    setFallbackText(raw);
    const result = sanitizeJsonString(raw);
    if (result.ok) {
      onParseError(undefined);
      onValidJson(result.value);
    } else {
      onParseError(result.error);
    }
  };

  return (
    <section>
      <h2>JSON Editor</h2>
      <div className="json-editor" ref={containerRef} />
      {!isReady && (
        <textarea
          value={fallbackText}
          onChange={(event) => handleFallbackChange(event.target.value)}
          rows={12}
        />
      )}
    </section>
  );
};
