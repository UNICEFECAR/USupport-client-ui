import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Block,
  Grid,
  GridItem,
  TabsUnderlined,
  Consultation,
} from "@USupport-components-library/src";

import "./consultations.scss";

/**
 * Consultations
 *
 * Consultations block
 *
 * @return {jsx}
 */
export const Consultations = ({
  openEditConsultation,
  openJoinConsultation,
}) => {
  const navigate = useNavigate();
  let today = new Date();
  const { t } = useTranslation("consultations");

  const [tabsOptions, setTabsOptions] = useState([
    { label: t("upcoming_tab_label"), value: "upcoming", isSelected: true },
    { label: t("past_tab_label"), value: "past", isSelected: false },
  ]);

  const [filter, setFilter] = useState("upcoming");

  const daysOfWeekTranslations = {
    monday: t("monday"),
    tuesday: t("tuesday"),
    wednesday: t("wednesday"),
    thursday: t("thursday"),
    friday: t("friday"),
    saturday: t("saturday"),
    sunday: t("sunday"),
  };

  const fetchConsultations = async () => {};
  const consultationsQuery = useQuery(["consultations"], fetchConsultations, {
    enabled: false, // TODO: Enable this when the API is ready and remove the placeholder data
    placeholderData: [
      {
        id: 1,
        specialistName: "Dr. Joanna doe 1",
        timestamp: 1668699720000,
        overview: false,
      },
      {
        id: 2,
        specialistName: "Dr. Joanna doe 2",
        timestamp: 1668879057000,
        overview: false,
      },
      {
        id: 3,
        specialistName: "Dr. Joanna doe 3",
        timestamp: 1668886182290,
        overview: false,
      },
      {
        id: 4,
        specialistName: "Dr. Joanna doe 4",
        timestamp: 1669141319000,
        overview: false,
      },
      {
        id: 5,
        specialistName: "Dr. Joanna doe 5",
        timestamp: 1669832519000,
        overview: false,
      },
    ],
  });

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

  const handleOpenEdit = (providerId) => {
    openEditConsultation(providerId);
  };

  const handleOpenDetails = (providerId, consultationId) => {
    // TODO: Redirect to the activity history page
    navigate("/activity-history", {
      state: {
        providerId,
        consultationId,
      },
    });
  };

  const filterConsultations = useCallback(() => {
    const currentDate = new Date();
    const currentDateTs = currentDate.getTime();

    return consultationsQuery.data?.filter((consultation) => {
      const endTime = consultation.timestamp + 3600000;
      if (filter === "upcoming") {
        return (
          consultation.timestamp >= currentDateTs ||
          (currentDateTs >= consultation.timestamp && currentDateTs <= endTime)
        );
      } else {
        return endTime < currentDateTs;
      }
    });
  }, [consultationsQuery.data, filter]);

  const renderAllConsultations = useMemo(() => {
    const filteredConsultations = filterConsultations();

    if (filteredConsultations?.length === 0)
      return (
        <GridItem md={8} lg={12}>
          <p>{t("no_consultations")}</p>
        </GridItem>
      );
    return filteredConsultations.map((consultation, index) => {
      const hasMoreThanOne = filteredConsultations.length > 1;
      return (
        <GridItem
          key={index}
          md={hasMoreThanOne ? 4 : 8}
          lg={hasMoreThanOne ? 6 : 12}
          classes="consultations__grid__consultations-item__grid__consultation"
        >
          <Consultation
            name={consultation.specialistName}
            startDate={consultation.startDate}
            endDate={consultation.endDate}
            overview={consultation.overview}
            renderIn="client"
            handleOpenEdit={handleOpenEdit}
            handleJoinClick={openJoinConsultation}
            handleOpenDetails={handleOpenDetails}
            timestamp={consultation.timestamp}
            daysOfWeekTranslations={daysOfWeekTranslations}
            providerId={consultation.id.toString()}
          />
        </GridItem>
      );
    });
  }, [consultationsQuery.data, filter]);

  return (
    <Block classes="consultations">
      <Grid md={8} lg={12} classes="consultations__grid">
        <GridItem md={8} lg={12} classes="consultations__grid__tabs-item">
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
            {renderAllConsultations}
          </Grid>
        </GridItem>
      </Grid>
    </Block>
  );
};
