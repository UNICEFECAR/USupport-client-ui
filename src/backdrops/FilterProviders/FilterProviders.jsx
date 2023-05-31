import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  Backdrop,
  CheckBoxGroup,
  Input,
  DropdownWithLabel,
  Toggle,
  DateInput,
} from "@USupport-components-library/src";
import { languageSvc } from "@USupport-components-library/services";

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

  const fetchLanguages = async () => {
    const res = await languageSvc.getAllLanguages();
    const languages = res.data.map((x) => {
      const languageObject = {
        value: x["language_id"],
        alpha2: x.alpha2,
        label: x.name,
        id: x["language_id"],
      };
      return languageObject;
    });
    return languages;
  };
  const languagesQuery = useQuery(["all-languages"], fetchLanguages, {
    retry: false,
  });

  const initialFilters = {
    providerTypes: [],
    providerSex: [],
    maxPrice: "",
    language: null,
    onlyFreeConsultation: false,
    availableAfter: "",
    availableBefore: "",
  };

  const [data, setData] = useState(initialFilters);

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

  const handleResetFilters = () => {
    setData(initialFilters);
    onClose(initialFilters);
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
      secondaryCtaLabel={t("reset_filter")}
      secondaryCtaHandleClick={handleResetFilters}
      secondaryCtaType="secondary"
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
          <DateInput
            label={t("available_after")}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                availableAfter: e?.currentTarget?.value,
              }))
            }
            value={data.availableAfter || ""}
            placeholder="DD.MM.YYY"
            classes={["client-ratings__backdrop__date-picker"]}
          />
          <DateInput
            label={t("available_before")}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                availableBefore: e?.currentTarget?.value,
              }))
            }
            value={data.availableBefore || ""}
            placeholder="DD.MM.YYY"
            classes={["client-ratings__backdrop__date-picker"]}
          />
          <Input
            value={data.maxPrice}
            onChange={(e) => handleSelect("maxPrice", e.target.value)}
            label={t("max_price")}
            placeholder={t("max_price_placeholder")}
            type="number"
          />
          <DropdownWithLabel
            options={languagesQuery.data || []}
            selected={data.language}
            setSelected={(selectedOption) =>
              handleSelect("language", selectedOption)
            }
            label={t("language")}
            placeholder={t("language_placeholder")}
          />
          <div>
            <p className="filter-providers__content__inputs-container__free-text text">
              {t("providers_free_consultation_label")}
            </p>
            <Toggle
              isToggled={data.onlyFreeConsultation}
              setParentState={(checked) =>
                handleSelect("onlyFreeConsultation", checked)
              }
            />
          </div>
        </div>
        {/* <Button label={t("button_label")} size="lg" onClick={handleSave} /> */}
      </div>
    </Backdrop>
  );
};
