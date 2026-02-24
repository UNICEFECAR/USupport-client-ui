import React, { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";

import {
  Backdrop,
  Input,
  DropdownWithLabel,
} from "@USupport-components-library/src";
import { validateProperty, validate } from "@USupport-components-library/utils";
import { useUpdateClientData, useGetClientData } from "#hooks";

import { AuthenticationModalsLogo } from "../";

import Joi from "joi";

import "./register-about-you.scss";

/**
 * RegisterAboutYou
 *
 * RegisterAboutYou backdrop
 *
 * @return {jsx}
 */
export const RegisterAboutYou = ({
  isOpen,
  isAnonymous,
  onSuccess,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("blocks", { keyPrefix: "register-about-you" });
  const queryClient = useQueryClient();
  const countriesData = queryClient.getQueryData(["countries"]);

  const schema = Joi.object({
    name: Joi.string().allow(null, "", " ").label(t("name_error")),
    surname: Joi.string().allow(null, "", " ").label(t("surname_error")),
    sex: Joi.string().invalid(null).label(t("sex_error")),
    yearOfBirth: Joi.string().invalid(null).label(t("year_of_birth_error")),
    urbanRural: Joi.string().invalid(null).label(t("place_of_living_error")),
  });

  const clientDataQuery = useGetClientData(true, true)[0];
  const clientData = clientDataQuery?.data;

  const sexOptions = [
    { label: t("sex_male"), value: "male" },
    { label: t("sex_female"), value: "female" },
    { label: t("sex_unspecified"), value: "unspecified" },
    // { label: t("sex_none"), value: "notMentioned" },
  ];

  const urbanRuralOptions = [
    { label: t("place_of_living_urban"), value: "urban" },
    { label: t("place_of_living_rural"), value: "rural" },
  ];

  const [data, setData] = useState({
    name: "",
    surname: "",
    sex: "",
    yearOfBirth: "",
    urbanRural: "",
  });

  useEffect(() => {
    if (clientData) {
      setData({
        name: clientData.name,
        surname: clientData.surname,
        sex: clientData.sex,
        yearOfBirth: clientData.yearOfBirth,
        urbanRural: clientData.urbanRural,
      });
    }
  }, [clientData]);

  const [errors, setErrors] = useState({});

  const country = localStorage.getItem("country");
  const selectedCountry = countriesData?.find((c) => c.value === country);
  const minAge = selectedCountry?.minAge;
  const maxAge = selectedCountry?.maxAge;

  // Create an array of year objects from year 1900 to current year
  const getYearsOptions = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (
      let year = currentYear - maxAge;
      year <= currentYear - minAge;
      year++
    ) {
      years.push({ label: year.toString(), value: year.toString() });
    }
    // Only add parent option if country is not PL
    if (country !== "PL") {
      years.push({
        label: t("parent"),
        value: "parent",
      });
    }
    return years.reverse();
  }, [country, minAge, maxAge, t]);

  const onMutateSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/dashboard");
    }
  };

  const onMutateError = (error) => {
    setErrors({ submit: error });
  };

  const getDataToSend = useCallback(() => {
    if (isAnonymous) {
      const dataCopy = { ...data };
      delete dataCopy["name"];
      delete dataCopy["surname"];

      return {
        ...dataCopy,
        nickname: clientData?.nickname,
        name: "",
        surname: "",
        accessToken: clientData?.accessToken,
      };
    }
    return {
      ...data,
      email: clientData?.email,
      nickname: clientData?.nickname,
    };
  }, [clientData, data, isAnonymous]);

  const updateClientDetailsMutation = useUpdateClientData(
    getDataToSend(),
    onMutateSuccess,
    onMutateError,
  );

  const handleBlur = (field) => {
    validateProperty(field, data[field], schema, setErrors);
  };

  const handleSelect = (field, value) => {
    const newData = { ...data };
    newData[field] = value;
    setData(newData);
  };

  const handleChange = (field, value) => {
    const newData = { ...data };
    newData[field] = value;
    setData(newData);
  };

  const handleContinue = async () => {
    if ((await validate(data, schema, setErrors)) === null) {
      const newClientData = {
        ...clientData,
        ...data,
      };
      queryClient.setQueryData(["client-data"], newClientData);
      queryClient.getQueryData(["client-data"]);
      updateClientDetailsMutation.mutate();
    }
  };

  const canContinue = data.sex && data.yearOfBirth && data.urbanRural;

  return (
    <Backdrop
      classes="register-about-you-modal"
      isOpen={isOpen}
      onClose={() => {}}
      hasCloseIcon={false}
      heading={t("heading") || "Tell us about yourself"}
      errorMessage={errors.submit}
      ctaLabel={t("button_continue_label")}
      ctaHandleClick={handleContinue}
      isCtaDisabled={!canContinue}
      isCtaLoading={updateClientDetailsMutation.isLoading}
      thirdCtaLabel={t("logout_button_label")}
      thirdCtaHandleClick={handleLogout}
      topHeaderComponent={<AuthenticationModalsLogo />}
    >
      <div className="register-about-you-modal__content-container">
        <div className="register-about-you-modal__content-container__inputs-container">
          {isAnonymous ? null : (
            <React.Fragment>
              <Input
                label={t("input_name_label")}
                placeholder={t("input_name_placeholder")}
                name="name"
                onChange={(e) => handleChange("name", e.currentTarget.value)}
                value={data.name}
                onBlur={() => handleBlur("name")}
                errorMessage={errors.name}
              />
              <Input
                label={t("input_surname_label")}
                placeholder={t("input_surname_placeholder")}
                name="surname"
                onChange={(e) => handleChange("surname", e.currentTarget.value)}
                value={data.surname}
                onBlur={() => handleBlur("surname")}
                errorMessage={errors.surname}
              />
            </React.Fragment>
          )}

          <DropdownWithLabel
            options={sexOptions}
            selected={data.sex}
            errorMessage={errors.sex}
            setSelected={(option) => handleSelect("sex", option)}
            label={t("dropdown_sex_label")}
            classes="register-about-you-modal__content-container__inputs-container__sex-dropdown"
            placeholder={t("sex_placeholder")}
          />
          <DropdownWithLabel
            options={getYearsOptions()}
            selected={data.yearOfBirth}
            errorMessage={errors.yearOfBirth}
            setSelected={(option) =>
              handleSelect("yearOfBirth", option.toString())
            }
            label={t("dropdown_year_label")}
            classes="register-about-you-modal__content-container__inputs-container__year-dropdown"
            placeholder={t("year_of_birth_placeholder")}
          />
          <DropdownWithLabel
            options={urbanRuralOptions}
            selected={data.urbanRural}
            errorMessage={errors.urbanRural}
            setSelected={(option) => handleSelect("urbanRural", option)}
            label={t("living_place_label")}
            placeholder={t("living_place_placeholder")}
          />
        </div>
      </div>
    </Backdrop>
  );
};
