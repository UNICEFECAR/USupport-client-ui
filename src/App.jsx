import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { Root } from "#routes";
import { FIVE_MINUTES } from "@USupport-components-library/utils";

import "react-toastify/dist/ReactToastify.css";

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
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Root />
      {/* <ReactQueryDevtools initialOpen /> */}
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
