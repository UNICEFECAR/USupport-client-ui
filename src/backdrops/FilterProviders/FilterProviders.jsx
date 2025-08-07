import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  Backdrop,
  CheckBoxGroup,
  DropdownWithLabel,
  Toggle,
  DateInput,
} from "@USupport-components-library/src";

import "./filter-providers.scss";

/**
 * FilterProviders
 *
 * The FilterProviders backdrop
 *
 * @return {jsx}
 */
export const FilterProviders = ({
  isOpen,
  onClose,
  allFilters,
  setAllFilters,
  isToggleDisabled = false,
  languages,
  initialFilters,
}) => {
  const { t } = useTranslation("backdrops", { keyPrefix: "filter-providers" });

  const [data, setData] = useState({ ...allFilters });

  const [providerTypes, setProviderTypes] = useState([
    {
      label: "provider_psychologist",
      value: "psychologist",
      isSelected: false,
    },
    {
      label: "provider_psychotherapist",
      value: "psychotherapist",
      isSelected: false,
    },
    {
      label: "provider_psychiatrist",
      value: "psychiatrist",
      isSelected: false,
    },
  ]);

  const [providerSex, setProviderSex] = useState([
    {
      label: "male",
      value: "male",
      isSelected: false,
    },
    { label: "female", value: "female", isSelected: false },
    { label: "unspecified", value: "unspecified", isSelected: false },
    // { label: "not_mentioned", value: "not_mentioned", isSelected: false },
  ]);

  useEffect(() => {
    const dataCopy = JSON.stringify(data);
    const allFiltersCopy = JSON.stringify(allFilters);
    if (dataCopy !== allFiltersCopy) {
      setData(allFilters);
    }

    setProviderTypes((prev) => {
      return prev.map((x) => {
        return {
          ...x,
          isSelected: allFilters.providerTypes.includes(x.value),
        };
      });
    });

    setProviderSex((prev) => {
      return prev.map((x) => {
        return {
          ...x,
          isSelected: allFilters.providerSex.includes(x.value),
        };
      });
    });
  }, [allFilters]);

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

    setAllFilters(dataCopy);
    onClose(dataCopy);
  };

  const handleResetFilters = () => {
    setAllFilters(initialFilters);
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
          {/* <CheckBoxGroup
              name="providerType"
              label={t("provider_type_checkbox_group_label")}
              options={providerTypes.map((x) => ({
                ...x,
                label: t(x.label),
              }))}
              setOptions={setProviderTypes}
            /> */}
          <CheckBoxGroup
            name="sex"
            label={t("provider_sex_checkbox_group_label")}
            options={providerSex.map((x) => ({
              ...x,
              label: t(x.label),
            }))}
            setOptions={setProviderSex}
          />
          {/* <div>
            <Toggle
              isToggled={data.onlyFreeConsultation}
              setParentState={(checked) =>
                handleSelect("onlyFreeConsultation", checked)
              }
              label={t("providers_free_consultation_label")}
              isDisabled={isToggleDisabled}
            />
          </div> */}
          <DateInput
            label={t("available_after")}
            onChange={(e) => {
              handleSelect("availableAfter", e.target.value);
            }}
            value={data.availableAfter || ""}
            placeholder={t("available_after")}
            classes={["client-ratings__backdrop__date-picker"]}
          />
          <DateInput
            label={t("available_before")}
            onChange={(e) => handleSelect("availableBefore", e.target.value)}
            value={data.availableBefore || ""}
            placeholder={t("available_before")}
            classes={["client-ratings__backdrop__date-picker"]}
          />
          {/* <Input
            value={data.maxPrice}
            onChange={(e) => handleSelect("maxPrice", e.target.value)}
            label={t("max_price")}
            placeholder={t("max_price_placeholder")}
            type="number"
          /> */}
          <DropdownWithLabel
            options={
              languages?.map((x) => {
                return { ...x, label: x.name, value: x.language_id };
              }) || []
            }
            selected={data.language}
            setSelected={(selectedOption) =>
              handleSelect("language", selectedOption)
            }
            label={t("language")}
            placeholder={t("language_placeholder")}
          />
        </div>
        {/* <Button label={t("button_label")} size="lg" onClick={handleSave} /> */}
      </div>
    </Backdrop>
  );
};
