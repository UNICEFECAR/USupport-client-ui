import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  ThemeContext,
  useWindowDimensions,
} from "@USupport-components-library/utils";

import { InputSearch, Icon, NewButton } from "@USupport-components-library/src";

import informationPortalMobile from "../../pages/InformationPortal/assets/information-portal-mobile.png";
import informationPortalDark from "../../pages/InformationPortal/assets/information-portal.png";
import informationPortalPs from "../../pages/InformationPortal/assets/information-portal-ps.png";
import informationPortalPsDark from "../../pages/InformationPortal/assets/information-portal-ps-dark.png";
import informationPortalPsMobile from "../../pages/InformationPortal/assets/information-portal-ps-mobile.png";
import informationPortalPsMobileDark from "../../pages/InformationPortal/assets/information-portal-ps-mobile-dark.png";

import "./information-portal-hero.scss";

/**
 * InformationPortalHero
 *
 * Reusable hero component for information portal pages
 *
 * @returns {JSX.Element}
 */
export const InformationPortalHero = ({
  showSearch = false,
  searchValue = "",
  onSearchChange,
  placeholder = "Search",
  showGoBackArrow = false,
  buttonLabel,
  buttonOnClick,
}) => {
  const { theme } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const IS_PS = localStorage.getItem("country") === "PS";
  const IS_RTL = localStorage.getItem("language") === "ar";
  const isDark = theme === "dark";

  const informationPortalMobileImage = IS_PS
    ? isDark
      ? informationPortalPsMobileDark
      : informationPortalPsMobile
    : informationPortalMobile;

  const informationPortalImage = IS_PS
    ? isDark
      ? informationPortalPsDark
      : informationPortalPs
    : informationPortalDark;

  return (
    <div className="information-portal-hero">
      {showGoBackArrow && (
        <div
          className="information-portal-hero__back-button"
          onClick={handleGoBack}
        >
          <Icon name="arrow-chevron-back" size="md" color="#fff" />
        </div>
      )}
      <img
        src={
          width < 768 ? informationPortalMobileImage : informationPortalImage
        }
        alt="Information Portal"
        className={`information-portal-hero__image ${
          width < 768
            ? "information-portal-hero__image--mobile"
            : "information-portal-hero__image--desktop"
        } ${theme !== "dark" ? "information-portal-hero__image--visible" : ""}`}
      />
      {showSearch && (
        <InputSearch
          onChange={onSearchChange}
          value={searchValue}
          classes={`information-portal-hero__input ${
            IS_RTL ? "information-portal-hero__input--rtl" : ""
          }`}
          placeholder={placeholder}
        />
      )}
      {buttonLabel && buttonOnClick && (
        <NewButton
          label={buttonLabel}
          classes="information-portal-hero__button"
          onClick={buttonOnClick}
        />
      )}
    </div>
  );
};
