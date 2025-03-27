import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Joi from "joi";

import {
  Block,
  Grid,
  GridItem,
  Textarea,
  Button,
  Modal,
} from "@USupport-components-library/src";
import { validate } from "@USupport-components-library/utils";
import { userSvc } from "@USupport-components-library/services";
import { useSendInformationPortalSuggestion } from "#hooks";
import { RequireRegistration } from "#modals";

import "./give-suggestion.scss";

const initialData = {
  suggestion: "",
};

/**
 * GiveSuggestion
 *
 * Give Suggestion Block
 *
 * @return {jsx}
 */
export const GiveSuggestion = () => {
  const { t } = useTranslation("give-suggestion");

  const navigate = useNavigate();
  const isTmpUser = userSvc.getUserID() === "tmp-user";

  const [data, setData] = useState({ ...initialData });
  const [errors, setErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const schema = Joi.object({
    suggestion: Joi.string().min(5).label(t("error")),
  });

  useEffect(() => {
    if (data.suggestion !== "") {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [data]);

  const handleModalSuccessCtaClick = () => {
    window.location.reload(false);
    window.scrollTo(0, 0);
  };

  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  const onError = (error) => toast(error);
  const onSuccess = () => {
    setIsSuccessModalOpen(true);
    setData({ ...initialData });
  };
  const sendSuggestionMutation = useSendInformationPortalSuggestion(
    onError,
    onSuccess
  );

  const handleChange = (field, value) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    if (isTmpUser) {
      setIsRegistrationModalOpen(true);
    } else if ((await validate(data, schema, setErrors)) === null) {
      sendSuggestionMutation.mutate(data.suggestion);
    }
  };

  const handleRegisterRedirection = () => {
    userSvc.logout();
    navigate("/register-preview");
  };

  return (
    <>
      <RequireRegistration
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        handleRegisterRedirection={handleRegisterRedirection}
      />
      <Block classes="give-suggestion">
        <Grid classes="give-suggestion__grid">
          <GridItem md={4} lg={12} classes="give-suggestion__heading-item">
            <h4>{t("heading")}</h4>
          </GridItem>
          <GridItem md={8} lg={12} classes="give-suggestion__subheading-item">
            <p>{t("subheading")}</p>
          </GridItem>
          <GridItem md={8} lg={12} classes="give-suggestion__textarea-item">
            <Textarea
              size="md"
              placeholder={t("suggestion_placeholder")}
              onChange={(value) => handleChange("suggestion", value)}
              value={data.suggestion}
              errorMessage={errors.suggestion}
            />
          </GridItem>

          <GridItem md={8} lg={12} classes="">
            <Button
              type="link"
              label={t("submit")}
              onClick={handleSubmit}
              disabled={!canSubmit}
              loading={sendSuggestionMutation.isLoading}
            />
          </GridItem>
        </Grid>
        <Modal
          isOpen={isSuccessModalOpen}
          closeModal={closeSuccessModal}
          heading={t("modal_title")}
          text={t("modal_text")}
          ctaLabel={t("modal_cta_label")}
          ctaHandleClick={handleModalSuccessCtaClick}
        />
      </Block>
    </>
  );
};
