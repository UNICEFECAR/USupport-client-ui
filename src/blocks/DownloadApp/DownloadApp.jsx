import React, { useContext } from "react";
import { Trans, useTranslation } from "react-i18next";

import {
  Block,
  Grid,
  GridItem,
  StoreButton,
  StaticImage,
} from "@USupport-components-library/src";
import { ThemeContext } from "@USupport-components-library/utils";

import "./download-app.scss";

import imageSrc from "./assets/StartScreen.png";
import imageDarkSrc from "./assets/StartScreen-dark.png";

/**
 * DownloadApp
 *
 * DownloadApp block component
 *
 * @return {jsx}
 */
export const DownloadApp = () => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation("blocks", { keyPrefix: "download-app" });

  return (
    <Block
      classes={["download-app", theme !== "light" && "download-app--dark"].join(
        " ",
      )}
      animation="fade-up"
    >
      <Grid>
        <GridItem md={5} lg={6} classes="download-app__content-item">
          <Grid classes="download-app__content-grid">
            <GridItem md={8} lg={12} classes="download-app__heading-item">
              <h1>
                <Trans
                  components={[
                    <span className="download-app__heading-item__highlight"></span>,
                  ]}
                >
                  {t("heading")}
                </Trans>
              </h1>
            </GridItem>
            <GridItem md={8} lg={12} classes="download-app__sub-heading">
              <p className="download-app__text">{t("text")}</p>
            </GridItem>
            <GridItem md={8} lg={12} classes="download-app__buttons-item">
              <div className="download-app__buttons-item__store">
                <StoreButton
                  downloadText={t("download_text")}
                  size="lg"
                  store="google-play"
                />
                <StoreButton
                  downloadText={t("download_text")}
                  size="lg"
                  store="app-store"
                />
              </div>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem md={3} lg={6} classes="download-app__image-item">
          <StaticImage
            png={theme === "light" ? imageSrc : imageDarkSrc}
            imageClasses="download-app__image"
            alt="mobile-app"
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
