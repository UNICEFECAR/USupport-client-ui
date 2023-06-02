import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import {
  Block,
  Grid,
  GridItem,
  Toggle,
  RadioButtonSelectorGroup,
  Loading,
  Error as ErrorComponent,
} from "@USupport-components-library/src";
import {
  useGetNotificationPreferences,
  useUpdateNotificationPreferences,
  useError,
} from "#hooks";

import "./notification-preferences.scss";

import { useGetClientData } from "#hooks";

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
  const [notificationPreferencesQuery] = useGetNotificationPreferences();
  const data = notificationPreferencesQuery.data;

  const clientDataQuery = useGetClientData()[0];
  const isAnon = !clientDataQuery.data?.email;

  const onUpdateError = (error) => {
    const { message: errorMessage } = useError(error);
    setError(errorMessage);
  };
  const onSuccess = () => {
    toast(t("success"));
  };
  const notificationsPreferencesMutation = useUpdateNotificationPreferences(
    onSuccess,
    onUpdateError
  );

  const handleChange = (field, value) => {
    const dataCopy = { ...data };
    dataCopy[field] = value;
    notificationsPreferencesMutation.mutate(dataCopy);
  };

  return (
    <Block classes="notification-preferences">
      {notificationPreferencesQuery.isLoading &&
      clientDataQuery.isLoading &&
      !notificationPreferencesQuery.data ? (
        <Loading size="lg" />
      ) : (
        <Grid classes="notification-preferences__grid">
          {isAnon ? null : (
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
          )}
          <GridItem
            xs={4}
            md={8}
            lg={12}
            classes="notification-preferences__grid__item"
          >
            <p className="paragraph">{t("appointment")}</p>
            <Toggle
              isToggled={
                data?.consultationReminder ? data?.consultationReminder : false
              }
              setParentState={(value) =>
                handleChange("consultationReminder", value)
              }
            />
            {data?.consultationReminder && (
              <RadioButtonSelectorGroup
                selected={data.consultationReminderMin}
                setSelected={(value) =>
                  handleChange("consultationReminderMin", value)
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
