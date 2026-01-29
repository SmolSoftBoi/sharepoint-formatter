"use client";

import { useEffect, useRef, useState } from "react";
import type { editor as MonacoEditor } from "monaco-editor";
import { sanitizeJsonString } from "../../lib/validation/sanitizeJson";

type MonacoGlobal = typeof globalThis & {
  MonacoEnvironment?: {
    getWorker: (_: string, label: string) => Worker;
  };
};

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
  const onValidJsonRef = useRef(onValidJson);
  const onParseErrorRef = useRef(onParseError);

  useEffect(() => {
    onValidJsonRef.current = onValidJson;
    onParseErrorRef.current = onParseError;
  }, [onValidJson, onParseError]);

  useEffect(() => {
    const nextText = JSON.stringify(value, null, 2);
    if (editorRef.current) {
      const editor = editorRef.current;
      if (!editor.hasTextFocus() && editor.getValue() !== nextText) {
        editor.setValue(nextText);
      }
    } else {
      setFallbackText(nextText);
    }
  }, [value]);

  useEffect(() => {
    let disposed = false;

    const setupEditor = async () => {
      if (!containerRef.current) {
        return;
      }
      const monaco = await import("monaco-editor/esm/vs/editor/editor.api");
      if (disposed || !containerRef.current) {
        return;
      }
      if (!(globalThis as MonacoGlobal).MonacoEnvironment) {
        (globalThis as MonacoGlobal).MonacoEnvironment = {
          getWorker: (_moduleId: string, label: string) => {
            if (label === "json") {
              return new Worker(
                new URL(
                  "monaco-editor/esm/vs/language/json/json.worker",
                  import.meta.url,
                ),
              );
            }
            return new Worker(
              new URL(
                "monaco-editor/esm/vs/editor/editor.worker",
                import.meta.url,
              ),
            );
          },
        };
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
          onParseErrorRef.current(undefined);
          onValidJsonRef.current(result.value);
        } else {
          onParseErrorRef.current(result.error);
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
  }, [value]);

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
