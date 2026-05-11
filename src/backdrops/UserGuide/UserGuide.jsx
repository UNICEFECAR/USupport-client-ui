import React from "react";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";

import { Backdrop, Icon } from "@USupport-components-library/src";

import "./user-guide.scss";

/**
 * UserGuide
 *
 * The UserGuide backdrop
 *
 * @return {jsx}
 */
export const UserGuide = ({
  isOpen,
  onClose,
  handleOpenEmergencySituation,
}) => {
  const { t } = useTranslation("backdrops", { keyPrefix: "user-guide" });
  const navigate = useNavigate();

  const options = [
    {
      name: "emergency_services",
      icon: "phone-emergency",
      path: "/sos-center",
      descriptionKey: "emergency_services_description",
    },
    {
      name: "map",
      icon: "location",
      onClick: handleOpenEmergencySituation,
      descriptionKey: "map_description",
    },
    {
      name: "rights",
      icon: "read-book",
      path: "/children-rights?start=rights-intro",
      descriptionKey: "rights_description",
    },
  ];

  const handleOptionClick = (option) => {
    if (option.onClick) {
      option.onClick();
    } else if (option.path) {
      navigate(option.path);
    }
  };

  return (
    <Backdrop
      classes="user-guide"
      title="UserGuide"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
    >
      <div className="user-guide__content">
        <div className="user-guide__options">
          {options.map((option) => (
            <button
              key={option.name}
              type="button"
              className="user-guide__option-card"
              onClick={() => handleOptionClick(option)}
            >
              <div className="user-guide__option-card__icon">
                <Icon name={option.icon} size="md" color="#ffffff" />
              </div>

              <div className="user-guide__option-card__text">
                <p className="text user-guide__option-card__description">
                  {t(option.descriptionKey, {
                    defaultValue: t(option.name),
                  })}
                </p>
              </div>

              <div className="user-guide__option-card__chevron">
                <Icon name="chevron-right" size="sm" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </Backdrop>
  );
};
