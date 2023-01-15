import React from "react";
import { useTranslation } from "react-i18next";

import {
  Block,
  Button,
  ProviderDetails,
  Loading,
} from "@USupport-components-library/src";

import { useGetProviderDataById } from "#hooks";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

import "./provider-overview.scss";

/**
 * ProviderOverview
 *
 * ProviderOverview block
 *
 * @return {jsx}
 */
export const ProviderOverview = ({ providerId, openScheduleBackdrop }) => {
  const { t } = useTranslation("provider-overview");

  const { data: provider } = useGetProviderDataById(providerId);

  const image = AMAZON_S3_BUCKET + "/" + (provider?.image || "default");

  return (
    <Block classes="provider-profile">
      {!provider ? (
        <Loading size="lg" />
      ) : (
        <ProviderDetails provider={provider} t={t} image={image} />
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
