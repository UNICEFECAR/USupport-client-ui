import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Page, UserDetails as UserDetailsBlock } from "#blocks";
import {
  ChangePassword,
  DeleteAccount,
  SelectAvatar,
  DeleteProfilePicture,
} from "#backdrops";

import "./user-details.scss";

/**
 * UserDetails
 *
 * User Details page
 *
 * @returns {JSX.Element}
 */
export const UserDetails = () => {
  const { t } = useTranslation("user-details-page");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteBackdropShown, setIsDeleteBackdropShown] = useState(false);
  const [isUploadPictureModalOpen, setIsUploadPictureModalOpen] =
    useState(false);
  const [isDeletePictureBackdropShown, setIsDeletePictureBackdropShown] =
    useState(false);

  const openChangePasswordBackdrop = () => setIsChangePasswordOpen(true);
  const openDeleteAccountBackdrop = () => setIsDeleteBackdropShown(true);
  const openUploadPictureModal = () => setIsUploadPictureModalOpen(true);
  const openDeletePictureBackdrop = () => setIsDeletePictureBackdropShown(true);

  const closeChangePasswordBackdrop = () => setIsChangePasswordOpen(false);
  const closeDeleteAccountBackdrop = () => setIsDeleteBackdropShown(false);
  const closeUploadPictureModal = () => setIsUploadPictureModalOpen(false);
  const closeDeletePictureBackdrop = () =>
    setIsDeletePictureBackdropShown(false);

  return (
    <Page heading={t("heading")} classes="page__user-details">
      <UserDetailsBlock
        {...{
          openDeleteAccountBackdrop,
          openUploadPictureModal,
          openDeletePictureBackdrop,
          openChangePasswordBackdrop,
        }}
      />
      <ChangePassword
        isOpen={isChangePasswordOpen}
        onClose={closeChangePasswordBackdrop}
      />
      <DeleteAccount
        isOpen={isDeleteBackdropShown}
        onClose={closeDeleteAccountBackdrop}
      />
      <SelectAvatar
        isOpen={isUploadPictureModalOpen}
        onClose={closeUploadPictureModal}
      />
      <DeleteProfilePicture
        isOpen={isDeletePictureBackdropShown}
        onClose={closeDeletePictureBackdrop}
      />
    </Page>
  );
};
