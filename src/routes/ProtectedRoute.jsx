import React from "react";
import jwtDecode from "jwt-decode";
import { Navigate, useLocation } from "react-router-dom";
import { useIsLoggedIn } from "#hooks";

export const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useIsLoggedIn();
  const location = useLocation();
  const token = localStorage.getItem("token");
  let decoded = null;
  try {
    decoded = token ? jwtDecode(token) : null;
  } catch (error) {
    console.log(error);
  }
  const isClient = decoded?.userType === "client";

  if (!isLoggedIn || !isClient) {
    const language = localStorage.getItem("language") || "en";
    const loginPath = `/client/${language}/login`;
    const fullPath = location.pathname + location.search;
    const next = encodeURIComponent(fullPath);
    return <Navigate to={`${loginPath}?next=${next}`} replace />;
  }

  return children;
};
