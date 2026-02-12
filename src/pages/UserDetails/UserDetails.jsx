import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Page, UserDetails as UserDetailsBlock, DownloadApp } from "#blocks";
import {
  ChangePassword,
  DeleteAccount,
  SelectAvatar,
  DeleteProfilePicture,
} from "#backdrops";
import { DeleteMoodTrackerHistory, DeleteChatHistory } from "#modals";

import "./user-details.scss";

/**
 * UserDetails
 *
 * User Details page
 *
 * @returns {JSX.Element}
 */
export const UserDetails = () => {
  const { t } = useTranslation("pages", { keyPrefix: "user-details-page" });
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteBackdropShown, setIsDeleteBackdropShown] = useState(false);
  const [isUploadPictureModalOpen, setIsUploadPictureModalOpen] =
    useState(false);
  const [isDeletePictureBackdropShown, setIsDeletePictureBackdropShown] =
    useState(false);
  const [isDeleteChatHistoryOpen, setIsDeleteChatHistoryOpen] = useState(false);
  const [isDeleteMoodTrackerHistoryOpen, setIsDeleteMoodTrackerHistoryOpen] =
    useState(false);

  const openChangePasswordBackdrop = () => setIsChangePasswordOpen(true);
  const openDeleteAccountBackdrop = () => setIsDeleteBackdropShown(true);
  const openUploadPictureModal = () => setIsUploadPictureModalOpen(true);
  const openDeletePictureBackdrop = () => setIsDeletePictureBackdropShown(true);
  const openDeleteChatHistory = () => setIsDeleteChatHistoryOpen(true);
  const openDeleteMoodTrackerHistory = () =>
    setIsDeleteMoodTrackerHistoryOpen(true);

  const closeChangePasswordBackdrop = () => setIsChangePasswordOpen(false);
  const closeDeleteAccountBackdrop = () => setIsDeleteBackdropShown(false);
  const closeUploadPictureModal = () => setIsUploadPictureModalOpen(false);
  const closeDeletePictureBackdrop = () =>
    setIsDeletePictureBackdropShown(false);
  const closeDeleteChatHistory = () => setIsDeleteChatHistoryOpen(false);
  const closeDeleteMoodTrackerHistory = () =>
    setIsDeleteMoodTrackerHistoryOpen(false);

  return (
    <Page heading={t("heading")} classes="page__user-details">
      <UserDetailsBlock
        {...{
          openDeleteAccountBackdrop,
          openUploadPictureModal,
          openDeletePictureBackdrop,
          openChangePasswordBackdrop,
          openDeleteChatHistory,
          openDeleteMoodTrackerHistory,
        }}
      />
      <DownloadApp />
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
      <DeleteChatHistory
        isOpen={isDeleteChatHistoryOpen}
        onClose={closeDeleteChatHistory}
      />
      <DeleteMoodTrackerHistory
        isOpen={isDeleteMoodTrackerHistoryOpen}
        onClose={closeDeleteMoodTrackerHistory}
      />
    </Page>
  );
};
