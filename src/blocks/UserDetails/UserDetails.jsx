import React, { useState, useEffect, useCallback } from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation, Trans } from "react-i18next";
import { toast } from "react-toastify";
import {
  AccessToken,
  Block,
  DropdownWithLabel,
  Error as ErrorMessage,
  ButtonOnlyIcon,
  Grid,
  GridItem,
  Input,
  Loading,
  Modal,
  ProfilePicturePreview,
  CheckBox,
  NewButton,
} from "@USupport-components-library/src";
import {
  validateProperty,
  validate,
  ThemeContext,
} from "@USupport-components-library/utils";
import { userSvc, clientSvc } from "@USupport-components-library/services";
import { useGetClientData, useUpdateClientData } from "#hooks";

import Joi from "joi";

import { mascotHappyOrange } from "@USupport-components-library/assets";

import "./user-details.scss";
import { useContext } from "react";

const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL;

/**
 * UserDetails
 *
 * User Details block
 *
 * @return {jsx}
 */
export const UserDetails = ({
  openChangePasswordBackdrop,
  openDeleteAccountBackdrop,
  openUploadPictureModal,
  openDeletePictureBackdrop,
  openDeleteChatHistory,
  openDeleteMoodTrackerHistory,
}) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation("blocks", { keyPrefix: "user-details" });
  const IS_RO = localStorage.getItem("country") === "RO";

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const countriesData = queryClient.getQueryData(["countries"]);

  const [clientDataQuery, oldData, setClientData] = useGetClientData();
  const [canSaveChanges, setCanSaveChanges] = useState(false);
  const [errors, setErrors] = useState({});

  const [dataProcessing, setDataProcessing] = useState(null);
  const [dataProcessingModalOpen, setDataProcessingModalOpen] = useState(false);

  const defaultSchema = {
    nickname: Joi.string().required().label(t("nickname_error")),
  };
  const [schema, setSchema] = useState(Joi.object(defaultSchema));
  const [schemaObject, setSchemaObject] = useState(defaultSchema);

  const clientData = clientDataQuery.data;

  useEffect(() => {
    if (!clientDataQuery.isLoading && clientDataQuery.isSuccess) {
      const schemaCopy = { ...schemaObject };
      // If the user has access token  make the email field optional
      if (clientDataQuery.data.accessToken) {
        schemaCopy["email"] = Joi.string()
          .email({ tlds: { allow: false } })
          .allow(null, "", " ")
          .label(t("email_error"));
      } else {
        schemaCopy["email"] = Joi.string()
          .email({ tlds: { allow: false } })
          .required()
          .label(t("email_error"));
      }
      setSchema(Joi.object(schemaCopy));
      setSchemaObject(schemaCopy);
    }
  }, [clientDataQuery.isLoading]);

  useEffect(() => {
    if (clientData && oldData) {
      if (dataProcessing === null) {
        setDataProcessing(clientData.dataProcessing);
      }

      const userDataString = JSON.stringify(clientData);
      const oldDataString = JSON.stringify(oldData);

      setCanSaveChanges(userDataString !== oldDataString);

      // If the email field is empty and the user doesn't have access token
      // then the email field is required and we need to show an error
      if (!clientData.email && !clientData.accessToken) {
        setErrors({ email: t("email_error") });
      }

      if (errors.nickname && clientData.nickname) {
        setErrors({ nickname: "" });
      }

      // If we have errors(from onBlur) and user changes input value
      // or the user has accessToken and the email field is empty
      // remove the error
      if (
        (errors.email && clientData.email) ||
        (clientData.accessToken && !clientData.email)
      ) {
        setErrors({ email: "" });
      }
    }
  }, [clientData, oldData]);

  const nicknameSchema = Joi.object({
    nickname: Joi.string().required().label(t("nickname_error")),
  });

  const emailSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .label(t("email_error")),
  });

  const sexOptions = [
    { label: t("sex_male"), value: "male" },
    { label: t("sex_female"), value: "female" },
    { label: t("sex_unspecified"), value: "unspecified" },
    // { label: t("sex_none"), value: "notMentioned" },
  ];

  const urbanRuralOptions = [
    { label: t("place_of_living_urban"), value: "urban" },
    { label: t("place_of_living_rural"), value: "rural" },
  ];

  const country = localStorage.getItem("country");
  const selectedCountry = countriesData?.find((c) => c.value === country);
  const minAge = selectedCountry?.minAge;
  const maxAge = selectedCountry?.maxAge;
  // Create an array of year objects from year 1900 to current year
  const getYearsOptions = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (
      let year = currentYear - maxAge;
      year <= currentYear - minAge;
      year++
    ) {
      years.push({ label: year.toString(), value: year.toString() });
    }
    years.push({
      label: t("parent"),
      value: "parent",
    });
    return years.reverse();
  }, [countriesData]);

  const onUpdateSuccess = () => {
    toast(t("success_message"));
  };
  const onUpdateError = (error) => {
    setErrors({ submit: error });
  };
  const userDataMutation = useUpdateClientData(
    clientData,
    onUpdateSuccess,
    onUpdateError,
  );

  const openDataProcessingModal = () => setDataProcessingModalOpen(true);
  const closeDataProcessingModal = () => setDataProcessingModalOpen(false);

  const handleNicknameBlur = () => {
    validateProperty(
      "nickname",
      clientData.nickname,
      nicknameSchema,
      setErrors,
    );
  };

  const handleEmailBlur = () => {
    if (
      (clientData.accessToken && clientData.email) ||
      !clientData.accessToken
    ) {
      validateProperty("email", clientData.email, emailSchema, setErrors);
    }
  };

  const handleChange = (field, value) => {
    const dataCopy = { ...clientData };
    dataCopy[field] = value;
    setClientData(dataCopy);
  };

  const handleSave = async () => {
    const dataToValidate = {
      email: clientData.email,
      nickname: clientData.nickname,
    };
    if ((await validate(dataToValidate, schema, setErrors)) === null) {
      userDataMutation.mutate();
    }
  };

  const handleDiscard = () => {
    setClientData(oldData);
  };

  const updateDataProcessing = async (value) => {
    setDataProcessing(value); // Perform an optimistic update

    const res = await clientSvc.changeDataProcessingAgreement(value);
    return res.data.data_processing;
  };

  const updateDataProcessingMutation = useMutation(updateDataProcessing, {
    onSuccess: (data) => {
      setDataProcessing(data);
      closeDataProcessingModal();
      queryClient.invalidateQueries({ queryKey: ["client-data"] });
    },
    onError: () => {
      setDataProcessing((prev) => !prev); // Revert the optimistic update
    },
  });

  const handleToggleClick = () => {
    if (dataProcessing) {
      openDataProcessingModal();
    } else {
      // Change the dataProcessing value to true
      updateDataProcessingMutation.mutate(true);
    }
  };

  const handleLogout = () => {
    userSvc.logout();
    navigate("/dashboard");
  };

  // Disable the save button IF:
  // 1. The user doesn't have access token and the email field is empty
  // 2. The nickname field is empty
  // 3. There are email or nickname errors in the state
  // canSaveChanges variable is true only if the user has made any changes to the original data
  const isSaveDisabled =
    (!clientData?.email && !clientData?.accessToken) ||
    errors.email ||
    errors.nickname ||
    !clientData?.nickname
      ? true
      : !canSaveChanges;

  return (
    <Block classes="user-details">
      <div className="user-details__content-wrapper">
        <div className="user-details__content-wrapper__left">
          {clientDataQuery.isLoading || !clientData ? (
            <Loading size="lg" />
          ) : (
            <Grid classes="user-details__grid">
              <GridItem md={8} lg={12} classes="user-details__grid-item">
                <div className="user-details__profile-picture-container">
                  <ProfilePicturePreview
                    image={clientData.image}
                    handleDeleteClick={openDeletePictureBackdrop}
                    handleChangeClick={openUploadPictureModal}
                    changePhotoText={t("change_photo")}
                  />
                  <ButtonOnlyIcon
                    iconName={"exit"}
                    iconSize={"md"}
                    iconColor={"#6989A4"}
                    onClick={handleLogout}
                  />
                </div>

                {clientData.accessToken ? (
                  <AccessToken
                    accessToken={clientData.accessToken}
                    accessTokenLabel={t("access_token")}
                    classes="user-details__grid-item__access-token"
                  />
                ) : null}
                <Input
                  value={clientData.name}
                  label={t("name")}
                  onChange={(e) => handleChange("name", e.currentTarget.value)}
                  placeholder={t("name_placeholder")}
                />
                <Input
                  value={clientData.surname}
                  label={t("surname")}
                  onChange={(e) =>
                    handleChange("surname", e.currentTarget.value)
                  }
                  placeholder={t("surname_placeholder")}
                />
                <Input
                  value={clientData.nickname}
                  label={t("nickname") + "*"}
                  onChange={(e) =>
                    handleChange("nickname", e.currentTarget.value)
                  }
                  onBlur={handleNicknameBlur}
                  placeholder={t("nickname_placeholder")}
                  errorMessage={errors.nickname}
                />
                <Input
                  label={`${t("email")}${
                    clientDataQuery?.data?.accessToken ? "" : "*"
                  }`}
                  value={clientData.email}
                  onChange={(e) => handleChange("email", e.currentTarget.value)}
                  onBlur={handleEmailBlur}
                  placeholder={t("email_placeholder")}
                  errorMessage={errors.email}
                />
                <Grid classes="user-details__grid__dropdowns-grid">
                  <GridItem md={8} lg={4}>
                    <DropdownWithLabel
                      options={sexOptions}
                      selected={clientData.sex}
                      setSelected={(option) => handleChange("sex", option)}
                      label={`${t("sex")}${
                        clientDataQuery?.data?.accessToken ? "" : "*"
                      }`}
                      placeholder={t("sex_placeholder")}
                    />
                  </GridItem>
                  <GridItem md={8} lg={4}>
                    <DropdownWithLabel
                      options={getYearsOptions()}
                      selected={clientData.yearOfBirth}
                      setSelected={(option) =>
                        handleChange("yearOfBirth", option)
                      }
                      label={`${t("year_of_birth")}${
                        clientDataQuery?.data?.accessToken ? "" : "*"
                      }`}
                      placeholder={t("year_of_birth_placeholder")}
                    />
                  </GridItem>
                  <GridItem md={8} lg={4}>
                    <DropdownWithLabel
                      options={urbanRuralOptions}
                      selected={clientData.urbanRural}
                      setSelected={(option) =>
                        handleChange("urbanRural", option)
                      }
                      label={`${t("living_place")}${
                        clientDataQuery?.data?.accessToken ? "" : "*"
                      }`}
                      placeholder={t("living_place_placeholder")}
                    />
                  </GridItem>
                </Grid>
                <div className="user-details__grid-item-privacy__content-consent">
                  <CheckBox
                    isChecked={dataProcessing ? true : false}
                    setIsChecked={handleToggleClick}
                  />
                  <p className="text">
                    <Trans
                      components={[
                        <span
                          onClick={() =>
                            window
                              .open(
                                `${WEBSITE_URL}/privacy-policy`,
                                "_blank",
                                "noreferrer",
                              )
                              .focus()
                          }
                          className={[
                            "user-details__modal-heading",
                            theme === "highContrast"
                              ? "user-details__modal-heading--hc"
                              : "",
                          ].join(" ")}
                        />,
                      ]}
                    >
                      {t("consent")}
                    </Trans>
                  </p>
                </div>
                {errors.submit ? (
                  <ErrorMessage message={errors.submit} />
                ) : null}
                <div className="user-details__grid__buttons-container">
                  <NewButton
                    label={t("button_text")}
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                    loading={userDataMutation.isLoading}
                    size="lg"
                  />
                  <NewButton
                    label={t("button_secondary_text")}
                    disabled={!canSaveChanges}
                    onClick={handleDiscard}
                    type="outline"
                    size="lg"
                  />
                </div>
              </GridItem>
              <GridItem md={8} lg={12}>
                <Grid classes="user-details__grid__delete-buttons-container">
                  <GridItem md={4} lg={6}>
                    <NewButton
                      size="lg"
                      type="text"
                      label={t("change_password")}
                      onClick={openChangePasswordBackdrop}
                    />
                  </GridItem>
                  <GridItem md={4} lg={6}>
                    <NewButton
                      size="lg"
                      type="text"
                      label={t("delete_account")}
                      onClick={openDeleteAccountBackdrop}
                    />
                  </GridItem>
                  <GridItem md={4} lg={6}>
                    <NewButton
                      size="lg"
                      type="text"
                      label={t("delete_mood_tracker")}
                      onClick={openDeleteMoodTrackerHistory}
                    />
                  </GridItem>
                  {!IS_RO && (
                    <GridItem md={4} lg={6}>
                      <NewButton
                        size="lg"
                        type="text"
                        label={t("delete_chat")}
                        onClick={openDeleteChatHistory}
                      />
                    </GridItem>
                  )}
                  <GridItem md={4} lg={6}>
                    <NewButton
                      size="lg"
                      type="text"
                      label={t("logout")}
                      onClick={handleLogout}
                      iconName="exit"
                      iconColor="#6989A4"
                      classes="user-details__grid__logout-button"
                    />
                  </GridItem>
                </Grid>
              </GridItem>
            </Grid>
          )}
        </div>
        <div className="user-details__content-wrapper__right">
          <img src={mascotHappyOrange} alt="mascot" />
        </div>
      </div>
      <Modal
        isOpen={dataProcessingModalOpen}
        closeModal={closeDataProcessingModal}
        heading={
          <Trans
            components={[
              <span
                className="user-details__modal-heading"
                onClick={() =>
                  window
                    .open(
                      `${WEBSITE_URL}/privacy-policy`,
                      "_blank",
                      "noreferrer",
                    )
                    .focus()
                }
              />,
            ]}
          >
            {t("data_processing_modal_heading")}
          </Trans>
        }
        text={t("data_processing_modal_text")}
        ctaLabel={t("data_processing_modal_confirm_button")}
        ctaHandleClick={() => {
          updateDataProcessingMutation.mutate(false);
        }}
        isCtaDisabled={updateDataProcessingMutation.isLoading}
        secondaryCtaLabel={t("data_processing_modal_cancel_button")}
        secondaryCtaType="secondary"
        secondaryCtaHandleClick={closeDataProcessingModal}
      />
    </Block>
  );
};
