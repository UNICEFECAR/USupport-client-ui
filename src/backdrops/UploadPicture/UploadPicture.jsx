import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Backdrop, Loading } from "@USupport-components-library/src";
import { userSvc, clientSvc } from "@USupport-components-library/services";
import { useError } from "@USupport-components-library/hooks";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

import "./upload-picture.scss";

/**
 * UploadPicture
 *
 * The UploadPicture backdrop
 *
 * @return {jsx}
 */
export const UploadPicture = ({ isOpen, onClose }) => {
  const { t } = useTranslation("upload-picture");

  const queryClient = useQueryClient();
  const clientData = queryClient.getQueryData(["client-data"]);
  const userID = userSvc.getUserID();

  const [image, setImage] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!image && clientData) {
      setImage(AMAZON_S3_BUCKET + "/" + clientData.image);
    }
  }, [clientData]);

  const uploadFile = async (content) => {
    const uploadImage = userSvc.uploadFile(content);
    const changeImage = clientSvc.changeImage();
    await Promise.all([uploadImage, changeImage]);
    return true;
  };

  const uploadFileMutation = useMutation(uploadFile, {
    onSuccess: () => {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["client-data"] });
      // onClose();
    },
    onError: (error) => {
      setIsLoading(false);
      const { message: errorMessage } = useError(error);
      setError(errorMessage);
    },
  });

  const onDrop = useCallback((files) => {
    setIsLoading(true);
    const content = new FormData();
    content.append("fileName", userID);
    content.append("fileContent", files[0]);

    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.readAsDataURL(files[0]);

    reader.onload = (e) => {
      setImage(e.target.result);
    };

    uploadFileMutation.mutate(content);
  });

  const { getRootProps, getInputProps, inputRef } = useDropzone({
    onDrop,
  });

  return (
    <Backdrop
      classes="upload-picture"
      title="UploadPicture"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      ctaLabel={t("upload")}
      ctaHandleClick={() => {
        inputRef.current?.click();
      }}
      errorMessage={error}
    >
      <form>
        <div className="upload-picture__content" {...getRootProps()}>
          {isLoading ? (
            <Loading padding="6rem" size="lg" />
          ) : (
            <img
              className="upload-picture__content__image-preview"
              src={image}
            />
          )}
          <p className="upload-picture__content__drag-text">
            {t("drag_and_drop")}
          </p>
          <p>{t("or")}</p>
          <input
            type="file"
            className="upload-picture__content__file-input"
            {...getInputProps()}
          />
        </div>
      </form>
    </Backdrop>
  );
};
