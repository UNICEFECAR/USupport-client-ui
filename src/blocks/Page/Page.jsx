import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Navbar,
  CircleIconButton,
  Footer,
  Icon,
  PasswordModal,
} from "@USupport-components-library/src";

import {
  userSvc,
  countrySvc,
  languageSvc,
} from "@USupport-components-library/services";

import {
  useWindowDimensions,
  getCountryFromTimezone,
} from "@USupport-components-library/utils";

import { RequireRegistration } from "#modals";
import {
  useIsLoggedIn,
  useEventListener,
  useCheckHasUnreadNotifications,
} from "#hooks";

import "./page.scss";

const kazakhstanCountry = {
  value: "KZ",
  label: "Kazakhstan",
  iconName: "KZ",
};

/**
 * Page
 *
 * Page wrapper
 *
 * @return {jsx}
 */
export const Page = ({
  additionalPadding,
  showGoBackArrow,
  showEmergencyButton,
  showNavbar = null,
  showFooter = null,
  handleGoBack,
  heading,
  subheading,
  headingButton,
  showHeadingButtonInline = false,
  showHeadingButtonBelow = false,
  classes,
  children,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const queryClient = useQueryClient();
  const navigateTo = useNavigate();
  const isLoggedIn = useIsLoggedIn();
  const isNavbarShown = showNavbar !== null ? showNavbar : isLoggedIn;
  const isFooterShown = showFooter !== null ? showFooter : isLoggedIn;

  const { width } = useWindowDimensions();

  const [isRegistrationModalOpan, setIsRegistrationModalOpen] = useState(false);

  const isTmpUser = userSvc.getUserID() === "tmp-user";

  const token = localStorage.getItem("token");

  const unreadNotificationsQuery = useCheckHasUnreadNotifications(!!token);

  const localStorageCountry = localStorage.getItem("country");
  const localStorageLanguage = localStorage.getItem("language");
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorageLanguage ? { value: localStorageLanguage.toUpperCase() } : null
  );
  const [selectedCountry, setSelectedCountry] = useState();

  const fetchCountries = async () => {
    const res = await countrySvc.getActiveCountries();
    const usersCountry = getCountryFromTimezone();
    const validCountry = res.data.find((x) => x.alpha2 === usersCountry);
    let hasSetDefaultCountry = false;

    const countries = res.data.map((x) => {
      const countryObject = {
        value: x.alpha2,
        label: x.name,
        countryID: x["country_id"],
        iconName: x.alpha2,
        minAge: x["min_client_age"],
        maxAge: x["max_client_age"],
        currencySymbol: x["symbol"],
        localName: x.local_name,
      };

      if (localStorageCountry === x.alpha2) {
        localStorage.setItem("country_id", countryObject.countryID);
        localStorage.setItem("currency_symbol", countryObject.currencySymbol);

        setSelectedCountry(countryObject);
      } else if (!localStorageCountry || localStorageCountry === "undefined") {
        if (validCountry?.alpha2 === x.alpha2) {
          hasSetDefaultCountry = true;

          localStorage.setItem("country", x.alpha2);
          localStorage.setItem("country_id", countryObject.countryID);
          localStorage.setItem("currency_symbol", countryObject.currencySymbol);

          setSelectedCountry(countryObject);
        }
      }

      return countryObject;
    });

    if (!hasSetDefaultCountry && !localStorageCountry) {
      const kazakhstanCountryObject = countries.find(
        (x) => x.value === kazakhstanCountry.value
      );

      localStorage.setItem("country", kazakhstanCountry.value);
      localStorage.setItem("country_id", kazakhstanCountryObject.countryID);
      localStorage.setItem(
        "currency_symbol",
        kazakhstanCountryObject.currencySymbol
      );
    }

    return countries;
  };

  const fetchLanguages = async () => {
    const res = await languageSvc.getActiveLanguages();
    const languages = res.data.map((x) => {
      const languageObject = {
        value: x.alpha2,
        label: x.name,
        id: x["language_id"],
        localName: x["local_name"],
      };
      if (localStorageLanguage === x.alpha2) {
        setSelectedLanguage(languageObject);
        i18n.changeLanguage(localStorageLanguage);
      } else if (!localStorageLanguage) {
        localStorage.setItem("language", "en");
        i18n.changeLanguage("en");
      }
      return languageObject;
    });
    return languages;
  };

  const { data: countries } = useQuery(["countries"], fetchCountries);
  const { data: languages } = useQuery(["languages"], fetchLanguages);

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  useEffect(() => {
    const hasUnreadNotificationsData = unreadNotificationsQuery.data;
    setHasUnreadNotifications(hasUnreadNotificationsData);
  }, [unreadNotificationsQuery.data]);

  const newNotificationHandler = useCallback(() => {
    setHasUnreadNotifications(true);
  }, []);
  useEventListener("new-notification", newNotificationHandler);

  const allNotificationsReadHandler = useCallback(() => {
    setHasUnreadNotifications(false);
  });
  useEventListener("all-notifications-read", allNotificationsReadHandler);

  const clientData = queryClient.getQueryData(["client-data"]);
  const image = clientData?.image;

  const { t, i18n } = useTranslation("page");
  const pages = [
    { name: t("page_1"), url: "/dashboard", exact: true },
    { name: t("page_2"), url: "/consultations" },
    { name: t("page_3"), url: "/information-portal" },
    { name: t("page_4"), url: "/my-qa" },
  ];

  const footerLists = {
    list1: [
      { name: t("footer_1"), url: "/dashboard" },
      { name: t("footer_2"), url: "/consultations" },
      { name: t("footer_3"), url: "/information-portal" },
      { name: t("footer_4"), url: "/profile" },
    ],
    list2: [
      { name: t("footer_5"), url: "/terms-of-use", exact: true },
      { name: t("footer_6"), url: "/privacy-policy" },
      { name: t("footer_7"), url: "/cookie-policy" },
      { name: t("footer_8"), url: "/faq" },
    ],
    list3: [
      { value: "+7 717 232 28 78", iconName: "call-filled", onClick: "phone" },
      {
        value: "Beibitshilik St 10а, Astana 010000, Kazakhstan",
        iconName: "pin",
      },
      {
        value: "usupport@7digit.io",
        iconName: "mail-filled",
        onClick: "mail",
      },
    ],
  };

  const handleGoBackArrowClick = () => {
    if (handleGoBack) {
      handleGoBack();
    } else {
      navigateTo(-1);
    }
  };

  const handleRegistrationModalClose = () => setIsRegistrationModalOpen(false);
  const handleRegistrationModalOpen = () => setIsRegistrationModalOpen(true);
  const handleRegisterRedirection = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("expires-in");
    navigateTo("/register-preview");
  };

  const hasEnteredPassword = queryClient.getQueryData(["hasEnteredPassword"]);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(
    !hasEnteredPassword
  );
  const [password, setPasswordError] = useState("");

  const handlePasswordCheck = (password) => {
    if (password === "USupport!2023") {
      queryClient.setQueryData(["hasEnteredPassword"], true);
      setIsPasswordModalOpen(false);
    } else {
      setPasswordError(t("wrong_password"));
    }
  };

  return (
    <>
      <PasswordModal
        label={t("password")}
        btnLabel={t("submit")}
        isOpen={isPasswordModalOpen}
        error={password}
        handleSubmit={handlePasswordCheck}
      />
      {isNavbarShown === true && (
        <Navbar
          i18n={i18n}
          image={image || "default"}
          isTmpUser={isTmpUser}
          isTmpUserAction={handleRegistrationModalOpen}
          navigate={navigateTo}
          NavLink={NavLink}
          pages={pages}
          showProfile
          yourProfileText={t("your_profile_text")}
          languages={languages}
          countries={countries}
          initialLanguage={selectedLanguage}
          initialCountry={selectedCountry}
          hasUnreadNotifications={hasUnreadNotifications}
          renderIn="client"
        />
      )}
      <div
        className={[
          "page",
          `${additionalPadding ? "" : "page--no-additional-top-padding"}`,
          `${classNames(classes)}`,
        ].join(" ")}
      >
        {(heading || showGoBackArrow || headingButton) && (
          <>
            <div className="page__header">
              {showGoBackArrow && (
                <Icon
                  classes="page__header-icon"
                  name="arrow-chevron-back"
                  size="md"
                  color="#20809E"
                  onClick={handleGoBackArrowClick}
                />
              )}
              {heading && <h3 className="page__header-heading">{heading}</h3>}
              {headingButton &&
                (width >= 768 || showHeadingButtonInline) &&
                !showHeadingButtonBelow && (
                  <div className="page__header-button-container">
                    {headingButton}
                  </div>
                )}
            </div>
            {headingButton && (
              <div className="page__mobile-button-container">
                {width < 768 &&
                !showHeadingButtonInline &&
                headingButton &&
                !showHeadingButtonBelow
                  ? headingButton
                  : null}
              </div>
            )}
          </>
        )}
        <p className="page__subheading-text text">{subheading}</p>
        {showHeadingButtonBelow && headingButton && (
          <div className="page__header-button-container">{headingButton}</div>
        )}

        {children}
      </div>
      {showEmergencyButton && (
        <CircleIconButton
          iconName="phone-emergency"
          classes="page__emergency-button"
          onClick={() => navigateTo("/sos-center")}
          label={t("emergency_button")}
        />
      )}
      {isFooterShown && (
        <Footer
          lists={footerLists}
          contactUsText={t("contact_us")}
          navigate={navigateTo}
          Link={Link}
          showSocials={false}
        />
      )}

      <RequireRegistration
        handleContinue={handleRegisterRedirection}
        isOpen={isRegistrationModalOpan}
        onClose={handleRegistrationModalClose}
      />
    </>
  );
};

Page.propTypes = {
  /**
   * Additional padding on top of the page
   */
  additionalPadding: PropTypes.bool,

  /**
   * Show the navbar
   */
  showNavbar: PropTypes.bool,

  /**
   * Show the footer
   */
  showFooter: PropTypes.bool,

  /**
   * Show the go back arrow
   */
  showGoBackArrow: PropTypes.bool,

  /**
   * Show the emergency button
   */
  showEmergencyButton: PropTypes.bool,

  /**
   * Heading text
   */
  heading: PropTypes.string,

  /**
   * Subheading text
   */
  subheading: PropTypes.string,

  /**
   * Heading button
   */
  headingButton: PropTypes.node,

  /**
   * Additional classes
   */
  classes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

Page.defaultProps = {
  additionalPadding: true,
  showGoBackArrow: true,
  showEmergencyButton: true,
};
