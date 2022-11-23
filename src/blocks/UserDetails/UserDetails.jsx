import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
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
  Icon,
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
/**
 * UserDetails
 *
 * User Details block
 *
 * @return {jsx}
 */
export const UserDetails = ({
  openDataProcessingBackdrop,
  openDeleteAccountBackdrop,
  openUploadPictureModal,
  openDeletePictureBackdrop,
}) => {
  const { t } = useTranslation("user-details");

  const [clientDataQuery, oldData, setClientData] = useGetClientData();
  const [canSaveChanges, setCanSaveChanges] = useState(false);
  const [errors, setErrors] = useState({});

  const [dataProcessing, setDataProcessing] = useState(null);
  const [dataProcessingModalOpen, setDataProcessingModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [
    isProcessingUpdateDataProcessing,
    setIsProcessingUpdateDataProcessing,
  ] = useState(false);

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
    if (clientData) {
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
  }, [clientData]);

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
    { label: t("sex_none"), value: "none" },
  ];

  const livingPlaceOptions = [
    { label: t("place_of_living_urban"), value: "urban" },
    { label: t("place_of_living_rural"), value: "rural" },
  ];

  // Create an array of year objects from year 1900 to current year
  const getYearsOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1900; year < currentYear - 13; year++) {
      years.push({ label: year.toString(), value: year });
    }
    return years.reverse();
  };

  const onUpdateSuccess = () => {
    toast(t("success_message"));
    setIsProcessing(false);
  };
  const onUpdateError = (error) => {
    setErrors({ submit: error });
    setIsProcessing(false);
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
      setIsProcessing(true);
      userDataMutation.mutate();
    }
  };

  const handleDiscard = () => {
    setClientData(oldData);
  };

  const updateDataProcessing = async (value) => {
    setDataProcessing(value); // Perform an optimistic update
    setIsProcessingUpdateDataProcessing(true);

    // TODO: Send data processing value to the server
    // The server should return the new value of the "data_processing" field
    const res = await clientSvc.changeDataProcessingAgreement(value);
    return res.data.data_processing;
  };

  const updateDataProcessingMutation = useMutation(updateDataProcessing, {
    onSuccess: (data) => {
      setDataProcessing(data);
      setIsProcessingUpdateDataProcessing(false);
      closeDataProcessingModal();
    },
    onError: (error) => {
      setDataProcessing((prev) => !prev); // Revert the optimistic update
      setIsProcessingUpdateDataProcessing(false);
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
              label={t("nickname")}
              onChange={(e) => handleChange("nickname", e.currentTarget.value)}
              onBlur={handleNicknameBlur}
              placeholder={t("nickname_placeholder")}
              errorMessage={errors.nickname}
            />
            <Input
              label={t("email")}
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
              label={t("sex")}
            />
            <DropdownWithLabel
              options={getYearsOptions()}
              selected={clientData.yearOfBirth}
              setSelected={(option) => handleChange("yearOfBirth", option)}
              label={t("year_of_birth")}
            />
            <DropdownWithLabel
              options={livingPlaceOptions}
              selected={clientData.livingPlace}
              setSelected={(option) => handleChange("livingPlace", option)}
              label={t("living_place")}
            />
            {errors.submit ? <ErrorMessage message={errors.submit} /> : null}
            <Button
              classes="user-details__grid__save-button"
              type="primary"
              label={t("button_text")}
              size="lg"
              onClick={handleSave}
              disabled={isSaveDisabled || isProcessing}
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
                <p className="text">{t("consent")}</p>
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
                onClick={openDataProcessingBackdrop}
              />
              <ButtonWithIcon
                iconName={"circle-close"}
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
            </div>
          </GridItem>
        </Grid>
      )}
      <Modal
        isOpen={dataProcessingModalOpen}
        closeModal={closeDataProcessingModal}
        heading={t("data_processing_modal_heading")}
        text={t("data_processing_modal_text")}
        ctaLabel={t("data_processing_modal_confirm_button")}
        ctaHandleClick={() => {
          updateDataProcessingMutation.mutate(false);
        }}
        isCtaDisabled={isProcessingUpdateDataProcessing}
        secondaryCtaLabel={t("data_processing_modal_cancel_button")}
        secondaryCtaType="secondary"
        secondaryCtaHandleClick={closeDataProcessingModal}
      />
    </Block>
  );
};
