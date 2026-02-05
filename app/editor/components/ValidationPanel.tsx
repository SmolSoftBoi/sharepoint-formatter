"use client";

import {
  Body1,
  Caption1,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { PanelCard } from "./PanelCard";
import { ValidationError } from "../../lib/validation/validator";

interface ValidationPanelProps {
  parseError?: string;
  errors: ValidationError[];
}

export const ValidationPanel = ({ parseError, errors }: ValidationPanelProps) => {
  const styles = useStyles();

  if (!parseError && errors.length === 0) {
    return (
      <PanelCard title="Validation">
        <MessageBar>
          <MessageBarBody>No validation errors.</MessageBarBody>
        </MessageBar>
      </PanelCard>
    );
  }

  return (
    <PanelCard title="Validation">
      {parseError && (
        <MessageBar intent="error">
          <MessageBarBody>
            <MessageBarBody>
              <MessageBarTitle>JSON parse error</MessageBarTitle>
              {parseError}
            </MessageBarBody>
          </MessageBarBody>
        </MessageBar>
      )}
      {errors.length > 0 && (
        <ul className={styles.list} role="alert">
          {errors.map((error, index) => (
            <li key={`${error.message}-${index}`} className={styles.item}>
              <MessageBar intent="warning">
                <MessageBarBody>
                  <MessageBarTitle>
                    {error.message}
                  </MessageBarTitle>
                  {error.path ? ` (${error.path})` : ""}
                  {error.hint ? (
                    <>
                      <br />
                      <Caption1>
                        <span className={styles.hintLabel}>Hint:</span> {error.hint}
                      </Caption1>
                    </>
                  ) : null}
                </MessageBarBody>
              </MessageBar>
            </li>
          ))}
        </ul>
      )}
    </PanelCard>
  );
};

const useStyles = makeStyles({
  list: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    margin: 0,
    padding: 0,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
  },
  hintLabel: {
    fontWeight: tokens.fontWeightSemibold,
  },
});
