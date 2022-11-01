import React from "react";
import {
  Block,
  Grid,
  GridItem,
  EmergencyCenter,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./sos-center.scss";

/**
 * SOSCenter
 *
 * The SOSCenter block
 *
 * @return {jsx}
 */
export const SOSCenter = ({ contacts }) => {
  const { t } = useTranslation("sos-center");
  return (
    <Block classes="soscenter" animation="fade-right">
      <Grid classes="soscenter__grid">
        <GridItem xs={4} md={8} lg={12} classes="soscenter__text-item">
          <Grid classes="soscenter__secondary-grid" xs={4} md={8} lg={12}>
            {contacts.map((contact, index) => {
              return (
                <GridItem
                  classes="soscenter__secondary-grid__item"
                  md={4}
                  lg={12}
                  key={index}
                >
                  <EmergencyCenter
                    title={contact.title}
                    text={contact.text}
                    link={contact.link}
                    phone={contact.phone}
                    btnLabel={t("button")}
                  />
                </GridItem>
              );
            })}
          </Grid>
        </GridItem>
      </Grid>
    </Block>
  );
};
