import React from "react";
import { Page, SelectProvider as SelectProviderBlock } from "#blocks";
import { useTranslation } from "react-i18next";
import { ButtonWithIcon } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { RadialCircle } from "@USupport-components-library/src";

import "./select-provider.scss";

/**
 * SelectProvider
 *
 * SelectProvider page
 *
 * @returns {JSX.Element}
 */
export const SelectProvider = () => {
  const { t } = useTranslation("select-provider-page");

  const { width } = useWindowDimensions();

  const handleFilterClick = () => {
    console.log("Filter button clicked");
  };

  return (
    <Page
      classes="page__select-provider"
      heading={t("heading")}
      subheading={t("subheading")}
      headingButton={
        <ButtonWithIcon
          label={t("button_label")}
          iconName="filter"
          iconColor="#ffffff"
          color="purple"
          circleSize="sm"
          onClick={() => handleFilterClick()}
        />
      }
    >
      <SelectProviderBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
