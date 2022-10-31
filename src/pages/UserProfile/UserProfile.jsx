import React from "react";
import { Page, UserProfile as UserProfileBlock } from "#blocks";
import { useTranslation } from "react-i18next";
import { ButtonWithIcon } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { RadialCircle } from "@USupport-components-library/src";

import "./user-profile.scss";

/**
 * UserProfile
 *
 * UserProfile page
 *
 * @returns {JSX.Element}
 */
export const UserProfile = () => {
  const { t } = useTranslation("user-profile-page");

  const { width } = useWindowDimensions();

  return (
    <Page
      classes="page__user-profile"
      heading={t("heading")}
      subheading={t("subheading")}
      headingButton={
        <ButtonWithIcon
          label={t("button_label")}
          iconName="exit"
          iconColor="#ffffff"
          size="sm"
          circleSize="sm"
        />
      }
    >
      <UserProfileBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
