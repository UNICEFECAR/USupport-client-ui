import React, { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Block,
  Error,
  Input,
  DropdownWithLabel,
  RadioButtonSelectorGroup,
  Button,
  Grid,
  GridItem,
} from "@USupport-components-library/src";
import { validateProperty, validate } from "@USupport-components-library/utils";
import { useUpdateClientData, useGetClientData } from "#hooks";

import Joi from "joi";

import "./register-about-you.scss";

/**
 * RegisterAboutYou
 *
 * RegisterAboutYou block
 *
 * @return {jsx}
 */
export const RegisterAboutYou = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("register-about-you");
  const queryClient = useQueryClient();
  const countriesData = queryClient.getQueryData(["countries"]);

  const schema = Joi.object({
    name: Joi.string().allow(null, "", " ").label(t("nickname_error")),
    surname: Joi.string().allow(null, "", " ").label(t("nickname_error")),
    sex: Joi.string().invalid(null).label(t("sex_error")),
    yearOfBirth: Joi.number().invalid(null).label(t("year_of_birth_error")),
    livingPlace: Joi.string().invalid(null).label(t("place_of_living_error")),
  });

  const clientData = useGetClientData()[1];

  const sexOptions = [
    { label: t("sex_male"), value: "male" },
    { label: t("sex_female"), value: "female" },
    { label: t("sex_unspecified"), value: "unspecified" },
    { label: t("sex_none"), value: "none" },
  ];

  const livingPlaceOptions = [
    { label: t("place_of_living_urban"), value: "urban" },
    { label: t("place_of_living_rural"), value: "rural" },
  ];

  const [data, setData] = useState({
    name: "",
    surname: "",
    sex: "",
    yearOfBirth: "",
    livingPlace: "",
  });

  useEffect(() => {
    if (clientData) {
      setData({
        name: clientData.name,
        surname: clientData.surname,
        sex: clientData.sex,
        yearOfBirth: clientData.yearOfBirth,
        livingPlace: clientData.livingPlace,
      });
    }
  }, [clientData]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      years.push({ label: year.toString(), value: year });
    }
    return years.reverse();
  }, [countriesData]);
  const onMutateSuccess = () => {
    navigate("/register/support");
  };

  const onMutateError = (error) => {
    setErrors({ submit: error });
    setIsSubmitting(false);
  };

  // Make sure we get the freshest data before sending it to the mutation function
  const getDataToSend = useCallback(() => {
    return {
      ...data,
      email: clientData?.email,
      nickname: clientData?.nickname,
    };
  }, [clientData, data]);

  const updateClientDetailsMutation = useUpdateClientData(
    getDataToSend(),
    onMutateSuccess,
    onMutateError
  );

  const handleBlur = (field) => {
    validateProperty(field, data[field], schema, setErrors);
  };

  const handleSelect = (field, value) => {
    const newData = { ...data };

    newData[field] = value;

    setData(newData);
  };

  const handleContinue = async () => {
    setIsSubmitting(true);

    if ((await validate(data, schema, setErrors)) === null) {
      updateClientDetailsMutation.mutate();
    } else {
      setIsSubmitting(false);
    }
  };

  const canContinue = data.sex && data.yearOfBirth && data.livingPlace;

  return (
    <Block classes="register-about-you">
      <Grid md={8} lg={12} classes="register-about-you__grid">
        <GridItem
          md={8}
          lg={12}
          classes="register-about-you__grid__content-item"
        >
          <div className="register-about-you__grid__content-item__inputs-container">
            <Input
              label={t("input_name_label")}
              placeholder={t("input_name_placeholder")}
              name="name"
              onChange={(e) => handleSelect("name", e.currentTarget.value)}
              value={data.name}
              onBlur={() => handleBlur("name")}
            />
            <Input
              label={t("input_surname_label")}
              placeholder={t("input_surname_placeholder")}
              name="surname"
              onChange={(e) => handleSelect("surname", e.currentTarget.value)}
              value={data.surname}
              onBlur={() => handleBlur("surname")}
            />

            <DropdownWithLabel
              options={sexOptions}
              selected={data.sex}
              errorMessage={errors.sex}
              setSelected={(option) => handleSelect("sex", option)}
              label={t("dropdown_sex_label")}
              classes="register-about-you__grid__content-item__inputs-container__sex-dropdown"
            />
            <DropdownWithLabel
              options={getYearsOptions()}
              selected={data.yearOfBirth}
              errorMessage={errors.yearOfBirth}
              setSelected={(option) => handleSelect("yearOfBirth", option)}
              label={t("dropdown_year_label")}
              classes="register-about-you__grid__content-item__inputs-container__year-dropdown"
            />
            <RadioButtonSelectorGroup
              name="livingPlace"
              label={t("living_place_label")}
              options={livingPlaceOptions}
              selected={data.livingPlace}
              errorMessage={errors.livingPlace}
              setSelected={(option) => handleSelect("livingPlace", option)}
            />
          </div>
          {errors.submit ? <Error message={errors.submit} /> : null}
          <Button
            disabled={!canContinue || isSubmitting}
            size="lg"
            label={t("button_continue_label")}
            onClick={() => handleContinue()}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
