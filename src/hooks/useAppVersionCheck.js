/* global __APP_VERSION__ */
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { reloadApp } from "../utils/reloadApp.js";

// Written next to the build by the "app-version" plugin in vite.config.js
const VERSION_URL = `${import.meta.env.BASE_URL}version.json`;

const CHECK_INTERVAL = 10 * 60 * 1000;
const MIN_TIME_BETWEEN_CHECKS = 60 * 1000;
// Requests started by the navigation itself (e.g. leaving a consultation) begin right after it
const RELOAD_DELAY = 500;
const PENDING_REQUESTS_CHECK_INTERVAL = 250;
const MAX_PENDING_REQUESTS_WAIT = 10000;

// The consultation room depends on the navigation state and must never be interrupted
const isConsultationRoom = (pathname) => /\/consultation\/?$/.test(pathname);

/**
 * Detects that a newer version of the app was deployed while this tab stayed open
 * and reloads the app on the next navigation, where a full page load is barely noticeable
 */
export default function useAppVersionCheck() {
  const location = useLocation();
  const queryClient = useQueryClient();

  const isUpdateAvailable = useRef(false);
  const lastCheckTime = useRef(0);

  const checkVersion = async () => {
    if (import.meta.env.DEV || isUpdateAvailable.current) return;
    if (Date.now() - lastCheckTime.current < MIN_TIME_BETWEEN_CHECKS) return;
    lastCheckTime.current = Date.now();

    try {
      const response = await fetch(`${VERSION_URL}?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!response.ok) return;

      const { version } = await response.json();
      if (version && version !== __APP_VERSION__) {
        isUpdateAvailable.current = true;
      }
    } catch {
      // Offline, or a deployment without a version file
    }
  };

  useEffect(() => {
    const interval = setInterval(checkVersion, CHECK_INTERVAL);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") checkVersion();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!isUpdateAvailable.current) {
      checkVersion();
      return;
    }

    // A reload drops the navigation state, which some pages need (e.g. joining a consultation)
    if (location.state || isConsultationRoom(location.pathname)) return;

    const startTime = Date.now();
    let timeout;
    const reloadWhenIdle = () => {
      // A reload would cancel requests that are still running, so wait for them to finish
      if (queryClient.isMutating() > 0) {
        // Still busy, try again on the next navigation instead
        if (Date.now() - startTime > MAX_PENDING_REQUESTS_WAIT) return;
        timeout = setTimeout(reloadWhenIdle, PENDING_REQUESTS_CHECK_INTERVAL);
        return;
      }
      reloadApp();
    };
    timeout = setTimeout(reloadWhenIdle, RELOAD_DELAY);

    return () => clearTimeout(timeout);
  }, [location.key]);
}

export { useAppVersionCheck };
