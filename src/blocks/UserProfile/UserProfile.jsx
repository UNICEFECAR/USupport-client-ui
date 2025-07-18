import React, { useState, useEffect } from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Block,
  Grid,
  GridItem,
  ButtonSelector,
} from "@USupport-components-library/src";

import { countrySvc } from "@USupport-components-library/services";
import { useGetClientData } from "#hooks";

import "./user-profile.scss";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;
const GIT_BOOK_URL = `${import.meta.env.VITE_GIT_BOOK_URL}`;

/**
 * UserProfile
 *
 * UserProfile block
 *
 * @return {jsx}
 */
export const UserProfile = ({ openModal, isTmpUser }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("user-profile");

  const [displayName, setDisplayName] = useState("");

  const clientQueryArray = useGetClientData(isTmpUser ? false : true);
  const clientData = isTmpUser ? {} : clientQueryArray[0].data;

  const country = localStorage.getItem("country");
  const hidePaymentHistory =
    country === "KZ" || country === "PL" || country === "RO";

  useEffect(() => {
    if (clientData) {
      if (clientData.name && clientData.surname) {
        setDisplayName(`${clientData.name} ${clientData.surname}`);
      } else {
        setDisplayName(clientData.nickname);
      }
    }
  }, [clientData]);

  const handleRedirect = (redirectTo) => {
    if (
      (redirectTo === "/details" ||
        redirectTo === "/notification-preferences") &&
      isTmpUser
    ) {
      openModal();
    } else {
      navigate(`${redirectTo}`);
    }
  };

  return (
    <Block classes="user-profile">
      <Grid md={8} lg={12} classes="user-profile__grid">
        <GridItem md={8} lg={12} classes="user-profile__grid__item">
          <p className="text user-profile__grid__item__label">
            {t("your_profile")}
          </p>
          <ButtonSelector
            label={displayName || t("guest")}
            classes="user-profile__grid__item__button "
            onClick={() => handleRedirect("/details")}
            avatar={`${AMAZON_S3_BUCKET}/${clientData?.image || "default"}`}
          />
          {!isTmpUser && (
            <ButtonSelector
              label={t("mood_tracker_button_label")}
              classes="user-profile__grid__item__button"
              onClick={() => handleRedirect("/mood-tracker")}
              iconName="mood"
            />
          )}
        </GridItem>
        <GridItem md={8} lg={12} classes="user-profile__grid__item">
          <p className="text user-profile__grid__item__label">
            {t("application_settings")}
          </p>
          <ButtonSelector
            label={t("notifications_settings_button_label")}
            iconName="notifications"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect("/notification-preferences")}
          />
        </GridItem>
        <GridItem md={8} lg={12} classes="user-profile__grid__item">
          <p className="text user-profile__grid__item__label">
            {t("rate_share")}
          </p>
          <ButtonSelector
            label={t("rate_us_button_label")}
            iconName="star"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect("/platform-rating")}
          />
          {/* <ButtonSelector
            label={t("share_button_label")}
            iconName="share"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect("/share-platform")}
          /> */}
        </GridItem>
        <GridItem md={8} lg={12} classes="user-profile__grid__item">
          <p className="text user-profile__grid__item__label">{t("other")}</p>
          {!hidePaymentHistory && (
            <ButtonSelector
              label={t("payments_history_button_label")}
              iconName="payment-history"
              classes="user-profile__grid__item__button"
              onClick={() => handleRedirect("/payment-history")}
            />
          )}
          <ButtonSelector
            label={t("contact_us_button_label")}
            iconName="comment"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect(`/contact-us`)}
          />
          <ButtonSelector
            label={t("privacy_policy_button_label")}
            iconName="document"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect(`/privacy-policy`)}
          />
          <ButtonSelector
            label={t("terms_of_use")}
            iconName="document"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect(`/terms-of-use`)}
          />
          <ButtonSelector
            label={t("cookie_policy")}
            iconName="document"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect(`/cookie-policy`)}
          />
          <ButtonSelector
            label={t("user_guide")}
            iconName="document"
            classes="user-profile__grid__item__button"
            onClick={() => window.open(GIT_BOOK_URL, "_blank")}
          />
          <ButtonSelector
            label={t("FAQ_button_label")}
            iconName="info"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect(`/faq`)}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
