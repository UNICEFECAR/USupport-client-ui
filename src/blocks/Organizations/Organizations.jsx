import React, { useState, useRef, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  useCustomNavigate as useNavigate,
  useGetOrganizationMetadata,
  useGetAllOrganizations,
  useDebounce,
  useGetLatestBaselineAssessment,
  useGetClientData,
  useCreateBaselineAssessment,
  useGetOrganizationKey,
} from "#hooks";

import { RootContext } from "#routes";

import { BaselineAssesmentModal, RequireRegistration } from "#modals";

import {
  Dropdown,
  Block,
  Input,
  InteractiveMap,
  Grid,
  GridItem,
  Loading,
  NewButton,
  OrganizationOverview,
  Modal,
  Select,
} from "@USupport-components-library/src";
import { clientSvc, userSvc } from "@USupport-components-library/services";

import "./organizations.scss";

const INITIAL_FILTERS = {
  search: "",
  district: "",
  paymentMethod: "",
  userInteraction: "",
  specialisations: [],
  propertyType: "",
};

/**
 * Organizations
 *
 * Organizations block
 *
 * @return {jsx}
 */
export const Organizations = ({ personalizeFromAssessment = false }) => {
  const { t } = useTranslation("blocks", { keyPrefix: "organizations" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isTmpUser } = useContext(RootContext);
  const [searchParams] = useSearchParams();

  // Parse URL params from children-rights flow
  const specialisations = searchParams.get("specialisations");
  const specialisationsArray = specialisations
    ? specialisations?.replace(/^\[|\]$/g, "").split(",")
    : [];
  const districtParam = searchParams.get("district");
  const propertyTypeParam = searchParams.get("propertyType");
  const paymentMethodParam = searchParams.get("paymentMethod");
  const userInteractionParam = searchParams.get("userInteraction");

  // Build initial filters from URL params
  const getInitialFilters = () => {
    return {
      search: "",
      district: districtParam || "",
      paymentMethod: paymentMethodParam || "",
      userInteraction: userInteractionParam || "",
      specialisations: specialisationsArray,
      propertyType: propertyTypeParam || "",
    };
  };

  const [mapControls, setMapControls] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isPersonalizationModalOpen, setIsPersonalizationModalOpen] =
    useState(false);
  const [startPersonalization, setStartPersonalization] = useState(false);
  const [filters, setFilters] = useState(getInitialFilters);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isBaselineAssesmentModalOpen, setIsBaselineAssesmentModalOpen] =
    useState(false);
  const [hasAppliedSpecialisations, setHasAppliedSpecialisations] =
    useState(false);
  const [hasTriggeredAutoPersonalization, setHasTriggeredAutoPersonalization] =
    useState(false);
  const [hasAppliedUrlFilters, setHasAppliedUrlFilters] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 500);

  const interactiveMapRef = useRef(null);

  const { data, isLoading } = useGetAllOrganizations({
    search: debouncedSearch,
    district: filters.district,
    paymentMethod: filters.paymentMethod,
    userInteraction: filters.userInteraction,
    specialisations: filters.specialisations,
    propertyType: filters.propertyType,
    userLocation,
  });

  const clientDataQuery = useGetClientData(!isTmpUser)[0];
  const clientData = clientDataQuery.data;

  const { data: latestAssessment } = useGetLatestBaselineAssessment(!isTmpUser);
  const { data: metadata, isLoading: isMetadataLoading } =
    useGetOrganizationMetadata();
  const { data: organizationsKey, isLoading: isOrganizationsKeyLoading } =
    useGetOrganizationKey("web");
  const createBaselineAssessmentMutation = useCreateBaselineAssessment();

  const personalizationMutation = useMutation({
    mutationFn: async () => {
      return clientSvc.getPersonalizedOrganizations();
    },
    onSuccess: ({ data: specialisations }) => {
      if (specialisations.length) {
        const specialisationIds = specialisations.map(
          (x) => x.organization_specialisation_id,
        );
        interactiveMapRef.current?.scrollIntoView({
          behavior: "smooth",
        });
        handleChange("specialisations", specialisationIds);
        setStartPersonalization(true);
      }
    },
  });

  // Apply URL filters from children-rights flow on initial load
  useEffect(() => {
    if (!hasAppliedUrlFilters && data && data.length > 0) {
      const hasUrlFilters =
        specialisationsArray.length > 0 ||
        districtParam ||
        propertyTypeParam ||
        paymentMethodParam ||
        userInteractionParam;

      if (hasUrlFilters) {
        setHasAppliedUrlFilters(true);
        // Filters are already applied via getInitialFilters, just mark as applied
        // and scroll to map if we have results
        if (data.length > 0) {
          interactiveMapRef.current?.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    }
  }, [
    data,
    hasAppliedUrlFilters,
    specialisationsArray,
    districtParam,
    propertyTypeParam,
    paymentMethodParam,
    userInteractionParam,
  ]);

  // Legacy: Apply specialisations from URL (for backwards compatibility)
  useEffect(() => {
    if (
      specialisationsArray.length > 0 &&
      data &&
      data.length > 0 &&
      !hasAppliedSpecialisations &&
      !hasAppliedUrlFilters
    ) {
      setHasAppliedSpecialisations(true);
      handleChange("specialisations", specialisationsArray);
    }
  }, [
    specialisationsArray,
    data,
    hasAppliedSpecialisations,
    hasAppliedUrlFilters,
  ]);

  useEffect(() => {
    if (data && data.length && startPersonalization) {
      handleOrganizationClick(data[0]);
      setStartPersonalization(false);
    }
  }, [startPersonalization, data]);

  useEffect(() => {
    if (
      personalizeFromAssessment &&
      !isTmpUser &&
      latestAssessment?.status === "completed" &&
      !hasTriggeredAutoPersonalization &&
      !personalizationMutation.isLoading
    ) {
      setHasTriggeredAutoPersonalization(true);
      personalizationMutation.mutate();
    }
  }, [
    personalizeFromAssessment,
    isTmpUser,
    latestAssessment?.status,
    hasTriggeredAutoPersonalization,
    personalizationMutation.isLoading,
    personalizationMutation.mutate,
  ]);

  const handleChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const handleOrganizationClick = (organization) => {
    // Scroll to map when organization is clicked
    interactiveMapRef.current?.scrollIntoView({
      behavior: "smooth",
    });

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
          14, // Zoom level for organization location
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
            image={organization.image}
            paymentMethods={organization.paymentMethods}
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
      <>
        <div className="organizations__dropdowns-container">
          {metadata?.districts && metadata.districts.length > 0 && (
            <Dropdown
              selected={filters.district}
              setSelected={(value) => handleChange("district", value)}
              placeholder={t("district_placeholder")}
              options={[
                { label: t("any"), value: null },
                ...metadata.districts
                  .map((district) => ({
                    label: t(district.name),
                    value: district.districtId,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label)),
              ]}
              isSmall
            />
          )}

          {metadata?.paymentMethods && metadata.paymentMethods.length > 0 && (
            <Dropdown
              selected={filters.paymentMethod}
              setSelected={(value) => handleChange("paymentMethod", value)}
              placeholder={t("payment_methods_placeholder")}
              options={[
                { label: t("any"), value: null },
                ...metadata.paymentMethods
                  .map((method) => ({
                    label: t(method.name),
                    value: method.paymentMethodId,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label)),
              ]}
              isSmall
            />
          )}

          {metadata?.userInteractions &&
            metadata.userInteractions.length > 0 && (
              <Dropdown
                selected={filters.userInteraction}
                setSelected={(value) => handleChange("userInteraction", value)}
                placeholder={t("user_interactions_placeholder")}
                options={[
                  { label: t("any"), value: null },
                  ...metadata.userInteractions
                    .map((interaction) => ({
                      label: t(interaction.name + "_interaction"),
                      value: interaction.userInteractionId,
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label)),
                ]}
                isSmall
              />
            )}

          {metadata?.propertyTypes && metadata.propertyTypes.length > 0 && (
            <Dropdown
              selected={filters.propertyType}
              setSelected={(value) => handleChange("propertyType", value)}
              placeholder={t("property_types_placeholder")}
              options={[
                { label: t("any"), value: null },
                ...metadata.propertyTypes
                  .map((propertyType) => ({
                    label: t(propertyType.name),
                    value: propertyType.organizationPropertyTypeId,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label)),
              ]}
              isSmall
            />
          )}
          {metadata?.specialisations && metadata.specialisations.length > 0 && (
            <Select
              placeholder={t("specialisations_placeholder")}
              options={metadata.specialisations
                .map((spec) => ({
                  label: t(spec.name),
                  value: spec.organizationSpecialisationId,
                  selected: filters.specialisations.includes(
                    spec.organizationSpecialisationId,
                  ),
                }))
                .sort((a, b) => a.label.localeCompare(b.label))}
              handleChange={(updatedOptions) => {
                const selectedValues = updatedOptions
                  .filter((option) => option.selected)
                  .map((option) => option.value);
                handleChange("specialisations", selectedValues);
              }}
              maxMenuHeight={250}
              isSearchable={true}
              isSmall
            />
          )}
        </div>
      </>
    );
  };

  const handlePersonalizeClick = async () => {
    if (isTmpUser) {
      setIsRegistrationModalOpen(true);
      return;
    }
    if (latestAssessment?.status === "completed") {
      personalizationMutation.mutate();
    } else {
      setIsPersonalizationModalOpen(true);
    }
  };

  const handleRegisterRedirection = () => {
    userSvc.logout();
    navigate("/dashboard");
  };

  const handleModalCtaClick = () => {
    setIsPersonalizationModalOpen(false);
    if (!clientData.dataProcessing) {
      setIsBaselineAssesmentModalOpen(true);
    } else if (latestAssessment?.status === "in_progress") {
      navigate(`/baseline-assesment/${latestAssessment.baselineAssessmentId}`);
    } else {
      createBaselineAssessmentMutation.mutate(undefined, {
        onSuccess: (assessmentData) => {
          queryClient.invalidateQueries({
            queryKey: ["latest-baseline-assessment"],
          });
          navigate(
            `/baseline-assesment/${assessmentData.baselineAssessmentId}`,
          );
        },
      });
    }
  };

  return (
    <>
      <Block classes="organizations">
        <div className="organizations__search-container">
          <Input
            placeholder={t("search_placeholder")}
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            classes="organizations__search-container__input"
          />
          <NewButton
            onClick={() => setFilters(INITIAL_FILTERS)}
            classes="organizations__search-container__reset-filters-btn"
            label={t("reset_filters")}
          />
        </div>
        <div ref={interactiveMapRef} />
        {renderFilters()}
        <NewButton
          onClick={() => setFilters(INITIAL_FILTERS)}
          classes="organizations__reset-filters-btn"
          label={t("reset_filters")}
          type="outline"
        />

        <NewButton
          classes="organizations__search-container__personalize-btn"
          onClick={handlePersonalizeClick}
          loading={personalizationMutation.isLoading}
          label={t("personalize")}
        />
        {!isOrganizationsKeyLoading && (
          <InteractiveMap
            data={data}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            onMapReady={handleMapReady}
            t={t}
            navigate={navigate}
            organizationsKey={organizationsKey}
          />
        )}
        <Grid md={8} lg={12} classes="organizations__grid">
          {isLoading ? <Loading /> : renderOrganizations()}
        </Grid>
      </Block>
      <Modal
        isOpen={isPersonalizationModalOpen}
        closeModal={() => setIsPersonalizationModalOpen(false)}
        heading={t("personalization")}
        ctaLabel={t("personalization_modal_cta_label")}
        ctaHandleClick={handleModalCtaClick}
      >
        <p>{t("personalization_modal_text")}</p>
      </Modal>
      <RequireRegistration
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        handleRegisterRedirection={handleRegisterRedirection}
      />
      <BaselineAssesmentModal
        open={isBaselineAssesmentModalOpen}
        setOpen={setIsBaselineAssesmentModalOpen}
      />
    </>
  );
};
