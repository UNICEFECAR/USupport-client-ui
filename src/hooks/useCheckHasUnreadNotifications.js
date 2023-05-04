import { useQuery } from "@tanstack/react-query";
import { notificationsSvc } from "@USupport-components-library/services";

export const useCheckHasUnreadNotifications = (enabled) => {
  const checkHasUnreadNotifications = async () => {
    if (!enabled) return false;
    const { data } = await notificationsSvc.checkHasUnreadNotifications();
    return data;
  };

  const checkHasUnreadNotificationsQuery = useQuery(
    ["has-unread-notifications"],
    checkHasUnreadNotifications,
    { enabled }
  );

  return checkHasUnreadNotificationsQuery;
};
