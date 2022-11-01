import React from "react";
import { Page } from "#blocks";
import { NotFound as NotFoundBlock } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

/**
 * NotFound
 *
 * NotFound page.
 *
 * @returns {JSX.Element}
 */
export const NotFound = () => {
  const { t } = useTranslation("not-found-page");
  return (
    <Page showGoBackArrow={false}>
      <NotFoundBlock
        headingText={t("heading")}
        subheadingText={t("subheading")}
        buttonText={t("button")}
      />
    </Page>
  );
};
