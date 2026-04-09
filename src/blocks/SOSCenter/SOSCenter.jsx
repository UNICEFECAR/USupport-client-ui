import React, { useState, useCallback, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  useEventListener,
  useAddSosCenterClick,
  useCustomNavigate as useNavigate,
} from "#hooks";

import {
  Block,
  Box,
  NewButton,
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

import { RootContext } from "#routes";

import "./sos-center.scss";

/**
 * SOSCenter
 *
 * The SOSCenter block
 *
 * @return {jsx}
 */
export const SOSCenter = ({ description }) => {
  const { i18n, t } = useTranslation("blocks", { keyPrefix: "sos-center" });
  const { loggedIn } = useContext(RootContext);
  const navigate = useNavigate();

  const IS_RO = localStorage.getItem("country") === "RO";

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country"),
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
    getSOSCenterIds,
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
    },
  );

  const emergencyServiceSpecialization = specializationsData?.find(
    (specialization) => specialization.name === "emergency_situations",
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
    },
  );

  const addSosCenterClickMutation = useAddSosCenterClick();

  const handleSosCenterClick = (sosCenter) => {
    const { attributes } = sosCenter;
    let id = sosCenter.id;
    if (attributes.locale !== "en") {
      const englishLocalization = attributes.localizations.data.find(
        (x) => x.attributes.locale === "en",
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
            <Box classes="soscenter__box" liquidGlass>
              {description && (
                <div className="soscenter__box-heading">
                  <p className="soscenter__box-heading-text text">
                    {description}
                  </p>
                </div>
              )}
              <Grid classes="soscenter__secondary-grid" xs={4} md={8} lg={12}>
                {IS_RO && emergencyServiceSpecialization && loggedIn && (
                  <GridItem
                    classes="soscenter__secondary-grid__item"
                    md={4}
                    lg={6}
                  >
                    <div className="soscenter__card soscenter__card--romania">
                      <div className="soscenter__card__content">
                        <div className="soscenter__card__text">
                          <p className="soscenter__card__title paragraph">
                            {t("other_emergency_services")}
                          </p>
                          <div className="soscenter__card__actions">
                            <NewButton
                              size="sm"
                              type="gradient"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/organizations?specialisations=[${emergencyServiceSpecialization.id}]`,
                                );
                              }}
                              label={t("browse")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </GridItem>
                )}
                {SOSCentersData.map((sosCenter, index) => {
                  const { title, text, url, phone, image } =
                    sosCenter.attributes;

                  return (
                    <GridItem
                      classes="soscenter__secondary-grid__item"
                      md={4}
                      lg={6}
                      key={index}
                    >
                      <div
                        className="soscenter__card"
                        onClick={() => handleSosCenterClick(sosCenter)}
                      >
                        <div className="soscenter__card__content">
                          {image?.data?.attributes?.formats?.medium?.url && (
                            <div className="soscenter__card__image">
                              <img
                                src={image.data.attributes.formats.medium.url}
                                alt={title}
                              />
                            </div>
                          )}

                          <div className="soscenter__card__text">
                            <p className="soscenter__card__title paragraph">
                              {title}
                            </p>

                            {text ? (
                              <p className="soscenter__card__description text">
                                {text}
                              </p>
                            ) : (
                              (phone || url) && (
                                <div className="soscenter__card__divider" />
                              )
                            )}

                            {(phone || url) && (
                              <div className="soscenter__card__actions">
                                {phone && (
                                  <NewButton
                                    size="sm"
                                    type="outline"
                                    label={t("button_call")}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(`tel:${phone}`, "_self");
                                    }}
                                  />
                                )}
                                {url && (
                                  <NewButton
                                    size="sm"
                                    type="gradient"
                                    label={t("button_link")}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(url, "_blank", "noopener");
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </GridItem>
                  );
                })}
              </Grid>
            </Box>
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
