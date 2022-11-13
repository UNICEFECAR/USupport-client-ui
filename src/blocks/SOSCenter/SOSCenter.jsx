import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Block,
  Grid,
  GridItem,
  EmergencyCenter,
  Loading,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import { cmsSvc } from "@USupport-components-library/services";

import "./sos-center.scss";

/**
 * SOSCenter
 *
 * The SOSCenter block
 *
 * @return {jsx}
 */
export const SOSCenter = () => {
  const { i18n, t } = useTranslation("sos-center");

  const getSOSCenters = async () => {
    // Request SOS Centers ids from the master DB based for website platform
    const sosCentersIds = await adminSvc.getSOSCenters("client");
    const sosCenters = [];

    if (sosCentersIds.length > 0) {
      let { data } = await cmsSvc.getSOSCenters("all", true, sosCentersIds);

      data = getFilteredData(data, i18n.language);

      data.forEach((sosCenter) => {
        sosCenters.push({
          title: sosCenter.attributes.title,
          text: sosCenter.attributes.text,
          phone: sosCenter.attributes.phone,
          email: sosCenter.attributes.email,
        });
      });
    }

    return sosCenters;
  };

  const {
    data: SOSCentersData,
    isLoading: SOSCentersLoading,
    isFetched: isSOSCentersFetched,
  } = useQuery(["SOSCenters"], getSOSCenters);

  return (
    <Block classes="soscenter" animation="fade-right">
      {SOSCentersData && (
        <Grid classes="soscenter__grid">
          <GridItem xs={4} md={8} lg={12} classes="soscenter__text-item">
            <Grid classes="soscenter__secondary-grid" xs={4} md={8} lg={12}>
              {SOSCentersData.map((contact, index) => {
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
      )}
      {!SOSCentersData && SOSCentersLoading && <Loading />}
      {!SOSCentersData && !SOSCentersLoading && isSOSCentersFetched && (
        <h3 className="soscenter__no-results">{t("no_results")}</h3>
      )}
    </Block>
  );
};
