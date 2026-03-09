import React, { useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useEventListener } from "#hooks";

export const CountryValidationRoute = ({ children }) => {
  const [country, setCountry] = useState(localStorage.getItem("country"));
  const language = localStorage.getItem("language") || "en";
  const [searchParams] = useSearchParams();

  useEventListener("countryChanged", () => {
    const country = localStorage.getItem("country");
    if (country) {
      setCountry(country);
    }
  });

  if (!country || country === "global") {
    const next = searchParams.get("next");
    const redirectTo =
      next && next.startsWith("/client/")
        ? `/client/${language}/?next=${encodeURIComponent(next)}`
        : `/client/${language}/`;
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
