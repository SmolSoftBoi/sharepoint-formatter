"use client";

import type { ReactNode } from "react";
import type { CardHeaderProps } from "@fluentui/react-components";
import {
  Card,
  CardHeader,
  Caption1,
  makeStyles,
  shorthands,
  Subtitle2,
  tokens,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  card: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
});

interface PanelCardProps {
  title: string;
  description?: string;
  action?: CardHeaderProps["action"];
  children: ReactNode;
}

export const PanelCard = ({
  title,
  description,
  action,
  children,
}: PanelCardProps) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader
        header={<Subtitle2>{title}</Subtitle2>}
        description={description ? <Caption1>{description}</Caption1> : undefined}
        action={action}
      />
      <div className={styles.body}>{children}</div>
    </Card>
  );
};
