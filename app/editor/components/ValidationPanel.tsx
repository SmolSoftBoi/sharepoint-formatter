"use client";

import {
  Body2,
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
        <Body2>No validation errors.</Body2>
      </PanelCard>
    );
  }

  return (
    <PanelCard title="Validation">
      {parseError && (
        <MessageBar intent="error">
          <MessageBarBody>
            <MessageBarTitle>JSON parse error</MessageBarTitle>
            {parseError}
          </MessageBarBody>
        </MessageBar>
      )}
      {errors.length > 0 && (
        <ul className={styles.list}>
          {errors.map((error, index) => (
            <li key={`${error.message}-${index}`} className={styles.item}>
              <Body2>
                {error.message}
                {error.path ? ` (${error.path})` : ""}
              </Body2>
              {error.hint ? (
                <Caption1>
                  <span className={styles.hintLabel}>Hint:</span> {error.hint}
                </Caption1>
              ) : null}
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
