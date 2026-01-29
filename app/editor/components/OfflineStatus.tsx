"use client";

import { useEffect, useState } from "react";
import {
  getOfflineStatus,
  initOfflineCache,
  subscribeOfflineStatus,
  teardownOfflineCache,
} from "../../lib/persistence/offlineCache";

export const OfflineStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    initOfflineCache();
    const unsubscribe = subscribeOfflineStatus(setIsOnline);
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
