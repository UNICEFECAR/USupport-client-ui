import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Backdrop } from "@USupport-components-library/src";
import { useError } from "#hooks";
import { clientSvc } from "@USupport-components-library/services";

import "./delete-profile-picture.scss";

/**
 * DeleteProfilePicture
 *
 * The DeleteProfilePicture backdrop
 *
 * @return {jsx}
 */
export const DeleteProfilePicture = ({ isOpen, onClose }) => {
  const { t } = useTranslation("delete-profile-picture");
  const [error, setError] = useState();
  const queryClient = useQueryClient();

  const deletePicture = async () => {
    const res = await clientSvc.deleteImage();
    if (res.status === 200) {
      return true;
    }
  };

  const deletePictureMutation = useMutation(deletePicture, {
    onSuccess: () => {
      queryClient.invalidateQueries(["client-data"]);
      onClose();
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setError(errorMessage);
    },
  });

  const handlePictureDelete = () => deletePictureMutation.mutate();

  return (
    <Backdrop
      classes="delete-profile-picture"
      title="DeleteProfilePicture"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      ctaLabel={t("remove_button")}
      ctaHandleClick={handlePictureDelete}
      secondaryCtaLabel={t("cancel_button")}
      secondaryCtaHandleClick={onClose}
      secondaryCtaType="secondary"
      errorMessage={error}
    >
      <p className="delete-profile-picture__text">{t("text")}</p>
    </Backdrop>
  );
};
