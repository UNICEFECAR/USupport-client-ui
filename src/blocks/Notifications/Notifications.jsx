import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  Block,
  Button,
  Grid,
  GridItem,
  Icon,
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
  notificationsSvc,
  providerSvc,
} from "@USupport-components-library/services";

import {
  useMarkNotificationsAsRead,
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
export const Notifications = ({ openJoinConsultation }) => {
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

  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  const getNotifications = async ({ pageParam }) => {
    const { data } = await notificationsSvc.getNotifications(pageParam);
    return data.map((notification) => {
      const content = notification.content || {};
      return {
        notificationId: notification.notification_id,
        userId: notification.user_id,
        type: notification.type,
        isRead: notification.is_read,
        createdAt: new Date(notification.created_at),
        content: {
          ...content,
          time:
            typeof content.time === "string"
              ? new Date(content.time).getTime()
              : content.time * 1000,
          providerDetailId: content.provider_detail_id,
          consultationId: content.consultation_id,
          newConsultationTime: content.new_consultation_time * 1000,
        },
      };
    });
  };

  const [notificationProviders, setNotificationProviders] = useState({});
  const getProviderNameForNotification = async (providerId) => {
    // Check if we already have the provider name in the cache
    if (Object.keys(notificationProviders).includes(providerId)) {
      return notificationProviders[providerId];
    }
    if (!providerId) return null;
    return providerSvc.getProviderById(providerId);
  };

  const fetchProvidersData = async (data) => {
    const notificationProvidersCopy = { ...notificationProviders };
    const alreadyFetchedProviders = [];

    for (let i = 0; i < data.length; i++) {
      const notificationData = data[i];
      // Make sure we don't fetch the same provider twice
      if (alreadyFetchedProviders.includes(notificationData.providerId))
        continue;

      const response = await getProviderNameForNotification(
        notificationData.providerId
      );
      if (!response || !response.data) continue;

      // Construct the provider name
      const providerData = response.data;
      const providerName = `${providerData.name} ${
        providerData.patronym || "" + " "
      }${providerData.surname}`;

      alreadyFetchedProviders.push(notificationData.providerId);
      notificationProvidersCopy[notificationData.providerId] = providerName;
    }
    setNotificationProviders(notificationProvidersCopy);
    setIsLoadingProviders(false);
  };

  const notificationsQuery = useInfiniteQuery(
    ["notifications"],
    getNotifications,
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return undefined;
        return pages.length + 1;
      },
      onSuccess: (data) => {
        fetchProvidersData(
          data.pages.flat().map((x) => {
            return {
              providerId: x.content.providerDetailId,
              notificationId: x.notificationId,
            };
          })
        );
      },
    }
  );

  // Accept consultation logic
  const onAcceptConsultationSuccess = () => {
    toast(t("accept_consultation_success"));
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
    markAllAsReadMutation.mutate([notificationId]);
    acceptConsultationMutation.mutate({
      consultationId,
      price: consultationPrice,
    });
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
  const onMarkAllAsReadError = (error) => toast(error, { type: "error" });
  const markAllAsReadMutation =
    useMarkNotificationsAsRead(onMarkAllAsReadError);
  const handleMarkAllAsRead = async () => {
    const unreadNotificationsIds = notificationsQuery.data?.pages
      .flat()
      ?.filter((x) => !x.isRead)
      .map((x) => x.notificationId);
    markAllAsReadMutation.mutate(unreadNotificationsIds);
  };

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
      redirectTo = "/consultations"
    ) => {
      markAllAsReadMutation.mutate([notificationId]), navigate(redirectTo);
    };

    switch (notification.type) {
      case "consultation_booking":
        return (
          <Notification
            date={notification.createdAt}
            isRead={notification.isRead}
            title="USupport"
            text={t(notification.type, {
              providerName:
                notificationProviders[notification.content.providerDetailId],
              date,
              startHour,
              endHour,
            })}
            icon="calendar"
            handleClick={() =>
              handleNotificationClick(notification.notificationId)
            }
          />
        );
      case "consultation_reschedule":
        return (
          <Notification
            date={notification.createdAt}
            isRead={notification.isRead}
            title="USupport"
            text={t(notification.type, {
              providerName:
                notificationProviders[notification.content.providerDetailId],
              date,
              startHour,
              endHour,
              newDate,
              newStartHour,
              newEndHour,
            })}
            icon="calendar"
            handleClick={() =>
              handleNotificationClick(notification.notificationId)
            }
          />
        );
      case "consultation_cancellation":
        return (
          <Notification
            date={notification.createdAt}
            isRead={notification.isRead}
            title="USupport"
            text={t(notification.type, {
              providerName:
                notificationProviders[notification.content.providerDetailId],
              date,
              startHour,
              endHour,
            })}
            icon="calendar"
            handleClick={() =>
              handleNotificationClick(notification.notificationId)
            }
          />
        );
      case "consultation_cancellation_provider":
        return (
          <Notification
            date={notification.createdAt}
            isRead={notification.isRead}
            title="USupport"
            text={t(notification.type, {
              providerName:
                notificationProviders[notification.content.providerDetailId],
              date,
              startHour,
              endHour,
            })}
            icon="calendar"
            handleClick={() =>
              handleNotificationClick(notification.notificationId)
            }
          />
        );
      case "consultation_remind_start":
        return (
          <Notification
            date={notification.createdAt}
            isRead={notification.isRead}
            title="USupport"
            text={t(notification.type, {
              minutes: notification.content.minToConsultation,
            })}
            icon="calendar"
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
            date={notification.createdAt}
            isRead={notification.isRead}
            title="USupport"
            text={t(notification.type, {
              providerName:
                notificationProviders[notification.content.providerDetailId],
              date,
              startHour,
              endHour,
            })}
            icon="calendar"
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
            date={notification.createdAt}
            isRead={notification.isRead}
            title="USupport"
            text={t(notification.type, {
              providerName:
                notificationProviders[notification.content.providerDetailId],
              date,
              startHour,
              endHour,
            })}
            icon="calendar"
            handleClick={() =>
              handleNotificationClick(notification.notificationId)
            }
          />
        );
      case "consultation_suggestion_cancellation":
        return (
          <Notification
            date={notification.createdAt}
            isRead={notification.isRead}
            title="USupport"
            text={t(notification.type, {
              providerName:
                notificationProviders[notification.content.providerDetailId],
              date,
              startHour,
              endHour,
            })}
            icon="calendar"
            handleClick={() =>
              handleNotificationClick(notification.notificationId)
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Block classes="notifications">
      <div className="notifications__heading-container">
        <Icon name="arrow-chevron-back" size="md" color="#20809E" />
        <h3 className="notifications__heading-container__heading">
          {t("heading")}
        </h3>
        <p
          className="paragraph notifications__heading-container__mark-read"
          onClick={handleMarkAllAsRead}
        >
          {t("mark_read")}
        </p>
      </div>
      <p className="text notifications__subheading">{t("subheading")}</p>
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
                <React.Fragment>
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
