import React, { useState } from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useTranslation } from "react-i18next";
import { Page, UserProfile as UserProfileBlock } from "#blocks";
import { ButtonWithIcon, RadialCircle } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { userSvc } from "@USupport-components-library/services";

import { RequireRegistration } from "#modals";
import "./user-profile.scss";

/**
 * UserProfile
 *
 * UserProfile page
 *
 * @returns {JSX.Element}
 */
export const UserProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("user-profile-page");
  const { width } = useWindowDimensions();

  const isTmpUser = userSvc.getUserID() === "tmp-user";

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRegisterRedirection = () => {
    userSvc.logout();
    navigate("/register-preview");
  };

  const handleLogout = () => {
    userSvc.logout();

    navigate("/");
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
          onClick={handleLogout}
        />
      }
      showHeadingButtonInline
    >
      <UserProfileBlock {...{ openModal, closeModal, isTmpUser }} />
      {width < 768 && (
        <RadialCircle
          color="purple"
          classes="page__user-profile__radial-circle"
        />
      )}
      <RequireRegistration
        handleContinue={handleRegisterRedirection}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </Page>
  );
};
