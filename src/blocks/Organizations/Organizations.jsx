import React from "react";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";

import {
  Dropdown,
  Block,
  Input,
  InteractiveMap,
  Grid,
  GridItem,
  Loading,
  Button,
  OrganizationOverview,
} from "@USupport-components-library/src";
import { useGetOrganizationMetadata, useGetAllOrganizations } from "#hooks";

import "./organizations.scss";

const INITIAL_FILTERS = {
  search: "",
  workWith: "",
  district: "",
  paymentMethod: "",
  specialisation: "",
};

/**
 * Organizations
 *
 * Organizations block
 *
 * @return {jsx}
 */
export const Organizations = () => {
  const { t } = useTranslation("organizations");
  const navigate = useNavigate();
  const [mapControls, setMapControls] = React.useState(null);

  const [filters, setFilters] = React.useState(INITIAL_FILTERS);

  const { data, isLoading } = useGetAllOrganizations({
    search: filters.search,
    workWith: filters.workWith,
    district: filters.district,
    paymentMethod: filters.paymentMethod,
    specialisation: filters.specialisation,
  });

  const { data: metadata, isLoading: isMetadataLoading } =
    useGetOrganizationMetadata();

  const handleChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const handleOrganizationClick = (organization) => {
    if (
      mapControls &&
      organization.location.latitude &&
      organization.location.longitude
    ) {
      if (
        mapControls.zoomToLocation &&
        organization.location.longitude &&
        organization.location.latitude
      ) {
        mapControls.zoomToLocation(
          organization.location.latitude,
          organization.location.longitude,
          14 // Zoom level for organization location
        );
      }

      if (mapControls.selectProvider) {
        mapControls.selectProvider(organization);
      }
    } else {
      navigate(`/organization-overview/${organization.organizationId}`);
    }
  };

  const handleMapReady = (controls) => {
    setMapControls(controls);
  };

  const renderOrganizations = () => {
    if (!data || data.length === 0) {
      return (
        <GridItem md={8} lg={12}>
          <h4>{t("no_data_found")}</h4>
        </GridItem>
      );
    }

    return data.map((organization) => {
      return (
        <GridItem key={organization.organizationId}>
          <OrganizationOverview
            name={organization.name}
            unitName={organization.unitName}
            image={organization.image}
            paymentMethod={organization.paymentMethod}
            specialisations={organization.specialisations}
            address={organization.address}
            onClick={() => handleOrganizationClick(organization)}
            t={t}
          />
        </GridItem>
      );
    });
  };

  const renderFilters = () => {
    if (isMetadataLoading) {
      return <Loading />;
    }

    return (
      <div className="organizations__dropdowns-container">
        {metadata?.workWith && metadata.workWith.length > 0 && (
          <Dropdown
            selected={filters.workWith}
            setSelected={(value) => handleChange("workWith", value)}
            placeholder={t("work_with_placeholder")}
            options={metadata.workWith.map((item) => ({
              label: t(item.topic),
              value: item.organizationWorkWithId,
            }))}
            isSmall
          />
        )}

        {metadata?.districts && metadata.districts.length > 0 && (
          <Dropdown
            selected={filters.district}
            setSelected={(value) => handleChange("district", value)}
            placeholder={t("district_placeholder")}
            options={metadata.districts.map((district) => ({
              label: t(district.name),
              value: district.districtId,
            }))}
            isSmall
          />
        )}

        {metadata?.paymentMethods && metadata.paymentMethods.length > 0 && (
          <Dropdown
            selected={filters.paymentMethod}
            setSelected={(value) => handleChange("paymentMethod", value)}
            placeholder={t("payment_method_placeholder")}
            options={metadata.paymentMethods.map((method) => ({
              label: t(method.name),
              value: method.paymentMethodId,
            }))}
            isSmall
          />
        )}

        {metadata?.specialisations && metadata.specialisations.length > 0 && (
          <Dropdown
            selected={filters.specialisation}
            setSelected={(value) => handleChange("specialisation", value)}
            placeholder={t("specialisation_placeholder")}
            options={metadata.specialisations.map((spec) => ({
              label: t(spec.name),
              value: spec.organizationSpecialisationId,
            }))}
            isSmall
          />
        )}
      </div>
    );
  };

  return (
    <Block classes="organizations">
      <div className="organizations__search-container">
        <Input
          placeholder={t("search_placeholder")}
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          classes="organizations__search-container__input"
        />
        <Button
          onClick={() => setFilters(INITIAL_FILTERS)}
          size="sm"
          classes="organizations__search-container__reset-filters-btn"
        >
          {t("reset_filters")}
        </Button>
      </div>
      {renderFilters()}
      <Button
        onClick={() => setFilters(INITIAL_FILTERS)}
        size="sm"
        classes="organizations__reset-filters-btn"
      >
        {t("reset_filters")}
      </Button>
      <InteractiveMap
        data={data}
        onMapReady={handleMapReady}
        t={t}
        navigate={navigate}
      />
      <Grid md={8} lg={12} classes="organizations__grid">
        {isLoading ? <Loading /> : renderOrganizations()}
      </Grid>
    </Block>
  );
};
