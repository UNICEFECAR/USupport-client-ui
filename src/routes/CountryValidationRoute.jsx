import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useEventListener } from "#hooks";

export const CountryValidationRoute = ({ children }) => {
  const [country, setCountry] = useState(localStorage.getItem("country"));
  const language = localStorage.getItem("language") || "en";

  useEventListener("countryChanged", () => {
    const country = localStorage.getItem("country");
    if (country) {
      setCountry(country);
    }
  });

  if (!country || country === "global")
    return <Navigate to={`/client/${language}/dashboard`} />;

  return children;
};
