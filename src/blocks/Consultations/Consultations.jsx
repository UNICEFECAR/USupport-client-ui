import React, { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";
import { toast } from "react-toastify";

import {
  Block,
  Box,
  Grid,
  GridItem,
  Consultation,
  NewButton,
} from "@USupport-components-library/src";
import { ONE_HOUR } from "@USupport-components-library/utils";

import { useGetAllConsultations, useRejectConsultation } from "#hooks";
import { ConsultationSkeletonCard } from "../ConsultationSkeleton";

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
    currentDateTs
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
    onRejectConsultationError
  );
  const rejectConsultation = (consultationId) => {
    rejectConsultationMutation.mutate(consultationId);
  };

  const renderConsultationSkeletons = (count, withActions = false) =>
    Array.from({ length: count }, (_, index) => (
      <GridItem
        key={`consultation-skeleton-${
          withActions ? "upcoming" : "past"
        }-${index}`}
        md={8}
        lg={6}
        classes="consultations__grid__consultations-item__grid__consultation"
      >
        <ConsultationSkeletonCard withActions={withActions} />
      </GridItem>
    ));

  const renderLoadingSkeletonState = () => (
    <div className="consultations__loading">
      <div className="consultations__section consultations__section--upcoming">
        <div className="consultations__heading">
          <div className="consultations__heading-main">
            <h3 className="consultations__heading-title">
              {t("upcoming_tab_label")}
            </h3>
          </div>
          {onScheduleConsultationClick && (
            <NewButton
              label={t("schedule_button_label")}
              onClick={onScheduleConsultationClick}
              iconName="calendar"
              size="lg"
              classes="consultations__heading-button--inline"
            />
          )}
        </div>
        <Grid
          md={8}
          lg={12}
          classes="consultations__grid__consultations-item__grid"
        >
          {renderConsultationSkeletons(1, true)}
        </Grid>
      </div>

      <div className="consultations__section consultations__section--past">
        <div className="consultations__heading">
          <div className="consultations__heading-main">
            <h3 className="consultations__heading-title">
              {t("past_tab_label")}
            </h3>
          </div>
        </div>
        <Grid
          md={8}
          lg={12}
          classes="consultations__grid__consultations-item__grid"
        >
          {renderConsultationSkeletons(4)}
        </Grid>
      </div>
    </div>
  );

  const renderAllConsultations = useCallback(() => {
    const nowTs = new Date().getTime();
    const upcoming =
      getUpcomingConsultations(consultationsQuery.data || [], nowTs) || [];
    const past =
      getPastConsultations(consultationsQuery.data || [], nowTs) || [];
    const hasUpcomingLocal = upcoming.length > 0;
    const hasPastLocal = past.length > 0;

    const renderList = (list) => {
      return list.map((consultation, index) => {
        const hasMoreThanOne = list.length > 1;

        return (
          <GridItem
            key={consultation.consultationId || index}
            md={8}
            lg={6}
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
              suggested={consultation.status === "suggested"}
              handleAcceptConsultation={acceptConsultation}
              handleRejectConsultation={rejectConsultation}
              sponsorImage={consultation.sponsorImage}
              withOrganization={!!consultation.organizationId}
              t={t}
              toast={toast}
              liquidGlass
              classes={
                hasMoreThanOne
                  ? "consultations__grid__consultations-item__grid__consultation__item"
                  : ""
              }
            />
          </GridItem>
        );
      });
    };

    // No consultations at all – show a centered schedule button if available
    if (!hasUpcomingLocal && !hasPastLocal) {
      return (
        <div className="consultations__empty">
          {onScheduleConsultationClick && (
            <NewButton
              label={t("schedule_button_label")}
              onClick={onScheduleConsultationClick}
              iconName="calendar"
              size="lg"
            />
          )}
        </div>
      );
    }

    const sections = [];

    if (hasUpcomingLocal) {
      sections.push(
        <div
          className="consultations__section consultations__section--upcoming"
          key="upcoming-section"
        >
          <div className="consultations__heading">
            <div className="consultations__heading-main">
              <h3 className="consultations__heading-title">
                {t("upcoming_tab_label")}
              </h3>
            </div>
            {onScheduleConsultationClick && (
              <NewButton
                label={t("schedule_button_label")}
                onClick={onScheduleConsultationClick}
                iconName="calendar"
                size="lg"
                classes="consultations__heading-button--inline"
              />
            )}
          </div>
          <Grid
            md={8}
            lg={12}
            classes="consultations__grid__consultations-item__grid"
          >
            {renderList(upcoming)}
          </Grid>
        </div>
      );
    }

    if (hasPastLocal) {
      sections.push(
        <div
          className="consultations__section consultations__section--past"
          key="past-section"
        >
          <div className="consultations__heading">
            <div className="consultations__heading-main">
              <h3 className="consultations__heading-title">
                {t("past_tab_label")}
              </h3>
            </div>
            {!hasUpcomingLocal && onScheduleConsultationClick && (
              <NewButton
                label={t("schedule_button_label")}
                onClick={onScheduleConsultationClick}
                iconName="calendar"
                size="lg"
                classes="consultations__heading-button--inline"
              />
            )}
          </div>
          <Grid
            md={8}
            lg={12}
            classes="consultations__grid__consultations-item__grid"
          >
            {renderList(past)}
          </Grid>
        </div>
      );
    }

    return sections;
  }, [
    acceptConsultation,
    consultationsQuery.data,
    consultationsQuery.isLoading,
    daysOfWeekTranslations,
    onScheduleConsultationClick,
    openJoinConsultation,
    rejectConsultation,
    t,
  ]);

  return (
    <Block classes="consultations">
      <Grid md={8} lg={12} classes="consultations__grid">
        <GridItem
          md={8}
          lg={12}
          classes="consultations__grid__consultations-item"
        >
          <Box classes="consultations__box" liquidGlass>
            {consultationsQuery.isLoading
              ? renderLoadingSkeletonState()
              : renderAllConsultations()}
          </Box>
        </GridItem>
      </Grid>
    </Block>
  );
};
