import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Block,
  Box,
  Button,
  ButtonWithIcon,
  Grid,
  GridItem,
  Icon,
  Loading,
} from "@USupport-components-library/src";
import { useGetProviderData } from "#hooks";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

import "./provider-overview.scss";

/**
 * ProviderOverview
 *
 * ProviderOverview block
 *
 * @return {jsx}
 */
export const ProviderOverview = ({ provider, openScheduleBackdrop }) => {
  const { t } = useTranslation("provider-overview");
  const image = AMAZON_S3_BUCKET + "/" + (provider?.image || "default");
  const allOptionsToString = (option) => {
    return provider[option]?.join(", ");
  };

  const renderSpecializations = useCallback(() => {
    if (provider) {
      return provider.specializations.map((x) => t(x))?.join(", ");
    }
  }, [provider]);

  const renderWorkWith = useCallback(() => {
    if (provider) {
      return provider.workWith
        .map((x) => t(x.topic.replaceAll("-", "_")))
        ?.join(", ");
    }
  }, [provider]);

  const renderLanguages = useCallback(() => {
    if (provider) {
      return provider.languages.map((x) => x.name)?.join(" ");
    }
  }, [provider]);

  return (
    <Block classes="provider-profile">
      {!provider ? (
        <Loading size="lg" />
      ) : (
        <Grid md={8} lg={12} classes="provider-profile__grid">
          <GridItem md={8} lg={12}>
            <div className="provider-profile__header">
              <div className="provider-profile__header__provider-container">
                <Avatar
                  image={image}
                  classes="provider-profile__header__provider-container__avatar"
                />
                <div className="provider-profile__header__provider-container__text-container">
                  <h4>
                    {provider.name} {provider.patronym ? provider.patronym : ""}{" "}
                    {provider.surname}
                  </h4>
                  <p className="small-text">{renderSpecializations()}</p>
                </div>
              </div>
            </div>
          </GridItem>
          <GridItem md={8} lg={12} classes="provider-profile__grid__item">
            <div className="provider-profile__information-container-with-icon">
              <Icon
                name="call"
                size="md"
                color="#66768D"
                classes="provider-profile__information-container-with-icon__icon"
              />
              <p className="small-text">{`${provider.phonePrefix} ${provider.phone}`}</p>
            </div>
            <div className="provider-profile__information-container-with-icon">
              <Icon
                name="mail-admin"
                size="md"
                color="#66768D"
                classes="provider-profile__information-container-with-icon__icon"
              />
              <p className="small-text">{provider.email}</p>
            </div>
            <div className="provider-profile__information-container-with-icon">
              <Icon
                name="dollar"
                size="md"
                color="#66768D"
                classes="provider-profile__information-container-with-icon__icon"
              />
              <p className="small-text">
                {provider.consultationPrice}$ for 1 hour consultation
              </p>
            </div>
            <div className="provider-profile__information-container">
              <p className="small-text provider-profile__information-container__heading">
                {t("earliest_spot_label")}
              </p>
              <p className="small-text provider-profile__information-container__text">
                {provider.earliestAvailable}
              </p>
            </div>
            <div className="provider-profile__information-container">
              <p className="small-text provider-profile__information-container__heading">
                {t("languages_label")}
              </p>
              <p className="small-text provider-profile__information-container__text">
                {renderLanguages()}
              </p>
            </div>
            <div className="provider-profile__information-container">
              <p className="small-text provider-profile__information-container__heading">
                {t("education_label")}
              </p>
              <p className="small-text provider-profile__information-container__text">
                {allOptionsToString("education")}
              </p>
            </div>
            <div className="provider-profile__information-container">
              <p className="small-text provider-profile__information-container__heading">
                {t("work_with_label")}
              </p>
              <p className="small-text provider-profile__information-container__text">
                {renderWorkWith()}
              </p>
            </div>
            <div className="provider-profile__information-container">
              <p className="small-text provider-profile__information-container__heading">
                {t("done_consultations_label")}
              </p>
              <p className="small-text provider-profile__information-container__text">
                {provider.consultations} consultations
              </p>
            </div>
            <div className="provider-profile__information-container">
              <p className="small-text provider-profile__information-container__heading">
                {t("description_label")}
              </p>
              <p className="small-text provider-profile__information-container__text">
                {provider.description}
              </p>
            </div>
          </GridItem>
        </Grid>
      )}
      <div className="provider-profile__button-container">
        <Button
          label={t("button_label")}
          size="lg"
          onClick={openScheduleBackdrop}
        />
      </div>
    </Block>
  );
};
