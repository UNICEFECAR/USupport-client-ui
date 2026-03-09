import React from "react";
import { useTranslation } from "react-i18next";
import {useCustomNavigate as useNavigate} from "#hooks";

import { Backdrop,ButtonSelector } from "@USupport-components-library/src";

import "./user-guide.scss";

/**
 * UserGuide
 *
 * The UserGuide backdrop
 *
 * @return {jsx}
 */
export const UserGuide = ({ isOpen, onClose, handleOpenEmergencySituation }) => {
  const {t} = useTranslation("backdrops", { keyPrefix: "user-guide" });
  const navigate = useNavigate();
  const buttons = [
    {name:"emergency_services", icon:"phone-emergency", path:"/sos-center"},
    {name:"map", icon:"location", onClick: handleOpenEmergencySituation},
    {name:"rights", icon:"read-book", path:"/children-rights?start=rights-intro"},
  ]
  return (
    <Backdrop
      classes='user-guide'
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
    >
<div className="user-guide__buttons"> 
      {buttons.map((button) => (
        <ButtonSelector
          key={button.name}
          label={t(button.name)}
          iconName={button.icon}
          onClick={() => {
            if(button.onClick) {
              button.onClick();
            } else {
              navigate(button.path);
            }
          }}
        />
      ))}
      </div>
    </Backdrop>
  );
};
