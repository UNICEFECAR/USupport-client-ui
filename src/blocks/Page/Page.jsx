import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  CircleIconButton,
  Footer,
  Icon,
} from "@USupport-components-library/src";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import "./page.scss";

/**
 * Page
 *
 * Page wrapper
 *
 * @return {jsx}
 */
export const Page = ({
  additionalPadding,
  showNavbar,
  showFooter,
  showGoBackArrow,
  showEmergencyButton,
  heading,
  subheading,
  headingButton,
  classes,
  children,
}) => {
  const navigateTo = useNavigate();
  const { t } = useTranslation("page");
  const pages = [
    { name: t("page_1"), url: "/", exact: true },
    { name: t("page_2"), url: "/how-it-works" },
    { name: t("page_3"), url: "/about-us" },
    // TODO: bring it back once the informaiton portal is ready
    // { name: "Information portal", url: "/information-portal" },
    { name: t("page_4"), url: "/contact-us" },
  ];

  const footerLists = {
    list1: [
      { name: t("footer_1"), url: "/about-us" },
      { name: t("footer_2"), url: "/information-portal" },
      { name: t("footer_3"), url: "/how-it-works" },
    ],
    list2: [
      { name: t("footer_4"), url: "/terms-of-service", exact: true },
      { name: t("footer_5"), url: "/privacy-policy" },
      { name: t("footer_6"), url: "/cookie-settings" },
    ],
    list3: [
      { value: "+359 888 888 888", iconName: "call-filled", onClick: "phone" },
      {
        value: `ul. "Oborishte" 5, ет. 3, 1504 Sofia `,
        iconName: "pin",
      },
      {
        value: "usupport@7digit.io",
        iconName: "mail-filled",
        onClick: "mail",
      },
    ],
  };

  return (
    <>
      {showNavbar && (
        <Navbar
          pages={pages}
          showProfile
          yourProfileText={t("your_profile_text")}
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
          <div className="page__header">
            {showGoBackArrow && (
              <Icon
                classes="page__header-icon"
                name="arrow-chevron-back"
                size="md"
                color="#20809E"
              />
            )}
            {heading && <h3 className="page__header-heading">{heading}</h3>}
            {headingButton && headingButton}
          </div>
        )}
        <p className="page__subheading-text text">{subheading}</p>
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
      {showFooter && (
        <Footer lists={footerLists} contactUsText={t("contact_us")} />
      )}
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
  showNavbar: true,
  showFooter: true,
  showGoBackArrow: true,
  showEmergencyButton: true,
};
