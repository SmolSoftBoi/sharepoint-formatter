"use client";

import {
  Caption1,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { PanelCard } from "./PanelCard";
import { EXPRESSION_EXAMPLES } from "../../lib/expressions/examples";

export const ExpressionReference = () => {
  const styles = useStyles();

  return (
    <PanelCard title="Expression Examples">
      <div className={styles.list}>
        {EXPRESSION_EXAMPLES.map((example) => (
          <div key={example.expression} className={styles.item}>
            <code className={styles.code}>{example.expression}</code>
            <Caption1>{example.description}</Caption1>
          </div>
        ))}
      </div>
    </PanelCard>
  );
};

const useStyles = makeStyles({
  list: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
  },
  code: {
    fontFamily: tokens.fontFamilyMonospace,
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    borderRadius: tokens.borderRadiusMedium,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalS}`,
  },
});
