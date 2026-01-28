import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import {
  Block,
  Grid,
  GridItem,
  StoreButton,
  StaticImage,
} from "@USupport-components-library/src";
import {
  useWindowDimensions,
  ThemeContext,
} from "@USupport-components-library/utils";

import "./download-app.scss";

import imageSrc from "./assets/StartScreen.png";
import imageSrcWebp from "./assets/StartScreen.webp";
import StartScreenPreviews from "./assets/StartScreenPreviewsNew.png";

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
  const { width } = useWindowDimensions();

  return (
    <Block
      classes={["download-app", theme !== "light" && "download-app--dark"].join(
        " "
      )}
      animation="fade-up"
    >
      <Grid>
        <GridItem md={5} lg={6} classes="download-app__content-item">
          <Grid classes="download-app__content-grid">
            <GridItem md={8} lg={12} classes="download-app__heading-item">
              <h1>{t("heading")}</h1>
            </GridItem>
            {/* <GridItem md={8} lg={12} classes="download-app__sub-heading">
              <p className="text">{t("paragraph")}</p>
            </GridItem> */}
            <GridItem md={4} lg={6} classes="download-app__buttons-item">
              <StoreButton
                downloadText={t("download_text")}
                size="lg"
                store="google-play"
              />
            </GridItem>
            <GridItem md={4} lg={6} classes="download-app__buttons-item">
              <StoreButton
                downloadText={t("download_text")}
                size="lg"
                store="app-store"
              />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem md={3} lg={6} classes="download-app__image-item">
          {width < 768 ? (
            <StaticImage
              png={imageSrc}
              webp={imageSrcWebp}
              imageClasses="download-app__image"
              alt="mobile-app"
            />
          ) : (
            <StaticImage
              png={StartScreenPreviews}
              webp={StartScreenPreviews}
              imageClasses="download-app__image"
              alt="mobile-app"
            />
          )}
        </GridItem>
      </Grid>
    </Block>
  );
};
