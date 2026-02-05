import React from "react";
import { useTranslation, Trans } from "react-i18next";

import { Backdrop, ButtonSelector } from "@USupport-components-library/src";

import { useCustomNavigate as useNavigate } from "#hooks";

import "./emergency-situation.scss";

/**
 * EmergencySituation
 *
 * The EmergencySituation backdrop
 *
 * @return {jsx}
 */
export const EmergencySituation = ({ isOpen, onClose }) => {
  const {t} = useTranslation("backdrops", { keyPrefix: "emergency-situation" });

const navigate = useNavigate()

  return (
    <Backdrop
      classes='emergency-situation'
      title='EmergencySituation'
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
    >
      <p className='text'>{t("paragraph")}</p>
      <br/>
      <p className='text'>
      <Trans t={t} components={[<strong />]}>
        {t("paragraph_two")}
      </Trans>
      </p>
      <div className="emergency-situation__buttons">
      <ButtonSelector
        label={t("yes")}
        onClick={() => navigate("/sos-center")}
      />
      <ButtonSelector
        label={t("no")}
        onClick={() => navigate("/children-rights?start=non-emergency")}
      />
      <ButtonSelector
        label={t("dont_know")}
        onClick={() => navigate("/children-rights?start=non-emergency")}
      />
      </div>
    </Backdrop>
  );
};
