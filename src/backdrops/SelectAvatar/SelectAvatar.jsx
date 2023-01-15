import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Backdrop,
  Loading,
  Grid,
  GridItem,
} from "@USupport-components-library/src";
import { userSvc, clientSvc } from "@USupport-components-library/services";

import { useError } from "#hooks";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const changeAvatar = async () => {
    const res = await clientSvc.changeImage(selectedAvatar);
    return res;
  };

  const changeAvatarMutation = useMutation(changeAvatar, {
    onSuccess: (res) => {
      console.log(res, "res");
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["client-data"] });
      onClose();
    },
    onError: (error) => {
      setIsLoading(false);
      const { message: errorMessage } = useError(error);
      setError(errorMessage);
    },
  });

  const avatars = ["avatar-1", "avatar-2", "avatar-3"];

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
