"use client";

import { useEffect, useState } from "react";
import {
  initOfflineCache,
  subscribeOfflineStatus,
  teardownOfflineCache,
} from "../../lib/persistence/offlineCache";

export const OfflineStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeOfflineStatus(setIsOnline);
    initOfflineCache();
    return () => {
      unsubscribe();
      teardownOfflineCache();
    };
  }, []);

  return (
    <div className="offline-status" aria-live="polite">
      {isOnline === null ? "Checking status" : isOnline ? "Online" : "Offline"}
    </div>
  );
};
