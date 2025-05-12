import React from "react";
import { Navigate } from "react-router-dom";

export const CountryValidationRoute = ({ children }) => {
  const country = localStorage.getItem("country");
  const language = localStorage.getItem("language") || "en";

  if (!country) return <Navigate to={`/client/${language}/`} />;

  return children;
};
