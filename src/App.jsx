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

  useEffect(() => {
    const language = localStorage.getItem("language");
    if (language) {
      i18n.changeLanguage(language);
    }

    window.addEventListener("beforeunload", (e) => {
      if (!(performance.getEntriesByType("navigation")[0].type === "reload")) {
        // If the page is being refreshed, do nothing
        e.preventDefault();
        userSvc.logout();
      }
    });
  }, []);

  const getDefaultTheme = () => {
    const localStorageTheme = localStorage.getItem("default-theme");
    return localStorageTheme || "light";
  };

  const [theme, setTheme] = useState(getDefaultTheme());

  useEffect(() => {
    localStorage.setItem("default-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
