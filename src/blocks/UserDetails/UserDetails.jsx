import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation, Trans } from "react-i18next";
import { toast } from "react-toastify";
import {
  AccessToken,
  Block,
  Button,
  ButtonWithIcon,
  DropdownWithLabel,
  Error as ErrorMessage,
  Grid,
  GridItem,
  Input,
  Loading,
  Modal,
  Toggle,
  ProfilePicturePreview,
} from "@USupport-components-library/src";
import { validateProperty, validate } from "@USupport-components-library/utils";
import { userSvc, clientSvc } from "@USupport-components-library/services";
import { useGetClientData, useUpdateClientData } from "#hooks";

import Joi from "joi";

import "./user-details.scss";

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
}) => {
  const { t } = useTranslation("user-details");

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
    { label: t("sex_none"), value: "notMentioned" },
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
      years.push({ label: year.toString(), value: year });
    }
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
    onUpdateError
  );

  const openDataProcessingModal = () => setDataProcessingModalOpen(true);
  const closeDataProcessingModal = () => setDataProcessingModalOpen(false);

  const handleNicknameBlur = () => {
    validateProperty(
      "nickname",
      clientData.nickname,
      nicknameSchema,
      setErrors
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
    navigate("/");
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
      {clientDataQuery.isLoading || !clientData ? (
        <Loading size="lg" />
      ) : (
        <Grid classes="user-details__grid">
          <GridItem md={8} lg={12} classes="user-details__grid-item">
            <ProfilePicturePreview
              image={clientData.image}
              handleDeleteClick={openDeletePictureBackdrop}
              handleChangeClick={openUploadPictureModal}
              changePhotoText={t("change_photo")}
            />

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
              onChange={(e) => handleChange("surname", e.currentTarget.value)}
              placeholder={t("surname_placeholder")}
            />
            <Input
              value={clientData.nickname}
              label={t("nickname") + "*"}
              onChange={(e) => handleChange("nickname", e.currentTarget.value)}
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
            <DropdownWithLabel
              options={sexOptions}
              selected={clientData.sex}
              setSelected={(option) => handleChange("sex", option)}
              label={`${t("sex")}${
                clientDataQuery?.data?.accessToken ? "" : "*"
              }`}
              placeholder={t("sex_placeholder")}
            />
            <DropdownWithLabel
              options={getYearsOptions()}
              selected={clientData.yearOfBirth}
              setSelected={(option) => handleChange("yearOfBirth", option)}
              label={`${t("year_of_birth")}${
                clientDataQuery?.data?.accessToken ? "" : "*"
              }`}
              placeholder={t("year_of_birth_placeholder")}
            />
            <DropdownWithLabel
              options={urbanRuralOptions}
              selected={clientData.urbanRural}
              setSelected={(option) => handleChange("urbanRural", option)}
              label={`${t("living_place")}${
                clientDataQuery?.data?.accessToken ? "" : "*"
              }`}
              placeholder={t("living_place_placeholder")}
            />
            {errors.submit ? <ErrorMessage message={errors.submit} /> : null}
            <Button
              classes="user-details__grid__save-button"
              type="primary"
              label={t("button_text")}
              size="lg"
              onClick={handleSave}
              disabled={isSaveDisabled}
              loading={userDataMutation.isLoading}
            />
            <Button
              type="secondary"
              classes="user-details__grid__discard-button"
              label={t("button_secondary_text")}
              size="lg"
              disabled={!canSaveChanges}
              onClick={handleDiscard}
            />
          </GridItem>
          <GridItem classes="user-details__grid-item-privacy" md={8} lg={12}>
            <div className="user-details__grid-item-privacy__content">
              <p className="text user-details__grid-item-privacy__content-privacy ">
                {t("privacy")}
              </p>
              <div className="user-details__grid-item-privacy__content-consent">
                <p className="text">
                  <Trans
                    components={[
                      <span
                        onClick={() =>
                          window
                            .open(
                              `${WEBSITE_URL}/privacy-policy`,
                              "_blank",
                              "noreferrer"
                            )
                            .focus()
                        }
                        className="user-details__modal-heading"
                      />,
                    ]}
                  >
                    {t("consent")}
                  </Trans>
                </p>
                <Toggle
                  isToggled={dataProcessing ? true : false}
                  setParentState={handleToggleClick}
                  shouldChangeState={dataProcessing ? false : true}
                />
              </div>
              <Button
                size="lg"
                type="ghost"
                label={t("change_password")}
                classes="user-details__grid__change-password-button"
                onClick={openChangePasswordBackdrop}
              />
              <ButtonWithIcon
                iconName={"exit"}
                iconSize={"md"}
                size="lg"
                iconColor={"#20809e"}
                color={"green"}
                label={t("logout")}
                type={"ghost"}
                classes="user-details__grid__delete-account-button"
                onClick={handleLogout}
              />
              <ButtonWithIcon
                iconName={"circle-close"}
                iconSize={"md"}
                size="lg"
                iconColor={"#eb5757"}
                color={"red"}
                label={t("delete_account")}
                type={"ghost"}
                classes="user-details__grid__delete-account-button"
                onClick={openDeleteAccountBackdrop}
              />
              <ButtonWithIcon
                iconName={"circle-close"}
                iconSize={"md"}
                size="lg"
                iconColor={"#eb5757"}
                color={"red"}
                label={t("delete_chat")}
                type={"ghost"}
                classes="user-details__grid__delete-account-button"
                onClick={openDeleteChatHistory}
              />
            </div>
          </GridItem>
        </Grid>
      )}
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
                      "noreferrer"
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
