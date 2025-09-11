import React from "react";
import { useTranslation } from "react-i18next";
import {
  FacebookShareButton,
  TelegramShareButton,
  VKShareButton,
} from "react-share";
import {
  Block,
  Grid,
  GridItem,
  Button,
} from "@USupport-components-library/src";

import "./share-platform.scss";

const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL;

/**
 * SharePlatform
 *
 * SharePlatform block
 *
 * @return {jsx}
 */
export const SharePlatform = ({ shareUrl = WEBSITE_URL }) => {
  const { t } = useTranslation("blocks", { keyPrefix: "share-platform" });

  return (
    <Block classes="share-platform">
      <Grid md={8} lg={12} classes="share-platform__grid">
        <GridItem md={8} lg={12} classes="share-platform__grid__item">
          <VKShareButton url={shareUrl}>
            <Button
              type="secondary"
              size="lg"
              classes="share-platform__grid__item__button"
              label={`${t("button_label_share_text")} VKontakte`}
            />
          </VKShareButton>
        </GridItem>
        <GridItem md={8} lg={12} classes="share-platform__grid__item">
          <FacebookShareButton url={shareUrl}>
            <Button
              type="secondary"
              size="lg"
              classes="share-platform__grid__item__button"
              label={`${t("button_label_share_text")} Facebook`}
            />
          </FacebookShareButton>
        </GridItem>
        <GridItem md={8} lg={12} classes="share-platform__grid__item">
          <TelegramShareButton url={shareUrl}>
            <Button
              type="secondary"
              size="lg"
              classes="share-platform__grid__item__button"
              label={`${t("button_label_share_text")} Telegram`}
            />
          </TelegramShareButton>
        </GridItem>
      </Grid>
    </Block>
  );
};
