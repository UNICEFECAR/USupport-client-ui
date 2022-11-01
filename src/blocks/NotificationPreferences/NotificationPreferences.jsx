import React, { useState } from "react";
import {
  Block,
  Grid,
  GridItem,
  Toggle,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./notification-preferences.scss";

/**
 * NotificationPreferences
 *
 * Notification preferences block
 *
 * @return {jsx}
 */
export const NotificationPreferences = () => {
  const [data, setData] = useState({
    email: false,
    appointment: false,
  });

  const handleChange = (field, value) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const { t } = useTranslation("notification-preferences");
  return (
    <Block classes="notification-preferences">
      <Grid classes="notification-preferences__grid">
        <GridItem
          xs={4}
          md={8}
          lg={12}
          classes="notification-preferences__grid__item"
        >
          <p className="paragraph">{t("email")}</p>
          <Toggle
            isToggled={data.email}
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
            isToggled={data.appointment}
            setParentState={(value) => handleChange("appointment", value)}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
