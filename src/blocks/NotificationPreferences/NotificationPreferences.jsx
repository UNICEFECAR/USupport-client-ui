import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import {
  Block,
  Grid,
  GridItem,
  DropdownWithLabel,
  Loading,
  Error as ErrorComponent,
  RadioButton,
} from "@USupport-components-library/src";
import {
  useGetNotificationPreferences,
  useUpdateNotificationPreferences,
  useError,
} from "#hooks";

import { mascotCalmBlue } from "@USupport-components-library/assets";

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
  const { t } = useTranslation("blocks", {
    keyPrefix: "notification-preferences",
  });

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
  const IS_RO = localStorage.getItem("country") === "RO";

  const onUpdateError = (error) => {
    const { message: errorMessage } = useError(error);
    setError(errorMessage);
  };
  const onSuccess = () => {
    toast(t("success"));
  };
  const notificationsPreferencesMutation = useUpdateNotificationPreferences(
    onSuccess,
    onUpdateError,
  );

  const handleChange = (field, value) => {
    const dataCopy = { ...data };
    dataCopy[field] = value;
    notificationsPreferencesMutation.mutate(dataCopy);
  };

  return (
    <Block classes="notification-preferences">
      <div className="notification-preferences__content-wrapper">
        <div className="notification-preferences__content-wrapper__left">
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
                  <RadioButton
                    label={t("email")}
                    isChecked={data?.email}
                    setIsChecked={(value) => handleChange("email", value)}
                  />
                </GridItem>
              )}
              {!IS_RO && (
                <GridItem
                  xs={4}
                  md={8}
                  lg={12}
                  classes="notification-preferences__grid__item"
                >
                  <RadioButton
                    label={t("appointment")}
                    isChecked={data?.consultationReminder}
                    setIsChecked={(value) =>
                      handleChange("consultationReminder", value)
                    }
                  />
                  {data?.consultationReminder && (
                    <GridItem
                      xs={4}
                      md={8}
                      lg={12}
                      classes="notification-preferences__grid__item"
                    >
                      <DropdownWithLabel
                        selected={data.consultationReminderMin}
                        setSelected={(value) =>
                          handleChange("consultationReminderMin", value)
                        }
                        options={consultationReminderOptions}
                        label={null}
                        classes="notification-preferences__grid__item__dropdown"
                      />
                    </GridItem>
                  )}
                  {error ? <ErrorComponent message={error} /> : null}
                </GridItem>
              )}
            </Grid>
          )}
        </div>
        <div className="notification-preferences__content-wrapper__right">
          <img src={mascotCalmBlue} alt="mascot" />
        </div>
      </div>
    </Block>
  );
};
