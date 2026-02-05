"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { editor as MonacoEditor } from "monaco-editor";
import {
  Field,
  makeStyles,
  Textarea,
  tokens,
} from "@fluentui/react-components";
import { PanelCard } from "./PanelCard";
import { sanitizeJsonString } from "../../lib/validation/sanitizeJson";
import { withPerfMeasure } from "../../lib/perf/perf";

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

const normalizeStringify = (input: unknown): string => {
  const serialized = JSON.stringify(input, null, 2);
  return typeof serialized === "string" ? serialized : "";
};

const DEFAULT_DEBOUNCE_MS = 170;

export const JsonEditor = ({
  value,
  onValidJson,
  onParseError,
}: JsonEditorProps) => {
  const styles = useStyles();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const valueRef = useRef(value);
  const [isReady, setIsReady] = useState(false);
  const [fallbackText, setFallbackText] = useState(
    normalizeStringify(value),
  );
  const onValidJsonRef = useRef(onValidJson);
  const onParseErrorRef = useRef(onParseError);
  const parseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastProgrammaticValueRef = useRef<string>("");
  const lastProgrammaticVersionRef = useRef<number | null>(null);

  const scheduleParse = useCallback((raw: string) => {
    if (parseTimerRef.current) {
      clearTimeout(parseTimerRef.current);
    }

    parseTimerRef.current = setTimeout(() => {
      parseTimerRef.current = null;
      const result = withPerfMeasure("spfmt:json:parse", () => sanitizeJsonString(raw));
      if (result.ok) {
        onParseErrorRef.current(undefined);
        onValidJsonRef.current(result.value);
      } else {
        onParseErrorRef.current(result.error);
      }
    }, DEFAULT_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    onValidJsonRef.current = onValidJson;
    onParseErrorRef.current = onParseError;
  }, [onValidJson, onParseError]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const nextText = normalizeStringify(value);
    if (editorRef.current) {
      const editor = editorRef.current;
      if (!editor.hasTextFocus() && editor.getValue() !== nextText) {
        lastProgrammaticValueRef.current = nextText;
        editor.setValue(nextText);
        const versionId = editor.getModel()?.getAlternativeVersionId();
        lastProgrammaticVersionRef.current = versionId ?? null;
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
        value: normalizeStringify(valueRef.current),
        language: "json",
        minimap: { enabled: false },
        automaticLayout: true,
      });
      editorInstance.onDidChangeModelContent(() => {
        const raw = editorInstance.getValue();
        const versionId = editorInstance.getModel()?.getAlternativeVersionId() ?? null;
        const programmaticVersionId = lastProgrammaticVersionRef.current;
        const isProgrammaticChangeEvent =
          programmaticVersionId !== null &&
          versionId !== null &&
          versionId <= programmaticVersionId &&
          raw === lastProgrammaticValueRef.current;
        if (isProgrammaticChangeEvent) {
          return;
        }
        if (
          programmaticVersionId !== null &&
          (versionId === null || versionId > programmaticVersionId)
        ) {
          lastProgrammaticVersionRef.current = null;
          lastProgrammaticValueRef.current = "";
        }
        scheduleParse(raw);
      });
      editorRef.current = editorInstance;
      setIsReady(true);
    };

    setupEditor();

    return () => {
      disposed = true;
      if (parseTimerRef.current) {
        clearTimeout(parseTimerRef.current);
        parseTimerRef.current = null;
      }
      editorRef.current?.dispose();
    };
  }, [scheduleParse]);

  const handleFallbackChange = (raw: string) => {
    setFallbackText(raw);
    scheduleParse(raw);
  };

  return (
    <PanelCard title="JSON Editor">
      <div className={styles.editor} ref={containerRef} />
      {!isReady && (
        <Field label="JSON source">
          <Textarea
            value={fallbackText}
            onChange={(_event, data) => handleFallbackChange(data.value)}
            rows={12}
            resize="vertical"
          />
        </Field>
      )}
    </PanelCard>
  );
};

const useStyles = makeStyles({
  editor: {
    minHeight: "260px",
    borderRadius: tokens.borderRadiusMedium,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    overflow: "hidden",
  },
});
