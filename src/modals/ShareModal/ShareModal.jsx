import React from "react";
import { toast } from "react-toastify";
import {
  FacebookShareButton,
  FacebookIcon,
  VKShareButton,
  VKIcon,
} from "react-share";

import { Modal, Icon } from "@USupport-components-library/src";
import "./share-modal.scss";

/**
 * ShareModal
 *
 * ShareModal component for sharing content
 *
 * @return {jsx}
 */
export const ShareModal = ({
  isOpen,
  onClose,
  contentUrl,
  title,
  successText,
  copyText,
  shareTitle,
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(contentUrl);
    toast(successText);
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={onClose}
      classes="share-modal"
      heading={shareTitle}
    >
      <div className="share-modal__container">
        <div className="share-modal__social-buttons">
          <FacebookShareButton url={contentUrl} title={title}>
            <FacebookIcon size={48} round />
            <p>Facebook</p>
          </FacebookShareButton>
          <VKShareButton url={contentUrl}>
            <VKIcon size={48} round />
            <p>VKontakte</p>
          </VKShareButton>
          <div className="share-modal__copy-link-container">
            <div
              className="share-modal__copy-link-icon"
              onClick={handleCopyLink}
            >
              <Icon color="#20809e" name="copy" size="md" />
            </div>
            <p className="share-modal__copy-link-title">{copyText}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
