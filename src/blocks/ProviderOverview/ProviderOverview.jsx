import React from "react";
import {
  Block,
  Grid,
  GridItem,
  Avatar,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./provider-overview.scss";

/**
 * ProviderOverview
 *
 * ProviderOverview block
 *
 * @return {jsx}
 */
export const ProviderOverview = () => {
  const { t } = useTranslation("provider-overview");

  const specialist = {
    name: "Dr. Joanna Doe",
    specialities: "Psychiatrist, Neuropsychiatrist, Psychotherapist",
    experience: 16,
    earliestAvailable: "from 10:30 to 11:30 on 09.09.22",
    webSite: "www.drdoe.com",
    price: 50,
    languages: ["English", "German"],
    qualifications: ["Qualification 1", "Qualification 2"],
    startDate: "01.01.2005",
    education: ["Bechelor degree", "Masters degree"],
    psychotherapeuticApproach:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    workWith: ["Adults", "Children", "Teens"],
    consultationNum: 74,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius euismod.",
    usefulFor: ["Depression", "Anxiety", "Stress"],
  };

  const renderAllOptions = (option) => {
    return specialist[option].join(", ");
  };

  const renderAllOptionsAsList = (option) => {
    return specialist[option].map((item, index) => <li key={index}>{item}</li>);
  };

  return (
    <Block classes="provider-overview">
      <Grid md={8} lg={12} classes="provider-overview__grid">
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <div className="provider-overview__grid__item__content-container">
            <Avatar size="lg" />
            <div className="provider-overview__grid__item__content-container__details">
              <p className="text">{specialist.name}</p>
              <p className="small-text">{specialist.specialities}</p>
              <p className="small-text">
                {specialist.experience} {t("years_of_experience")}
              </p>
            </div>
          </div>
        </GridItem>
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <p className="text provider-overview__grid__item__heading">
            {t("earliest_free_spot")}
          </p>
          <p className="text">{specialist.earliestAvailable}</p>
        </GridItem>
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <p className="text provider-overview__grid__item__heading">
            {t("website")}
          </p>
          <p className="text">
            <a href={`http://${specialist.webSite}`}>{specialist.webSite}</a>
          </p>
        </GridItem>
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <p className="text provider-overview__grid__item__heading">
            {t("price_per_consultation")}
          </p>
          <p className="text">{specialist.price}$</p>
        </GridItem>
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <p className="text provider-overview__grid__item__heading">
            {t("language_of_operation")}
          </p>
          <p className="text">{renderAllOptions("languages")}</p>
        </GridItem>
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <p className="text provider-overview__grid__item__heading">
            {t("qualifications")}
          </p>
          <p className="text">{renderAllOptions("qualifications")}</p>
        </GridItem>
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <p className="text provider-overview__grid__item__heading">
            {t("specialist_from")}
          </p>
          <p className="text">{specialist.startDate}</p>
        </GridItem>
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <p className="text provider-overview__grid__item__heading">
            {t("education")}
          </p>
          <p className="text">{renderAllOptions("education")}</p>
        </GridItem>
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <p className="text provider-overview__grid__item__heading">
            {t("approach")}
          </p>
          <p className="text">{specialist.psychotherapeuticApproach}</p>
        </GridItem>
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <p className="text provider-overview__grid__item__heading">
            {t("work_with")}
          </p>
          <p className="text">{renderAllOptions("workWith")}</p>
        </GridItem>
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <p className="text provider-overview__grid__item__heading">
            {t("overall_consultations")}
          </p>
          <p className="text">{specialist.consultationNum} consultations</p>
        </GridItem>
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <p className="text provider-overview__grid__item__heading">
            {t("description")}
          </p>
          <p className="text">{specialist.description}</p>
        </GridItem>
        <GridItem md={8} lg={12} classes="provider-overview__grid__item">
          <p className="text provider-overview__grid__item__heading">
            {t("useful_for")}
          </p>
          <p className="text">{renderAllOptionsAsList("usefulFor")}</p>
        </GridItem>
      </Grid>
    </Block>
  );
};
