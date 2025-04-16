import React from "react";
import { useTranslation, Trans } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useCustomNavigate as useNavigate } from "#hooks";

import {
  Block,
  Button,
  Grid,
  GridItem,
  Loading,
  Notification,
} from "@USupport-components-library/src";

import {
  getDateView,
  getTimeAsString,
  ONE_HOUR,
  checkIsFiveMinutesBefore,
} from "@USupport-components-library/utils";

import {
  useAcceptConsultation,
  useRejectConsultation,
  useGetAllConsultations,
} from "#hooks";

import "./notifications.scss";

/**
 * Notifications
 *
 * Notifications block
 *
 * @return {jsx}
 */
export const Notifications = ({
  openJoinConsultation,
  isLoadingProviders,
  notificationsQuery,
  notificationProviders,
  markAllAsReadMutation,
  markNotificationAsReadByIdMutation,
  hasAgreedToDataProcessing,
  openRequireDataAgreement,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("notifications");

  const queryClient = useQueryClient();

  const consultationsData = queryClient.getQueryData(["all-consultations"]);
  let shouldFetchConsultations;

  if (!consultationsData) {
    shouldFetchConsultations = true;
  }

  const consultationsDataQuery = useGetAllConsultations(
    !!shouldFetchConsultations
  );

  // Accept consultation logic
  const onAcceptConsultationSuccess = () => {
    toast(t("accept_consultation_success"));
    window.dispatchEvent(new Event("new-notification"));
  };
  const onAcceptConsultationError = (error) => {
    toast(error, { type: "error" });
  };
  const acceptConsultationMutation = useAcceptConsultation(
    onAcceptConsultationSuccess,
    onAcceptConsultationError
  );

  const handleAcceptSuggestion = (
    consultationId,
    consultationPrice,
    notificationId
  ) => {
    if (!hasAgreedToDataProcessing) {
      openRequireDataAgreement();
    } else {
      markNotificationAsReadByIdMutation.mutate([notificationId]);
      acceptConsultationMutation.mutate({
        consultationId,
        price: consultationPrice,
      });
    }
  };

  // Reject consultation loggic
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
  const rejectConsultation = (consultationId, notificationId) => {
    rejectConsultationMutation.mutate(consultationId);
    markAllAsReadMutation.mutate([notificationId]);
  };

  // Mark all notificartions as read logic
  // Because of the load on scroll we mark as read
  // only the currently shown/fetched notifications

  const renderNotification = (notification) => {
    if (!notification.content) return null;
    let time, date, startHour, endHour;

    if (notification.content.time) {
      time = notification.content.time;
      date = getDateView(time);
      startHour = getTimeAsString(new Date(time));
      endHour = getTimeAsString(new Date(time + ONE_HOUR));
    }

    let newDate, newStartHour, newEndHour;
    if (notification.content.newConsultationTime) {
      const newTime = notification.content.newConsultationTime;
      newDate = getDateView(newTime);
      newStartHour = getTimeAsString(new Date(newTime));
      newEndHour = getTimeAsString(new Date(newTime + ONE_HOUR));
    }

    const handleNotificationClick = (
      notificationId,
      redirectTo = "/consultations",
      content
    ) => {
      markNotificationAsReadByIdMutation.mutate([notificationId]);
      if (redirectTo !== null) {
        navigate(redirectTo, {
          state: content,
        });
      }
    };

    switch (notification.type) {
      case "consultation_booking":
        const providerName =
          notificationProviders[notification.content.providerDetailId];
        return (
          <Notification
            t={t}
            date={notification.createdAt}
            isRead={notification.isRead}
            title="uSupport"
            text={
              <Trans components={[<b></b>]}>
                {t(notification.type, {
                  providerName,
                  date,
                  startHour,
                  endHour,
                })}
              </Trans>
            }
            handleClick={() =>
              handleNotificationClick(notification.notificationId)
            }
          />
        );
      case "consultation_reschedule":
        return (
          <Notification
            t={t}
            date={notification.createdAt}
            isRead={notification.isRead}
            title="uSupport"
            text={
              <Trans components={[<b></b>]}>
                {t(notification.type, {
                  providerName:
                    notificationProviders[
                      notification.content.providerDetailId
                    ],
                  date,
                  startHour,
                  endHour,
                  newDate,
                  newStartHour,
                  newEndHour,
                })}
              </Trans>
            }
            handleClick={() =>
              handleNotificationClick(notification.notificationId)
            }
          />
        );
      case "consultation_cancellation":
        return (
          <Notification
            t={t}
            date={notification.createdAt}
            isRead={notification.isRead}
            title="uSupport"
            text={
              <Trans components={[<b></b>]}>
                {t(notification.type, {
                  providerName:
                    notificationProviders[
                      notification.content.providerDetailId
                    ],
                  date,
                  startHour,
                  endHour,
                })}
              </Trans>
            }
            handleClick={() =>
              handleNotificationClick(notification.notificationId)
            }
          />
        );
      case "consultation_cancellation_provider":
        return (
          <Notification
            t={t}
            date={notification.createdAt}
            isRead={notification.isRead}
            title="uSupport"
            text={
              <Trans components={[<b></b>]}>
                {t(notification.type, {
                  providerName:
                    notificationProviders[
                      notification.content.providerDetailId
                    ],
                  date,
                  startHour,
                  endHour,
                })}
              </Trans>
            }
            handleClick={() =>
              handleNotificationClick(notification.notificationId)
            }
          />
        );
      case "consultation_remind_start":
        return (
          <Notification
            t={t}
            date={notification.createdAt}
            isRead={notification.isRead}
            title="uSupport"
            text={
              <Trans components={[<b></b>]}>
                {t(notification.type, {
                  minutes: notification.content.minToConsultation,
                })}
              </Trans>
            }
            handleClick={() =>
              handleNotificationClick(notification.notificationId)
            }
          >
            {checkIsFiveMinutesBefore(notification.content.time) && (
              <Button
                classes="notifications__center-button"
                size="md"
                label={t("join")}
                color="purple"
                onClick={() => {
                  const data =
                    consultationsData?.length !== 0
                      ? consultationsData
                      : consultationsDataQuery?.data;
                  const consultationToJoin = data.find(
                    (x) =>
                      x.consultationId === notification.content.consultationId
                  );
                  openJoinConsultation(consultationToJoin);
                }}
              />
            )}
          </Notification>
        );
      case "consultation_suggestion":
        return (
          <Notification
            t={t}
            date={notification.createdAt}
            isRead={notification.isRead}
            title="uSupport"
            text={
              <Trans components={[<b></b>]}>
                {t(notification.type, {
                  providerName:
                    notificationProviders[
                      notification.content.providerDetailId
                    ],
                  date,
                  startHour,
                  endHour,
                })}
              </Trans>
            }
          >
            {!notification.isRead ? (
              <div className="notifications__suggested-consultation">
                <Button
                  onClick={() =>
                    handleAcceptSuggestion(
                      notification.content.consultationId,
                      notification.content.consultationPrice,
                      notification.notificationId
                    )
                  }
                  size="md"
                  label={t("accept")}
                  color="purple"
                />
                <Button
                  onClick={() =>
                    rejectConsultation(
                      notification.content.consultationId,
                      notification.notificationId
                    )
                  }
                  size="md"
                  label={t("reject")}
                  type="ghost"
                  color="green"
                />
              </div>
            ) : null}
          </Notification>
        );
      case "consultation_suggestion_booking":
        return (
          <Notification
            t={t}
            date={notification.createdAt}
            isRead={notification.isRead}
            title="uSupport"
            text={
              <Trans components={[<b></b>]}>
                {t(notification.type, {
                  providerName:
                    notificationProviders[
                      notification.content.providerDetailId
                    ],
                  date,
                  startHour,
                  endHour,
                })}
              </Trans>
            }
            handleClick={() =>
              handleNotificationClick(notification.notificationId)
            }
          />
        );
      case "consultation_suggestion_cancellation":
        return (
          <Notification
            t={t}
            date={notification.createdAt}
            isRead={notification.isRead}
            title="uSupport"
            text={
              <Trans components={[<b></b>]}>
                {t(notification.type, {
                  providerName:
                    notificationProviders[
                      notification.content.providerDetailId
                    ],
                  date,
                  startHour,
                  endHour,
                })}
                handleClick=
                {() => handleNotificationClick(notification.notificationId)}
              </Trans>
            }
          />
        );
      case "consultation_started":
        const canJoin = checkIsFiveMinutesBefore(notification.content.time);
        return (
          <Notification
            t={t}
            date={notification.createdAt}
            isRead={notification.isRead}
            title="uSupport"
            text={
              <Trans components={[<b></b>]}>
                {t(notification.type, {
                  providerName:
                    notificationProviders[
                      notification.content.providerDetailId
                    ],
                })}
              </Trans>
            }
            handleClick={() =>
              handleNotificationClick(
                notification.notificationId,
                canJoin ? null : "/consultations"
              )
            }
          >
            {canJoin && (
              <Button
                classes="notifications__center-button"
                size="md"
                label={t("join")}
                color="purple"
                onClick={() => {
                  const data =
                    consultationsData?.length !== 0
                      ? consultationsData
                      : consultationsDataQuery?.data;
                  const consultationToJoin = data.find(
                    (x) =>
                      x.consultationId === notification.content.consultationId
                  );
                  openJoinConsultation(consultationToJoin);
                }}
              />
            )}
          </Notification>
        );
      case "question_answered":
        return (
          <Notification
            t={t}
            date={notification.createdAt}
            isRead={notification.isRead}
            title="uSupport"
            handleClick={() =>
              handleNotificationClick(
                notification.notificationId,
                "/my-qa",
                notification.content
              )
            }
            text={
              <Trans components={[<b></b>]}>
                {t(notification.type, {
                  providerName: notification.content.providerName,
                })}
              </Trans>
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Block classes="notifications">
      {isLoadingProviders ? (
        <Loading size="lg" />
      ) : (
        <InfiniteScroll
          dataLength={notificationsQuery.data?.pages.length || 0}
          hasMore={notificationsQuery.hasNextPage}
          loader={<Loading />}
          next={() => notificationsQuery.fetchNextPage()}
          initialScrollY={20}
          scrollThreshold={0}
        >
          <Grid classes="notifications__grid">
            {notificationsQuery.isLoading ? (
              <GridItem md={8} lg={12}>
                <Loading size="lg" />
              </GridItem>
            ) : null}

            {!notificationsQuery.isLoading &&
            notificationsQuery.data.pages.flat().length === 0 ? (
              <GridItem
                md={8}
                lg={12}
                classes="notifications__grid__no-notifications"
              >
                <h3>{t("no_notifications")}</h3>
              </GridItem>
            ) : null}

            {notificationsQuery.data?.pages.map((notifications, key) => {
              return (
                <React.Fragment key={key}>
                  {notifications?.map((notification) => {
                    const notificationToDisplay =
                      renderNotification(notification);
                    return notificationToDisplay ? (
                      <GridItem
                        key={notification.notificationId}
                        md={8}
                        lg={12}
                      >
                        {notificationToDisplay}
                      </GridItem>
                    ) : null;
                  })}
                </React.Fragment>
              );
            })}
          </Grid>
        </InfiniteScroll>
      )}
    </Block>
  );
};
