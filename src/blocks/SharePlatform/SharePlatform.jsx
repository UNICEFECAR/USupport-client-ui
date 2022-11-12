import React from "react";
import { useTranslation } from "react-i18next";
import {
  FacebookShareButton,
  TelegramShareButton,
  VKShareButton,
} from "react-share";
import { Block, Box, Grid, GridItem } from "@USupport-components-library/src";

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
  const { t } = useTranslation("share-platform");

  return (
    <Block classes="share-platform">
      <Grid md={8} lg={12} classes="share-platform__grid">
        <GridItem md={8} lg={12} classes="share-platform__grid__item">
          <VKShareButton url={shareUrl}>
            <Box boxShadow={1} classes="share-platform__grid__item__button">
              <p>{`${t("button_label_share_text")} VKontakte`}</p>
            </Box>
          </VKShareButton>
        </GridItem>
        <GridItem md={8} lg={12} classes="share-platform__grid__item">
          <FacebookShareButton url={shareUrl}>
            <Box boxShadow={1} classes="share-platform__grid__item__button">
              <p>{`${t("button_label_share_text")} Facebook`}</p>
            </Box>
          </FacebookShareButton>
        </GridItem>
        <GridItem md={8} lg={12} classes="share-platform__grid__item">
          <TelegramShareButton url={shareUrl}>
            <Box boxShadow={1} classes="share-platform__grid__item__button">
              <p>{`${t("button_label_share_text")} Telegram`}</p>
            </Box>
          </TelegramShareButton>
        </GridItem>
      </Grid>
    </Block>
  );
};
