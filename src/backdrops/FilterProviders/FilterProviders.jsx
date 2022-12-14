import React, { useState } from "react";
import {
  Backdrop,
  CheckBoxGroup,
  Input,
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
    providerSex: [],
    maxPrice: "",
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
    {
      label: t("provider_psychiatrist"),
      value: "psychiatrist",
      isSelected: false,
    },
  ]);

  const [providerSex, setProviderSex] = useState([
    {
      label: t("male"),
      value: "male",
      isSelected: false,
    },
    { label: t("female"), value: "female", isSelected: false },
    { label: t("unspecified"), value: "unspecified", isSelected: false },
  ]);

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

    dataCopy["providerSex"] = providerSex
      .filter((x) => x.isSelected)
      .map((x) => x.value);

    setData(dataCopy);
    onClose(dataCopy);
  };

  return (
    <Backdrop
      classes="filter-providers"
      heading={t("heading")}
      text={t("subheading")}
      isOpen={isOpen}
      onClose={handleSave}
      ctaLabel={t("button_label")}
      ctaHandleClick={handleSave}
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
            name="sex"
            label={t("provider_sex_checkbox_group_label")}
            options={providerSex}
            setOptions={setProviderSex}
          />
          <Input
            value={data.maxPrice}
            onChange={(e) => handleSelect("maxPrice", e.target.value)}
            label={t("max_price")}
            placeholder={t("max_price_placeholder")}
            type="number"
          />
        </div>
        {/* <Button label={t("button_label")} size="lg" onClick={handleSave} /> */}
      </div>
    </Backdrop>
  );
};
