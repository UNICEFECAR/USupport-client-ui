import React from "react";
import {
  Block,
  Grid,
  GridItem,
  Button,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import {
  FacebookShareButton,
  TelegramShareButton,
  VKShareButton,
} from "react-share";

import "./share-platform.scss";

/**
 * SharePlatform
 *
 * SharePlatform block
 *
 * @return {jsx}
 */
export const SharePlatform = ({ shareUrl = "https://www.usupport.com" }) => {
  const { t } = useTranslation("share-platform");

  return (
    <Block classes="share-platform">
      <Grid md={8} lg={12} classes="share-platform__grid">
        <GridItem md={8} lg={12} classes="share-platform__grid__item">
          <VKShareButton url={shareUrl}>
            <Button
              label={`${t("button_label_share_text")} VKontakte`}
              type="secondary"
              size="lg"
            />
          </VKShareButton>
        </GridItem>
        <GridItem md={8} lg={12} classes="share-platform__grid__item">
          <FacebookShareButton url={shareUrl}>
            <Button
              label={`${t("button_label_share_text")} Facebook`}
              type="secondary"
              size="lg"
            />
          </FacebookShareButton>
        </GridItem>
        <GridItem md={8} lg={12} classes="share-platform__grid__item">
          <TelegramShareButton url={shareUrl}>
            <Button
              label={`${t("button_label_share_text")} Telegram`}
              type="secondary"
              size="lg"
            />
          </TelegramShareButton>
        </GridItem>
      </Grid>
    </Block>
  );
};
