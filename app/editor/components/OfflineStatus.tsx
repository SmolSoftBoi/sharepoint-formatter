"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Body2,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  PlugConnectedRegular,
  PlugDisconnectedRegular,
} from "@fluentui/react-icons";
import {
  initOfflineCache,
  subscribeOfflineStatus,
  teardownOfflineCache,
} from "../../lib/persistence/offlineCache";

export const OfflineStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const styles = useStyles();

  const status = useMemo(() => {
    if (isOnline === null) {
      return {
        label: "Checking status",
        color: "informative" as const,
        icon: null,
        helper: "Detecting connectivity state.",
      };
    }
    if (isOnline) {
      return {
        label: "Online",
        color: "success" as const,
        icon: <PlugConnectedRegular />,
        helper: "Offline cache is ready.",
      };
    }
    return {
      label: "Offline",
      color: "danger" as const,
      icon: <PlugDisconnectedRegular />,
      helper: "Working from local cache only.",
    };
  }, [isOnline]);

  useEffect(() => {
    const unsubscribe = subscribeOfflineStatus(setIsOnline);
    initOfflineCache();
    return () => {
      unsubscribe();
      teardownOfflineCache();
    };
  }, []);

  return (
    <div className={styles.status} role="status" aria-live="polite">
      <Badge color={status.color} icon={status.icon} appearance="tint">
        {status.label}
      </Badge>
      <Body2 className={styles.helper}>{status.helper}</Body2>
    </div>
  );
};

const useStyles = makeStyles({
  status: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  helper: {
    textAlign: "center"
  }
});
