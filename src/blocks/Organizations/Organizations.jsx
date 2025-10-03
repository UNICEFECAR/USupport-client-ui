import { useState, useRef, useEffect, useContext } from "react";
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
  Button,
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
export const Organizations = () => {
  const { t } = useTranslation("blocks", { keyPrefix: "organizations" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isTmpUser } = useContext(RootContext);
  const [searchParams] = useSearchParams();
  const specialisations = searchParams.get("specialisations");
  const specialisationsArray = specialisations
    ? specialisations?.replace(/^\[|\]$/g, "").split(",")
    : [];

  const [mapControls, setMapControls] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isPersonalizationModalOpen, setIsPersonalizationModalOpen] =
    useState(false);
  const [startPersonalization, setStartPersonalization] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isBaselineAssesmentModalOpen, setIsBaselineAssesmentModalOpen] =
    useState(false);
  const [hasAppliedSpecialisations, setHasAppliedSpecialisations] =
    useState(false);

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
  const createBaselineAssessmentMutation = useCreateBaselineAssessment();

  const personalizationMutation = useMutation({
    mutationFn: async () => {
      return clientSvc.getPersonalizedOrganizations();
    },
    onSuccess: ({ data: specialisations }) => {
      if (specialisations.length) {
        const specialisationIds = specialisations.map(
          (x) => x.organization_specialisation_id
        );
        interactiveMapRef.current?.scrollIntoView({
          behavior: "smooth",
        });
        handleChange("specialisations", specialisationIds);
        setStartPersonalization(true);
      }
    },
  });

  useEffect(() => {
    if (
      specialisationsArray.length > 0 &&
      data &&
      data.length > 0 &&
      !hasAppliedSpecialisations
    ) {
      setHasAppliedSpecialisations(true);
      handleChange("specialisations", specialisationsArray);
    }
  }, [specialisationsArray, data, hasAppliedSpecialisations]);

  useEffect(() => {
    if (data && data.length && startPersonalization) {
      handleOrganizationClick(data[0]);
      setStartPersonalization(false);
    }
  }, [startPersonalization, data]);

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
        </div>

        {metadata?.specialisations && metadata.specialisations.length > 0 && (
          <div className="organizations__specialisations-container">
            <Select
              placeholder={t("specialisations_placeholder")}
              options={metadata.specialisations
                .map((spec) => ({
                  label: t(spec.name),
                  value: spec.organizationSpecialisationId,
                  selected: filters.specialisations.includes(
                    spec.organizationSpecialisationId
                  ),
                }))
                .sort((a, b) => a.label.localeCompare(b.label))}
              handleChange={(updatedOptions) => {
                const selectedValues = updatedOptions
                  .filter((option) => option.selected)
                  .map((option) => option.value);
                handleChange("specialisations", selectedValues);
              }}
              classes="organizations__specialisations-select select-container--full-width"
              maxMenuHeight={250}
              isSearchable={true}
            />
          </div>
        )}
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
    navigate("/register-preview");
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
            `/baseline-assesment/${assessmentData.baselineAssessmentId}`
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
          <Button
            onClick={() => setFilters(INITIAL_FILTERS)}
            size="sm"
            classes="organizations__search-container__reset-filters-btn"
          >
            {t("reset_filters")}
          </Button>
        </div>
        <div ref={interactiveMapRef} />
        {renderFilters()}
        <Button
          onClick={() => setFilters(INITIAL_FILTERS)}
          size="sm"
          classes="organizations__reset-filters-btn"
        >
          {t("reset_filters")}
        </Button>

        <Button
          // reference={interactiveMapRef}
          classes="organizations__search-container__personalize-btn"
          color="purple"
          onClick={handlePersonalizeClick}
          size="sm"
          loading={personalizationMutation.isLoading}
          label={t("personalize")}
        />
        <InteractiveMap
          data={data}
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          onMapReady={handleMapReady}
          t={t}
          navigate={navigate}
        />
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
