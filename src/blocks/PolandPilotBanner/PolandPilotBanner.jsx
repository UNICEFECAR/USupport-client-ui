import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useEventListener } from "#hooks";

import "./poland-pilot-banner.scss";

/**
 * Slim notice that the Poland pilot has ended. Renders only when the
 * selected country is Poland.
 */
export const PolandPilotBanner = () => {
  const { t } = useTranslation("blocks");
  const [country, setCountry] = useState(() => localStorage.getItem("country"));

  useEventListener("countryChanged", () => {
    setCountry(localStorage.getItem("country"));
  });

  if (country !== "PL") return null;

  return (
    <div className="poland-pilot-banner" role="status">
      <p className="poland-pilot-banner__text">
        <strong>{t("poland-pilot-banner.title")}</strong>{" "}
        {t("poland-pilot-banner.body")}
      </p>
    </div>
  );
};
