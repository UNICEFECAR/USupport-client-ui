import React from "react";
import {
  Block,
  Grid,
  GridItem,
  ButtonSelector,
  Loading,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./user-profile.scss";

/**
 * UserProfile
 *
 * UserProfile block
 *
 * @return {jsx}
 */
export const UserProfile = () => {
  const { t } = useTranslation("user-profile");

  const handleRedirect = (redirectTo) => {
    console.log(`Redirect to: ${redirectTo}`);
  };

  return (
    <Block classes="user-profile">
      <Grid md={8} lg={12} classes="user-profile__grid">
        <GridItem md={8} lg={12} classes="user-profile__grid__item">
          <p className="text user-profile__grid__item__label">
            {t("your_profile")}
          </p>
          <ButtonSelector
            label="Anna Frank"
            classes="user-profile__grid__item__button "
            onClick={() => handleRedirect("/profile")}
          />
        </GridItem>
        <GridItem md={8} lg={12} classes="user-profile__grid__item">
          <p className="text user-profile__grid__item__label">
            {t("application_settings")}
          </p>
          <ButtonSelector
            label={t("passcode_biometrics_button_label")}
            iconName="fingerprint"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect("/passcode-and-biometrics")}
          />
          <ButtonSelector
            label={t("notifications_settings_button_label")}
            iconName="notifications"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect("/notifications-settings")}
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
          <ButtonSelector
            label={t("share_button_label")}
            iconName="share"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect("/share-platform")}
          />
        </GridItem>
        <GridItem md={8} lg={12} classes="user-profile__grid__item">
          <p className="text user-profile__grid__item__label">{t("other")}</p>
          <ButtonSelector
            label={t("contact_us_button_label")}
            iconName="comment"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect("contact-us")}
          />
          <ButtonSelector
            label={t("privacy_policy_button_label")}
            iconName="document"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect("/privacy-policy")}
          />
          <ButtonSelector
            label={t("FAQ_button_label")}
            iconName="info"
            classes="user-profile__grid__item__button"
            onClick={() => handleRedirect("/faq")}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
