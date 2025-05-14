import React from "react";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router-dom";
import { useIsLoggedIn } from "#hooks";

export const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useIsLoggedIn();
  const token = localStorage.getItem("token");
  let decoded = null;
  try {
    decoded = token ? jwtDecode(token) : null;
  } catch (error) {
    console.log(error);
  }
  const isClient = decoded?.userType === "client";

  if (!isLoggedIn || !isClient)
    return <Navigate to={`/client/${localStorage.getItem("language")}`} />;

  return children;
};
