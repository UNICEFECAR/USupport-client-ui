import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";
import { toast } from "react-toastify";

import {
  Block,
  Grid,
  GridItem,
  TabsUnderlined,
  Consultation,
  NewButton,
} from "@USupport-components-library/src";
import { ONE_HOUR } from "@USupport-components-library/utils";

import { useGetAllConsultations, useRejectConsultation } from "#hooks";

import "./consultations.scss";

/**
 * Get upcoming consultations (not yet finished)
 */
const getUpcomingConsultations = (consultations, currentDateTs) => {
  return consultations
    ?.filter((consultation) => {
      const endTime = consultation.timestamp + ONE_HOUR;
      return (
        consultation.timestamp >= currentDateTs ||
        (currentDateTs >= consultation.timestamp && currentDateTs <= endTime)
      );
    })
    .sort((a, b) => a.timestamp - b.timestamp);
};

/**
 * Get past consultations (finished)
 */
const getPastConsultations = (consultations, currentDateTs) => {
  return consultations
    ?.filter((consultation) => {
      const endTime = consultation.timestamp + ONE_HOUR;
      return (
        endTime < currentDateTs &&
        (consultation.status === "finished" ||
          consultation.status === "scheduled")
      );
    })
    .sort((a, b) => b.timestamp - a.timestamp);
};

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
  acceptConsultation,
  onScheduleConsultationClick,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("blocks", { keyPrefix: "consultations" });

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

  const consultationsQuery = useGetAllConsultations();
  const hasAutoTriggeredRef = useRef(false);

  const currentDateTs = new Date().getTime();
  const consultations = consultationsQuery.data || [];
  const upcomingConsultations = getUpcomingConsultations(
    consultations,
    currentDateTs,
  );
  const pastConsultations = getPastConsultations(consultations, currentDateTs);
  const hasUpcoming = upcomingConsultations?.length > 0;
  const hasPast = pastConsultations?.length > 0;

  useEffect(() => {
    if (
      onScheduleConsultationClick &&
      !consultationsQuery.isLoading &&
      consultationsQuery.data &&
      !hasUpcoming &&
      !hasPast &&
      !hasAutoTriggeredRef.current
    ) {
      hasAutoTriggeredRef.current = true;
      onScheduleConsultationClick();
    }
  }, [
    consultationsQuery.isLoading,
    consultationsQuery.data,
    hasUpcoming,
    hasPast,
    onScheduleConsultationClick,
  ]);

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

  const handleOpenEdit = (consultation) => {
    openEditConsultation(consultation);
  };

  const handleOpenDetails = (consultation) => {
    navigate("/activity-history", {
      state: {
        providerId: consultation.providerId,
        consultation,
      },
    });
  };

  const onRejectConsultationSuccess = () => {
    toast(t("reject_consultation_success"));
  };
  const onRejectConsultationError = (error) => {
    toast(error, { type: "error" });
  };
  const rejectConsultationMutation = useRejectConsultation(
    onRejectConsultationSuccess,
    onRejectConsultationError,
  );
  const rejectConsultation = (consultationId) => {
    rejectConsultationMutation.mutate(consultationId);
  };

  const filterConsultations = useCallback(() => {
    const currentDateTs = new Date().getTime();

    return consultationsQuery.data
      ?.filter((consultation) => {
        const endTime = consultation.timestamp + ONE_HOUR;
        if (filter === "upcoming") {
          return (
            consultation.timestamp >= currentDateTs ||
            (currentDateTs >= consultation.timestamp &&
              currentDateTs <= endTime)
          );
        } else {
          return (
            endTime < currentDateTs &&
            (consultation.status === "finished" ||
              consultation.status === "scheduled")
          );
        }
      })
      .sort((a, b) => {
        if (filter === "upcoming") {
          return a.timestamp - b.timestamp;
        } else {
          return b.timestamp - a.timestamp;
        }
      });
  }, [consultationsQuery.data, filter]);

  const renderAllConsultations = useCallback(() => {
    const filteredConsultations = filterConsultations();

    if (filteredConsultations?.length === 0)
      return (
        <GridItem md={8} lg={12}>
          {filter === "upcoming" && hasPast && onScheduleConsultationClick ? (
            <NewButton
              label={t("schedule_button_label")}
              onClick={onScheduleConsultationClick}
              iconName="calendar"
              size="lg"
            />
          ) : (
            <p>
              {t(
                filter === "upcoming"
                  ? "no_upcoming_consultations"
                  : "no_past_consultations",
              )}
            </p>
          )}
        </GridItem>
      );
    return filteredConsultations?.map((consultation, index) => {
      const hasMoreThanOne = filteredConsultations.length > 1;
      return (
        <GridItem
          key={index}
          md={hasMoreThanOne ? 4 : 8}
          lg={hasMoreThanOne ? 4 : 12}
          classes="consultations__grid__consultations-item__grid__consultation"
        >
          <Consultation
            isLoading={consultationsQuery.isLoading}
            renderIn="client"
            handleOpenEdit={handleOpenEdit}
            handleJoinClick={openJoinConsultation}
            handleOpenDetails={handleOpenDetails}
            daysOfWeekTranslations={daysOfWeekTranslations}
            consultation={consultation}
            overview={false}
            suggested={consultation.status === "suggested" ? true : false}
            handleAcceptConsultation={acceptConsultation}
            handleRejectConsultation={rejectConsultation}
            sponsorImage={consultation.sponsorImage}
            withOrganization={!!consultation.organizationId}
            t={t}
            toast={toast}
            classes={
              hasMoreThanOne
                ? "consultations__grid__consultations-item__grid__consultation__item"
                : ""
            }
          />
        </GridItem>
      );
    });
  }, [filterConsultations, filter, onScheduleConsultationClick, t]);

  return (
    <Block classes="consultations">
      <Grid md={8} lg={12} classes="consultations__grid">
        <GridItem md={8} lg={12} classes="consultations__grid__tabs-item">
          <TabsUnderlined
            options={tabsOptions}
            handleSelect={handleTabClick}
            textType="h3"
            t={t}
          />
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
