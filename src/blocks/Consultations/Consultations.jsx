import React, { useState } from "react";
import {
  Block,
  Grid,
  GridItem,
  TabsUnderlined,
  Consultation,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./consultations.scss";

/**
 * Consultations
 *
 * Consultations block
 *
 * @return {jsx}
 */
export const Consultations = ({}) => {
  const { t } = useTranslation("consultations");

  const [tabsOptions, setTabsOptions] = useState([
    { label: t("upcoming_tab_label"), value: "upcoming", isSelected: true },
    { label: t("past_tab_label"), value: "past", isSelected: false },
  ]);

  const [filter, setFilter] = useState("upcoming");

  const handleTabClick = (index) => {
    const optionsCopy = [...tabsOptions];

    for (let i = 0; i < optionsCopy.length; i++) {
      if (i === index) {
        optionsCopy[i].isSelected = true;
      } else {
        optionsCopy[i].isSelected = false;
      }
    }

    setTabsOptions(optionsCopy);
    setFilter(optionsCopy[index].value);
  };

  const renderAllConsultations = () => {
    const consultations = [];

    for (let i = 0; i < 5; i++) {
      consultations.push({
        specialistName: "Dr. Joanna Doe",
        startDate: new Date("2022-11-1 15:00"),
        endDate: new Date("2022-11-1 16:00"),
        overview: false,
      });
    }

    let today = new Date();

    for (let i = 0; i < 4; i++) {
      consultations.push({
        specialistName: "Dr. Joanna Doe",
        startDate: new Date(today.setDate(today.getDate() + 1)),
        endDate: new Date(today.setDate(today.getDate() + 1)),
        overview: false,
      });
    }

    today = new Date();

    if (filter === "upcoming") {
      return consultations
        .filter((consultation) => consultation.startDate >= today)
        .map((consultation, index) => {
          return (
            <GridItem
              key={index}
              md={4}
              lg={6}
              classes="consultations__grid__consultations-item__grid__consultation"
            >
              <Consultation
                specialistName={consultation.specialistName}
                startDate={consultation.startDate}
                endDate={consultation.endDate}
                overview={consultation.overview}
              />
            </GridItem>
          );
        });
    } else {
      return consultations
        .filter((consultation) => consultation.startDate < today)
        .map((consultation, index) => {
          return (
            <GridItem
              key={index}
              md={4}
              lg={6}
              classes="consultations__grid__consultations-item__grid__consultation"
            >
              <Consultation
                specialistName={consultation.specialistName}
                startDate={consultation.startDate}
                endDate={consultation.endDate}
                overview={consultation.overview}
              />
            </GridItem>
          );
        });
    }
  };

  return (
    <Block classes="consultations">
      <Grid md={8} lg={12} classes="consultations__grid">
        <GridItem md={4} lg={6} classes="consultations__grid__tabs-item">
          <TabsUnderlined options={tabsOptions} handleSelect={handleTabClick} />
        </GridItem>
        <GridItem
          md={8}
          lg={12}
          classes="consultations__grid__consultations-item"
        >
          <Grid
            md={8}
            lg={12}
            classe="consultations__grid__consultations-item__grid"
          >
            {renderAllConsultations()}
          </Grid>
        </GridItem>
      </Grid>
    </Block>
  );
};
