import React, { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { Navigate, useLocation } from "react-router-dom";
import { useIsLoggedIn, useCheckHasUnreadNotifications } from "#hooks";
import { userSvc } from "@USupport-components-library/services";

export const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useIsLoggedIn();
  const token = localStorage.getItem("token");
  const isTmpUser = userSvc.getUserID() === "tmp-user";
  const decoded = token ? jwtDecode(token) : null;
  const isClient = decoded?.userType === "client";
  const enabled = token && !isTmpUser;

  const unreadNotificationsQuery = useCheckHasUnreadNotifications(!!enabled);

  const location = useLocation();

  useEffect(() => {
    unreadNotificationsQuery.refetch();
  }, [location]);

  if (!isLoggedIn || !isClient) return <Navigate to="/" />;

  return children;
};
