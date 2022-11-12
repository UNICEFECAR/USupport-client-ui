import React, { useState } from "react";
import {
  Block,
  Grid,
  GridItem,
  Toggle,
  RadioButtonSelectorGroup,
  Loading,
  Error as ErrorComponent,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import {
  useGetNotificationPreferences,
  useUpdateNotificationPreferences,
  useError,
} from "@USupport-components-library/hooks";

import "./notification-preferences.scss";

/**
 * NotificationPreferences
 *
 * Notification preferences block
 *
 * @return {jsx}
 */
export const NotificationPreferences = () => {
  const { t } = useTranslation("notification-preferences");

  const minutes = [15, 30, 45, 60];
  const consultationReminderOptions = minutes.map((x) => ({
    label: `${x} ${t("minutes_before")}`,
    value: x,
  }));

  const [error, setError] = useState();
  const [notificationPreferencesQuery, setNotificationPreferences] =
    useGetNotificationPreferences();
  const data = notificationPreferencesQuery.data;

  const onUpdateError = (error) => {
    const { message: errorMessage } = useError(error);
    setError(errorMessage);
    setNotificationPreferences();
  };
  const notificationsPreferencesMutation = useUpdateNotificationPreferences(
    () => {},
    onUpdateError
  );

  const handleChange = (field, value) => {
    const dataCopy = { ...data };
    dataCopy[field] = value;
    setNotificationPreferences(dataCopy);
    notificationsPreferencesMutation.mutate(dataCopy);
  };

  return (
    <Block classes="notification-preferences">
      {notificationPreferencesQuery.isLoading &&
      !notificationPreferencesQuery.data ? (
        <Loading size="lg" />
      ) : (
        <Grid classes="notification-preferences__grid">
          <GridItem
            xs={4}
            md={8}
            lg={12}
            classes="notification-preferences__grid__item"
          >
            <p className="paragraph">{t("email")}</p>
            <Toggle
              isToggled={data?.email}
              setParentState={(value) => handleChange("email", value)}
            />
          </GridItem>
          <GridItem
            xs={4}
            md={8}
            lg={12}
            classes="notification-preferences__grid__item"
          >
            <p className="paragraph">{t("appointment")}</p>
            <Toggle
              isToggled={
                data?.consultation_reminder
                  ? data?.consultation_reminder
                  : false
              }
              setParentState={(value) =>
                handleChange("consultation_reminder", value)
              }
            />
            {data?.consultation_reminder && (
              <RadioButtonSelectorGroup
                selected={data.consultation_reminder_min}
                setSelected={(value) =>
                  handleChange("consultation_reminder_min", value)
                }
                options={consultationReminderOptions}
              />
            )}
            {error ? <ErrorComponent message={error} /> : null}
          </GridItem>
        </Grid>
      )}
    </Block>
  );
};
