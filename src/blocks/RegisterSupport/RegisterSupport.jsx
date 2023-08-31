import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Block,
  Grid,
  GridItem,
  RadioButtonSelectorGroup,
  Button,
  Error,
} from "@USupport-components-library/src";
import { clientSvc } from "@USupport-components-library/services";

import { useGetClientData } from "#hooks";

import { RequireDataAgreement } from "#modals";

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
      setShowError(false);
      queryClient.invalidateQueries({ queryKey: ["client-data"] });
      setIsModalOpen(false);
    },
    onError: () => {
      hasGivenPermission.current = false;
    },
  });

  const handleGivePermission = () => {
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
      <RequireDataAgreement
        isOpen={isModalOpen}
        onClose={closeModal}
        onGivePermission={handleGivePermission}
        isLoading={updateDataProcessingMutation.isLoading}
      />
    </Block>
  );
};
