import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Page, Notifications as NotificationsBlock } from "#blocks";
import { JoinConsultation } from "#backdrops";
import {
  useMarkNotificationsAsRead,
  useMarkAllNotificationsAsRead,
} from "#hooks";
import {
  notificationsSvc,
  providerSvc,
} from "@USupport-components-library/services";

import "./notifications.scss";

/**
 * Notifications
 *
 * Notifiations page
 *
 * @returns {JSX.Element}
 */
export const Notifications = () => {
  const { t } = useTranslation("notifications-page");

  const [notificationProviders, setNotificationProviders] = useState({});
  const [selectedConsultation, setSelectedConsultation] = useState();
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  const [isJoinConsultationOpen, setIsJoinConsultationOpen] = useState(false);
  const openJoinConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    setIsJoinConsultationOpen(true);
  };
  const closeJoinConsultation = () => setIsJoinConsultationOpen(false);

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

  const onMarkAllAsReadSuccess = () => {
    window.dispatchEvent(new Event("all-notifications-read"));
  };

  const onMarkAllAsReadError = (error) => toast(error, { type: "error" });
  const markNotificationAsReadByIdMutation =
    useMarkNotificationsAsRead(onMarkAllAsReadError);

  const handleMarkAllAsRead = async () => {
    markAllAsReadMutation.mutate();
  };

  const markAllAsReadMutation = useMarkAllNotificationsAsRead(
    onMarkAllAsReadSuccess,
    onMarkAllAsReadError
  );

  const headingButton = (
    <p className="page__notifications__mark-read" onClick={handleMarkAllAsRead}>
      {t("mark_read")}
    </p>
  );

  return (
    <Page
      classes="page__notifications"
      showGoBackArrow={false}
      heading={t("heading")}
      headingButton={headingButton}
      subheading={t("subheading")}
      showHeadingButtonInline={true}
    >
      <NotificationsBlock
        openJoinConsultation={openJoinConsultation}
        isLoadingProviders={isLoadingProviders}
        notificationsQuery={notificationsQuery}
        notificationProviders={notificationProviders}
        markNotificationAsReadByIdMutation={markNotificationAsReadByIdMutation}
        markAllAsReadMutation={markAllAsReadMutation}
      />
      <JoinConsultation
        isOpen={isJoinConsultationOpen}
        onClose={closeJoinConsultation}
        consultation={selectedConsultation}
      />
    </Page>
  );
};
