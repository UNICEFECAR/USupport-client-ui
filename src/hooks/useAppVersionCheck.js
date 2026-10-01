/* global __APP_VERSION__ */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// Written next to the build by the "app-version" plugin in vite.config.js
const VERSION_URL = `${import.meta.env.BASE_URL}version.json`;

const CHECK_INTERVAL = 10 * 60 * 1000;
// Switching back to a tab fires both "visibilitychange" and "focus", which should be one check
const MIN_TIME_BETWEEN_CHECKS = 5 * 1000;
// After "Later", the user is asked again after this time
const REMIND_AGAIN_AFTER = 30 * 60 * 1000;

// A consultation must never be interrupted, the user is asked once they leave the room
const isConsultationRoom = (pathname) => /\/consultation\/?$/.test(pathname);

/**
 * Detects that a newer version of the app was deployed while this tab stayed open,
 * so the user can be asked to refresh
 *
 * @returns {{ isUpdateModalOpen: boolean, remindLater: function }}
 */
export default function useAppVersionCheck() {
  const location = useLocation();

  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const lastCheckTime = useRef(0);
  const remindTimeout = useRef();

  const checkVersion = async () => {
    if (Date.now() - lastCheckTime.current < MIN_TIME_BETWEEN_CHECKS) return;
    lastCheckTime.current = Date.now();

    try {
      const response = await fetch(`${VERSION_URL}?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!response.ok) return;

      const { version } = await response.json();
      if (version && version !== __APP_VERSION__) {
        setIsUpdateAvailable(true);
      }
    } catch {
      // Offline, or a deployment without a version file
    }
  };

  useEffect(() => {
    // Nothing more to check once an update is known
    if (isUpdateAvailable) return;

    const interval = setInterval(checkVersion, CHECK_INTERVAL);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") checkVersion();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // Also covers returning from another app, where the tab was visible the whole time
    window.addEventListener("focus", checkVersion);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", checkVersion);
    };
  }, [isUpdateAvailable]);

  useEffect(() => {
    if (!isUpdateAvailable) checkVersion();
  }, [location.key]);

  useEffect(() => () => clearTimeout(remindTimeout.current), []);

  const remindLater = () => {
    setIsDismissed(true);
    clearTimeout(remindTimeout.current);
    remindTimeout.current = setTimeout(
      () => setIsDismissed(false),
      REMIND_AGAIN_AFTER
    );
  };

  return {
    isUpdateModalOpen:
      isUpdateAvailable &&
      !isDismissed &&
      !isConsultationRoom(location.pathname),
    remindLater,
  };
}

export { useAppVersionCheck };
