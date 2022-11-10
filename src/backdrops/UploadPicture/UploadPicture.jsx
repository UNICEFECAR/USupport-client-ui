import React, { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Backdrop } from "@USupport-components-library/src";
import { useDropzone } from "react-dropzone";
import { userSvc } from "@USupport-components-library/services";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

import "./upload-picture.scss";

import { specialistPlaceholder } from "@USupport-components-library/assets";
import { useEffect } from "react";

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
  const [image, setImage] = useState(clientData?.image);

  useEffect(() => {
    if (!image && clientData) {
      setImage(clientData.image);
    }
  }, [clientData]);

  const uploadFile = async (content) => {
    const res = await userSvc.uploadFile(content);
    if (res.status === 200) {
      return true;
    }
  };
  const uploadFileMutation = useMutation(uploadFile, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-data"] });
    },
    onError: (error) => {
      console.log(error, "err");
    },
  });

  const onDrop = useCallback((files) => {
    const content = new FormData();
    content.append("fileName", clientData.clientID);
    content.append("fileContent", files[0]);

    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.readAsDataURL(files[0]);

    reader.onload = () => {
      setImage(clientData.clientID);
    };

    uploadFileMutation.mutate(content);
  });

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop,
  });
  // const { ref: fileInputRef } = getInputProps();

  return (
    <Backdrop
      classes="upload-picture"
      title="UploadPicture"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      ctaLabel={t("upload")}
      ctaHandleClick={() => {
        console.log("click");
        inputRef.current?.click();
      }}
    >
      <form>
        <div className="upload-picture__content" {...getRootProps()}>
          <img
            className="upload-picture__content__image-preview"
            src={AMAZON_S3_BUCKET + "/" + image}
          />
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
