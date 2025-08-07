import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { Root } from "#routes";
import { FIVE_MINUTES } from "@USupport-components-library/utils";
import { userSvc } from "@USupport-components-library/services";

import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "@USupport-components-library/utils";

// AOS imports
import "aos/dist/aos.css";
import AOS from "aos";

import "./App.scss";

const IS_DEV = process.env.NODE_ENV === "development";

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetcgInterval: FIVE_MINUTES, refetchOnWindowFocus: false },
  },
});

function App() {
  const { i18n } = useTranslation();
  AOS.init({
    offset: 10,
    duration: 1000,
    easing: "ease-in-sine",
    delay: 300,
    anchorPlacement: "top-bottom",
    once: false,
  });

  const getDefaultTheme = () => {
    const localStorageTheme = localStorage.getItem("default-theme");
    return localStorageTheme || "light";
  };

  const [theme, setTheme] = useState(getDefaultTheme());
  const [isInWelcome, setIsInWelcome] = useState(false);
  const [isPodcastsActive, setIsPodcastsActive] = useState(false);
  const [isVideosActive, setIsVideosActive] = useState(false);

  const [cookieState, setCookieState] = useState({
    hasAcceptedAllCookies: false,
    hasAcceptedNecessaryCookies: false,
    hasHandledCookies: false,
    isBannerOpen: false,
  });

  useEffect(() => {
    const language = localStorage.getItem("language");
    const hasAcceptedAllCookies = !!Number(
      localStorage.getItem("hasAcceptedAllCookies")
    );
    const hasAcceptedNecessaryCookies = !!Number(
      localStorage.getItem("hasAcceptedNecessaryCookies")
    );
    const hasHandledCookies = !!Number(
      localStorage.getItem("hasHandledCookies")
    );

    setCookieState({
      hasAcceptedAllCookies,
      hasAcceptedNecessaryCookies,
      hasHandledCookies,
      isBannerOpen: hasHandledCookies ? false : true,
    });

    if (language) {
      i18n.changeLanguage(language);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const token = localStorage.getItem("token");
      // If the page is being refreshed, do nothing
      if (!(performance.getEntriesByType("navigation")[0].type === "reload")) {
        if (!IS_DEV && token && !isInWelcome) {
          e.preventDefault();
          e.returnValue = "";
          userSvc.logout();
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isInWelcome]);

  useEffect(() => {
    localStorage.setItem("default-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isInWelcome,
        setIsInWelcome,
        isPodcastsActive,
        setIsPodcastsActive,
        isVideosActive,
        setIsVideosActive,
        cookieState,
        setCookieState,
      }}
    >
      <div className={`theme-${theme}`}>
        <QueryClientProvider client={queryClient}>
          <Root />
          <ReactQueryDevtools initialOpen />
          <ToastContainer />
        </QueryClientProvider>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
