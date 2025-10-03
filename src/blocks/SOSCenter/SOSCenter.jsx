import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  useEventListener,
  useAddSosCenterClick,
  useCustomNavigate as useNavigate,
} from "#hooks";

import {
  Block,
  Grid,
  GridItem,
  EmergencyCenter,
  Loading,
} from "@USupport-components-library/src";
import {
  cmsSvc,
  adminSvc,
  clientSvc,
} from "@USupport-components-library/services";

import "./sos-center.scss";

/**
 * SOSCenter
 *
 * The SOSCenter block
 *
 * @return {jsx}
 */
export const SOSCenter = () => {
  const { i18n, t } = useTranslation("blocks", { keyPrefix: "sos-center" });
  const navigate = useNavigate();

  const IS_RO = localStorage.getItem("country") === "RO";

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

  const handler = useCallback(() => {
    setCurrentCountry(localStorage.getItem("country"));
  }, []);

  // Add event listener
  useEventListener("countryChanged", handler);

  //--------------------- SOS Centers ----------------------//

  const getSOSCenterIds = async () => {
    // Request faq ids from the master DB based for website platform
    const sosCenterIds = await adminSvc.getSOSCenters();

    return sosCenterIds;
  };

  const sosCenterIdsQuerry = useQuery(
    ["sosCenterIds", currentCountry],
    getSOSCenterIds
  );

  const getOrganizationSpecializations = async () => {
    const { data } = await clientSvc.getOrganizationSpecializations();
    return data;
  };

  const { data: specializationsData } = useQuery(
    ["organizationSpecializations", currentCountry],
    getOrganizationSpecializations,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const emergencyServiceSpecialization = specializationsData?.find(
    (specialization) => specialization.name === "emergency_situations"
  );

  const getSOSCenters = async () => {
    let { data } = await cmsSvc.getSOSCenters({
      locale: i18n.language,
      ids: sosCenterIdsQuerry.data,
      populate: true,
    });

    const sosCenters = data.data;

    return sosCenters;
  };

  const {
    data: SOSCentersData,
    isLoading: SOSCentersLoading,
    isFetched: isSOSCentersFetched,
  } = useQuery(
    ["SOSCenters", sosCenterIdsQuerry.data, i18n.language],
    getSOSCenters,
    {
      enabled:
        !sosCenterIdsQuerry.isLoading && sosCenterIdsQuerry.data?.length > 0,
    }
  );

  const addSosCenterClickMutation = useAddSosCenterClick();

  const handleSosCenterClick = (sosCenter) => {
    const { attributes } = sosCenter;
    let id = sosCenter.id;
    if (attributes.locale !== "en") {
      const englishLocalization = attributes.localizations.data.find(
        (x) => x.attributes.locale === "en"
      );
      if (englishLocalization) {
        id = englishLocalization.id;
      }
    }

    addSosCenterClickMutation.mutate({
      sosCenterId: id,
      isMain: false,
      platform: "client",
    });
  };

  return (
    <Block classes="soscenter" animation="fade-right">
      {SOSCentersData && (
        <Grid classes="soscenter__grid">
          <GridItem xs={4} md={8} lg={12} classes="soscenter__text-item">
            <Grid classes="soscenter__secondary-grid" xs={4} md={8} lg={12}>
              {IS_RO && emergencyServiceSpecialization && (
                <GridItem
                  classes="soscenter__secondary-grid__item"
                  md={4}
                  lg={12}
                >
                  <EmergencyCenter
                    title={t("other_emergency_services")}
                    text={emergencyServiceSpecialization.description}
                    showCustomButton
                    btnLabelCustom={t("browse")}
                    onClick={() =>
                      navigate(
                        `/organizations?specialisations=[${emergencyServiceSpecialization.id}]`
                      )
                    }
                  />
                </GridItem>
              )}
              {SOSCentersData.map((sosCenter, index) => {
                return (
                  <GridItem
                    classes="soscenter__secondary-grid__item"
                    md={4}
                    lg={12}
                    key={index}
                  >
                    <EmergencyCenter
                      title={sosCenter.attributes.title}
                      text={sosCenter.attributes.text}
                      link={sosCenter.attributes.url}
                      phone={sosCenter.attributes.phone}
                      btnLabelLink={t("button_link")}
                      btnLabelCall={t("button_call")}
                      onClick={() => handleSosCenterClick(sosCenter)}
                      image={
                        sosCenter.attributes.image?.data?.attributes?.formats
                          ?.medium?.url
                      }
                    />
                  </GridItem>
                );
              })}
            </Grid>
          </GridItem>
        </Grid>
      )}
      {sosCenterIdsQuerry.data?.length > 0 &&
        !SOSCentersData &&
        SOSCentersLoading && <Loading />}
      {!SOSCentersData?.length && !SOSCentersLoading && isSOSCentersFetched && (
        <h4 className="soscenter__no-results">{t("no_results")}</h4>
      )}
    </Block>
  );
};
