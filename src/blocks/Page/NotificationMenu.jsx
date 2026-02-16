import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation, Trans } from "react-i18next";
import { toast } from "react-toastify";

import {
  Notification,
  Loading,
  NewButton,
  Tabs,
} from "@USupport-components-library/src";
import {
  notificationsSvc,
  providerSvc,
  userSvc,
} from "@USupport-components-library/services";
import {
  getDateView,
  getTimeAsString,
  ONE_HOUR,
} from "@USupport-components-library/utils";
import {
  useCustomNavigate as useNavigate,
  useIsLoggedIn,
  useMarkNotificationsAsRead,
  useMarkAllNotificationsAsRead,
} from "#hooks";

export const NotificationMenu = ({ closePanel }) => {
  const [tabs] = useState(["all", "new", "read"]);
  const [selectedTab, setSelectedTab] = useState("all");

  const navigateTo = useNavigate();
  const { t } = useTranslation("blocks", { keyPrefix: "page" });
  const isLoggedIn = useIsLoggedIn();
  const isTmpUser = userSvc.getUserID() === "tmp-user";

  const [notificationProviders, setNotificationProviders] = useState({});
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  const getProviderNameForNotification = async (providerId) => {
    if (Object.keys(notificationProviders).includes(providerId)) {
      return notificationProviders[providerId];
    }
    if (!providerId) return null;
    return providerSvc.getProviderById(providerId);
  };

  const fetchProvidersData = async (data) => {
    const copy = { ...notificationProviders };
    const fetched = [];
    for (let i = 0; i < data.length; i++) {
      const nd = data[i];
      if (fetched.includes(nd.providerId)) continue;
      const response = await getProviderNameForNotification(nd.providerId);
      if (!response || !response.data) continue;
      const pd = response.data;
      copy[nd.providerId] = `${pd.name} ${pd.patronym || ""} ${pd.surname}`;
      fetched.push(nd.providerId);
    }
    setNotificationProviders(copy);
    setIsLoadingProviders(false);
  };

  const getNotifications = async ({ pageParam }) => {
    const { data } = await notificationsSvc.getNotifications(
      pageParam,
      selectedTab,
    );
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
    ["notifications", selectedTab],
    getNotifications,
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return undefined;
        return pages.length + 1;
      },
      onSuccess: (data) => {
        fetchProvidersData(
          data.pages.flat().map((x) => ({
            providerId: x.content.providerDetailId,
            notificationId: x.notificationId,
          })),
        );
      },
      enabled: isLoggedIn === true && !isTmpUser,
    },
  );

  const onMarkAllAsReadSuccess = () => {
    window.dispatchEvent(new Event("all-notifications-read"));
  };
  const onMarkAllAsReadError = (error) => toast(error, { type: "error" });
  const markNotificationAsReadByIdMutation =
    useMarkNotificationsAsRead(onMarkAllAsReadError);
  const markAllAsReadMutation = useMarkAllNotificationsAsRead(
    onMarkAllAsReadSuccess,
    onMarkAllAsReadError,
  );

  const renderNotificationItem = (notification) => {
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
    const handleClick = (notificationId, redirectTo = "/consultations") => {
      markNotificationAsReadByIdMutation.mutate([notificationId]);
      if (redirectTo !== null) {
        navigateTo(redirectTo);
      }
    };
    const providerName =
      notificationProviders[notification.content.providerDetailId];
    const typeData = {
      date,
      startHour,
      endHour,
      providerName,
      newDate,
      newStartHour,
      newEndHour,
      minutes: notification.content?.minToConsultation,
    };
    return (
      <Notification
        t={t}
        date={notification.createdAt}
        isRead={notification.isRead}
        title="uSupport"
        text={
          <Trans components={[<b></b>]}>
            {t(`notifications_${notification.type}`, typeData)}
          </Trans>
        }
        handleClick={() => handleClick(notification.notificationId)}
      />
    );
  };

  return (
    <div className="nav__notifications-dropdown__inner">
      <div className="nav__notifications-dropdown__header">
        <h4>{t("notifications_heading")}</h4>
        <div className="nav__notifications-dropdown__header__subheading-container">
          <Tabs
            options={tabs.map((tab) => ({
              label: t(tab),
              value: tab,
              isSelected: selectedTab === tab,
            }))}
            handleSelect={(index) => setSelectedTab(tabs[index])}
            classes="nav__notifications-dropdown__header__subheading-container__tabs"
          />
          <NewButton
            onClick={() => markAllAsReadMutation.mutate()}
            classes="nav__notifications-dropdown__header__subheading-container__mark-read"
            size="sm"
            type="text"
          >
            {t("notifications_mark_read")}
          </NewButton>
        </div>
      </div>
      <div className="nav__notifications-dropdown__list">
        {isLoadingProviders ? (
          <Loading size="lg" />
        ) : notificationsQuery.isLoading ? (
          <Loading size="lg" />
        ) : notificationsQuery.data?.pages.flat().length === 0 ? (
          <p className="nav__notifications-dropdown__empty">
            {t("notifications_empty")}
          </p>
        ) : (
          notificationsQuery.data?.pages.map((notifications, key) => (
            <React.Fragment key={key}>
              {notifications?.map((notification) => {
                const item = renderNotificationItem(notification);
                return item ? (
                  <div
                    key={notification.notificationId}
                    onClick={() => closePanel && closePanel()}
                  >
                    {item}
                  </div>
                ) : null;
              })}
            </React.Fragment>
          ))
        )}
        {notificationsQuery.hasNextPage && (
          <NewButton
            type="text"
            label={t("notifications_load_more")}
            onClick={() => notificationsQuery.fetchNextPage()}
            size="sm"
          />
        )}
      </div>
    </div>
  );
};
