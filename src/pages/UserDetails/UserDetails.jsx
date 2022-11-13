import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Page, UserDetails as UserDetailsBlock } from "#blocks";
import {
  ChangePassword,
  DeleteAccount,
  UploadPicture,
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
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);
  const [isDeleteBackdropShown, setIsDeleteBackdropShown] = useState(false);
  const [isUploadPictureModalOpen, setIsUploadPictureModalOpen] =
    useState(false);
  const [isDeletePictureBackdropShown, setIsDeletePictureBackdropShown] =
    useState(false);

  const openDataProcessingBackdrop = () => setIsBackdropOpen(true);
  const openDeleteAccountBackdrop = () => setIsDeleteBackdropShown(true);
  const openUploadPictureModal = () => setIsUploadPictureModalOpen(true);
  const openDeletePictureBackdrop = () => setIsDeletePictureBackdropShown(true);

  const closeDataProcessingBackdrop = () => setIsBackdropOpen(false);
  const closeDeleteAccountBackdrop = () => setIsDeleteBackdropShown(false);
  const closeUploadPictureModal = () => setIsUploadPictureModalOpen(false);
  const closeDeletePictureBackdrop = () =>
    setIsDeletePictureBackdropShown(false);

  return (
    <Page heading={t("heading")} classes="page__user-details">
      <UserDetailsBlock
        {...{
          openDeleteAccountBackdrop,
          openDataProcessingBackdrop,
          openUploadPictureModal,
          openDeletePictureBackdrop,
          closeDataProcessingBackdrop,
        }}
      />
      <ChangePassword
        isOpen={isBackdropOpen}
        onClose={closeDataProcessingBackdrop}
      />
      <DeleteAccount
        isOpen={isDeleteBackdropShown}
        onClose={closeDeleteAccountBackdrop}
      />
      <UploadPicture
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
