import React, { useState } from "react";
import {
  Backdrop,
  CheckBoxGroup,
  DropdownWithLabel,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./filter-providers.scss";

/**
 * FilterProviders
 *
 * The FilterProviders backdrop
 *
 * @return {jsx}
 */
export const FilterProviders = ({ isOpen, onClose }) => {
  const { t } = useTranslation("filter-providers");

  const [data, setData] = useState({
    providerTypes: [],
    providerGenders: [],
    yearsOfExperience: null,
  });

  const [providerTypes, setProviderTypes] = useState([
    {
      label: t("provider_psychologist"),
      value: "psychologist",
      isSelected: false,
    },
    {
      label: t("provider_psychotherapist"),
      value: "psychotherapist",
      isSelected: false,
    },
    { label: t("provider_coach"), value: "coach", isSelected: false },
  ]);

  const [providerGenders, setProviderGenders] = useState([
    {
      label: t("gender_m"),
      value: "male",
      isSelected: false,
    },
    { label: t("gender_f"), value: "female", isSelected: false },
  ]);

  const yearsOfExperience = [
    { label: "1-5", value: "one-to-five" },
    { label: "5-10", value: "five-to-ten" },
    { label: "10-15", value: "ten-to-fiveteen" },
  ];

  const handleSelect = (field, value) => {
    const dataCopy = { ...data };
    dataCopy[field] = value;
    setData(dataCopy);
  };

  const handleSave = () => {
    const dataCopy = { ...data };
    dataCopy["providerTypes"] = providerTypes
      .filter((x) => x.isSelected)
      .map((x) => x.value);

    dataCopy["providerGenders"] = providerGenders
      .filter((x) => x.isSelected)
      .map((x) => x.value);

    setData(dataCopy);
    onClose();
  };

  return (
    <Backdrop
      classes="filter-providers"
      heading={t("heading")}
      text={t("subheading")}
      isOpen={isOpen}
      onClose={onClose}
      ctaLabel={t("button_label")}
      ctahandleClick={handleSave}
    >
      <div className="filter-providers__content">
        <div className="filter-providers__content__inputs-container">
          <CheckBoxGroup
            name="providerType"
            label={t("provider_type_checkbox_group_label")}
            options={providerTypes}
            setOptions={setProviderTypes}
          />
          <CheckBoxGroup
            name="gender"
            label={t("provider_gender_checkbox_group_label")}
            options={providerGenders}
            setOptions={setProviderGenders}
          />
          <DropdownWithLabel
            options={yearsOfExperience}
            selected={data.yearsOfExperience}
            placeholder={t("dropdown_placeholder")}
            setSelected={(option) => handleSelect("yearsOfExperience", option)}
            label={"Years of experience"}
          />
        </div>
        {/* <Button label={t("button_label")} size="lg" onClick={handleSave} /> */}
      </div>
    </Backdrop>
  );
};
