import React from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { Loading } from "@USupport-components-library/src";
import { useIsLoggedIn } from "#hooks";

/**
 * Login
 *
 * Redirects to the dashboard. When country and language are both selected,
 * opens the login modal via the `auth=login` query param.
 *
 * @returns {JSX.Element}
 */
export const Login = () => {
  const [searchParams] = useSearchParams();
  const { language: urlLanguage } = useParams();
  const nextPath = searchParams.get("next");
  const isLoggedIn = useIsLoggedIn();

  const storedLanguage = localStorage.getItem("language");
  const language = storedLanguage || urlLanguage || "en";
  const country = localStorage.getItem("country");
  const hasCountryAndLanguage =
    !!country &&
    country !== "global" &&
    !!(storedLanguage || urlLanguage);

  if (isLoggedIn === "loading") return <Loading />;

  if (isLoggedIn === true) {
    const redirectTo =
      nextPath && nextPath.startsWith("/client/")
        ? nextPath
        : `/client/${language}/dashboard`;
    return <Navigate to={redirectTo} replace />;
  }

  const params = new URLSearchParams();
  if (nextPath) params.set("next", nextPath);
  if (hasCountryAndLanguage) params.set("auth", "login");

  const query = params.toString();
  return (
    <Navigate
      to={`/client/${language}/dashboard${query ? `?${query}` : ""}`}
      replace
    />
  );
};
