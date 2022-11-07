import React from "react";
import { Navigate } from "react-router-dom";
import { useIsLoggedIn } from "@USupport-components-library/hooks";

export const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useIsLoggedIn();

  if (!isLoggedIn) return <Navigate to="/" />;

  return children;
};
