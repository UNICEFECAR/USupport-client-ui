import React from "react";
import {
  Block,
  Input,
  DropdownWithLabel,
  RadioButtonSelectorGroup,
  Button,
  Grid,
  GridItem,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./register-about-you.scss";

/**
 * RegisterAboutYou
 *
 * RegisterAboutYou block
 *
 * @return {jsx}
 */
export const RegisterAboutYou = () => {
  const { t } = useTranslation("register-about-you");

  const [data, setData] = React.useState({
    name: "",
    gender: null,
    yearOfBirth: null,
    placeOfLiving: null,
  });

  const genderOptions = [
    { label: t("gender_male"), value: "male" },
    { label: t("gender_female"), value: "female" },
  ];

  const placeOfLivingOptions = [
    { label: t("place_of_living_urban"), value: "Urban" },
    { label: t("place_of_living_rural"), value: "Rural" },
  ];

  const yearsOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 100; i++) {
      years.push({ label: `${currentYear - i}`, value: `${currentYear - i}` });
    }
    return years;
  };

  const handleSelect = (field, value) => {
    const newData = { ...data };

    newData[field] = value;

    setData(newData);
  };

  const handleContinue = () => {
    console.log("Continue");
  };

  const canContinue =
    data.name && data.gender && data.yearOfBirth && data.placeOfLiving;

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
              label={t("input_nickname_label")}
              placeholder={t("input_nickname_placeholder")}
              name="nickname"
              onChange={(e) => handleSelect("name", e.target.value)}
            />
            <DropdownWithLabel
              options={genderOptions}
              selected={data.gender}
              setSelected={(option) => handleSelect("gender", option)}
              label={t("dropdown_gender_label")}
              classes="register-about-you__grid__content-item__inputs-container__gender-dropdown"
            />
            <DropdownWithLabel
              options={yearsOptions()}
              selected={data.yearOfBirth}
              setSelected={(option) => handleSelect("yearOfBirth", option)}
              label={t("dropdown_year_label")}
              classes="register-about-you__grid__content-item__inputs-container__year-dropdown"
            />
            <RadioButtonSelectorGroup
              name="placeOfLiving"
              label={t("radio_button_selector_group_label")}
              options={placeOfLivingOptions}
              selected={data.placeOfLiving}
              setSelected={(option) => handleSelect("placeOfLiving", option)}
            />
          </div>
          <Button
            disabled={!canContinue}
            size="lg"
            label="Continue"
            onClick={() => handleContinue()}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
