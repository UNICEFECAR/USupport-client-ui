import React from "react";
import { Backdrop } from "@USupport-components-library/src";

import "./join-consultation.scss";

/**
 * JoinConsultation
 *
 * The JoinConsultation backdrop
 *
 * @return {jsx}
 */
export const JoinConsultation = ({ isOpen, onClose }) => {
  return (
    <Backdrop
      classes="join-consultation"
      title="JoinConsultation"
      isOpen={isOpen}
      onClose={onClose}
    ></Backdrop>
  );
};
