import React from "react";
import { Navigate } from "react-router-dom";

export const CountryValidationRoute = ({ children }) => {
  const country = localStorage.getItem("country");

  if (!country) return <Navigate to="/" />;

  return children;
};
