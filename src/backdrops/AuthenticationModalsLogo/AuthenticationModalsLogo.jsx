import React, { useContext } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import {
  logoVerticalSvg,
  logoVerticalDarkSvg,
  logoVerticalRomaniaPng,
} from "@USupport-components-library/assets";
import { ThemeContext } from "@USupport-components-library/utils";

import "./authentication-modal-logo.scss";

/**
 * AuthenticationModalsLogo
 *
 * Authentication modals logo component
 *
 * @returns {jsx}
 */
export const AuthenticationModalsLogo = ({ classes }) => {
  const { t } = useTranslation("backdrops", { keyPrefix: "welcome" });
  const { theme } = useContext(ThemeContext);
  const IS_RO = localStorage.getItem("country") === "RO";

  return (
    <div
      className={["authentication-modals-logo", classNames(classes)].join(" ")}
    >
      <img
        src={
          IS_RO
            ? logoVerticalRomaniaPng
            : theme !== "light"
              ? logoVerticalDarkSvg
              : logoVerticalSvg
        }
        alt="Logo"
        className="authentication-modals-logo__logo"
      />
      <h2 className="welcome-modal__client-heading">{t("client")}</h2>
    </div>
  );
};
