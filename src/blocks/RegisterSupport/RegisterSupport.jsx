import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Block,
  Grid,
  GridItem,
  RadioButtonSelectorGroup,
  Button,
  Modal,
  Error,
} from "@USupport-components-library/src";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientSvc } from "@USupport-components-library/services";
import { useGetClientData } from "#hooks";

import "./register-support.scss";

/**
 * RegisterSupport
 *
 * RegisterSupport block
 *
 * @return {jsx}
 */
export const RegisterSupport = () => {
  const { t } = useTranslation("register-support");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clientData = useGetClientData()[1];

  const [data, setData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState();

  const hasGivenPermission = useRef();

  useEffect(() => {
    if (clientData) {
      hasGivenPermission.current = clientData.dataProcessing;
    }
  }, [clientData]);

  const options = [
    { label: t("answer_yes_label"), value: "yes" },
    { label: t("answer_no_label"), value: "no" },
  ];

  const closeModal = () => {
    setIsModalOpen(false);
    setData(null);
    if (!hasGivenPermission?.current) {
      setShowError(true);
    }
  };

  const updateDataProcessing = async () => {
    hasGivenPermission.current = true;
    await clientSvc.changeDataProcessingAgreement(true);
    return true;
  };
  const updateDataProcessingMutation = useMutation(updateDataProcessing, {
    onSuccess: () => {
      setSubmitError(null);
      setShowError(false);
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["client-data"] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      hasGivenPermission.current = false;
      setIsSubmitting(false);
      const { message: errorMessage } = useError(error);
      setSubmitError(errorMessage);
    },
  });

  const handleGivePermission = () => {
    setIsSubmitting(true);
    updateDataProcessingMutation.mutate();
  };

  const handleChange = (value) => {
    setData(value);
    if (value === "yes" && !hasGivenPermission?.current) {
      setIsModalOpen(true);
    }
  };

  const handleContinue = () => {
    if (data === "yes" && hasGivenPermission?.current) {
      navigate("/select-provider");
    } else {
      navigate("/dashboard");
    }
  };

  const canContinue = data !== null;

  return (
    <Block classes="register-support">
      <Grid md={8} lg={12} classes="register-support__grid">
        <GridItem md={8} lg={12} classes="register-support__grid__content-item">
          <div>
            <RadioButtonSelectorGroup
              name="doYouNeedHelp"
              options={options}
              selected={data}
              setSelected={handleChange}
            />
            {showError ? <Error message={t("error")} /> : null}
          </div>
          <Button
            disabled={!canContinue}
            label={t("button_continue_label")}
            size="lg"
            onClick={() => handleContinue()}
          />
        </GridItem>
      </Grid>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        heading={t("modal_heading")}
        text={t("modal_paragraph")}
        ctaLabel={t("modal_cta_1")}
        ctaHandleClick={handleGivePermission}
        isCtaDisabled={isSubmitting}
        secondaryCtaLabel={t("modal_cta_2")}
        secondaryCtaType="secondary"
        secondaryCtaHandleClick={closeModal}
        errorMessage={submitError}
      />
    </Block>
  );
};
