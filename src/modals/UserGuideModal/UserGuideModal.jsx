import React from 'react';
import { Modal } from '@USupport-components-library/src';

import './user-guide-modal.scss';

/**
 * UserGuideModal
 *
 * The UserGuideModal modal
 *
 * @return {jsx}
 */
export const UserGuideModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      classes='user-guide-modal'
      heading='UserGuideModal'
      isOpen={isOpen}
      closeModal={onClose}
    ></Modal>
  );
};
