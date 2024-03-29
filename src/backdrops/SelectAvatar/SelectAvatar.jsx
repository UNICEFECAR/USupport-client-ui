import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Backdrop, Grid, GridItem } from "@USupport-components-library/src";
import { clientSvc } from "@USupport-components-library/services";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

import "./select-avatar.scss";

/**
 * SelectAvatar
 *
 * The SelectAvatar backdrop
 *
 * @return {jsx}
 */
export const SelectAvatar = ({ isOpen, onClose }) => {
  const { t } = useTranslation("select-avatar");

  const queryClient = useQueryClient();
  const clientData = queryClient.getQueryData(["client-data"]);
  const image = clientData?.image;

  const [selectedAvatar, setSelectedAvatar] = useState();
  // const [error, setError] = useState();

  const changeAvatar = async () => {
    const res = await clientSvc.changeImage(selectedAvatar);
    return res;
  };

  const changeAvatarMutation = useMutation(changeAvatar, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-data"] });
      onClose();
    },
    // onError: (error) => {
    //   const { message: errorMessage } = useError(error);
    //   setError(errorMessage);
    // },
  });

  const avatars = [
    "avatar-1",
    "avatar-2",
    "avatar-3",
    "avatar-4",
    "avatar-5",
    "avatar-6",
    "avatar-7",
    "avatar-8",
    "avatar-9",
    "avatar-10",
    "avatar-11",
    "avatar-12",
  ];

  return (
    <Backdrop
      classes="select-avatar"
      title="SelectAvatar"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      ctaLabel={t("cta_label")}
      ctaHandleClick={() => {
        changeAvatarMutation.mutate();
      }}
    >
      <div className="select-avatar__content">
        <img
          className="select-avatar__content__preview"
          src={AMAZON_S3_BUCKET + "/" + image}
        />
        <Grid classes="select-avatar__content__grid">
          {avatars.map((avatar, index) => (
            <GridItem
              xs={1}
              key={index}
              onClick={() => setSelectedAvatar(avatar)}
            >
              <img
                className={`select-avatar__content__avatar ${
                  avatar === selectedAvatar
                    ? "select-avatar__content__avatar--selected"
                    : ""
                }`}
                src={AMAZON_S3_BUCKET + "/" + avatar}
                alt="avatar"
              />
            </GridItem>
          ))}
        </Grid>
        <p className="select-avatar__content__text">{t("select")}</p>
      </div>
    </Backdrop>
  );
};
