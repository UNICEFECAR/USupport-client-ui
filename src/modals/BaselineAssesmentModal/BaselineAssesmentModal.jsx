import { useState, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  useCustomNavigate as useNavigate,
  useCreateBaselineAssessment,
  useGetClientData,
} from "#hooks";

import { Modal, Toggle } from "@USupport-components-library/src";
import { clientSvc } from "@USupport-components-library/services";
import { constructWebsiteUrl } from "@USupport-components-library/utils";

import "./baseline-assesment-modal.scss";

/**
 * BaselineAssesmentModal
 *
 * The BaselineAssesmentModal modal
 *
 * @return {jsx}
 */
export const BaselineAssesmentModal = ({ open, setOpen, isTmpUser }) => {
  const { t } = useTranslation("modals", {
    keyPrefix: "baseline-assesment-modal",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const websiteUrl = constructWebsiteUrl("privacy-policy");
  const createBaselineAssessmentMutation = useCreateBaselineAssessment();

  const clientDataQuery = useGetClientData(!isTmpUser)[0];
  const clientData = clientDataQuery.data;

  const [isOpen, setIsOpen] = useState(false);
  const [dataProcessing, setDataProcessing] = useState(false);
  const onClose = () => {
    setIsOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (clientData) {
      setDataProcessing(clientData.dataProcessing);
      if (!clientData.hasCheckedBaselineAssessment) {
        setIsOpen(true);
      }
    }
  }, [clientData]);

  const handleCtaClick = () => {
    createBaselineAssessmentMutation.mutate(undefined, {
      onSuccess: (assessmentData) => {
        queryClient.invalidateQueries({
          queryKey: ["latest-baseline-assessment"],
        });
        onClose();
        navigate(`/baseline-assesment/${assessmentData.baselineAssessmentId}`);
      },
    });
    updateClientHasCheckedBaselineAssessmentMutation.mutate(true);
  };

  const updateClientHasCheckedBaselineAssessmentMutation = useMutation(
    clientSvc.updateClientHasCheckedBaselineAssessment,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["client-data"] });
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const updateDataProcessing = async (value) => {
    const res = await clientSvc.changeDataProcessingAgreement(value);
    return res.data.data_processing;
  };

  const updateDataProcessingMutation = useMutation(updateDataProcessing, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-data"] });
    },
    onError: () => {
      setDataProcessing((prev) => !prev); // Revert the optimistic update
    },
  });

  const handleToggleClick = () => {
    setDataProcessing(!dataProcessing);
    updateDataProcessingMutation.mutate(true);
  };

  const handleSecondaryCtaClick = () => {
    updateClientHasCheckedBaselineAssessmentMutation.mutate(true);
    onClose();
  };

  return (
    <Modal
      classes="baseline-assesment-modal"
      heading="Baseline Assesment"
      isOpen={isOpen}
      closeModal={onClose}
      ctaLabel={t("cta_label")}
      ctaHandleClick={handleCtaClick}
      secondaryCtaLabel={t("secondary_cta_label")}
      secondaryCtaHandleClick={handleSecondaryCtaClick}
      secondaryCtaType="secondary"
      isCtaLoading={createBaselineAssessmentMutation.isLoading}
      isCtaDisabled={!dataProcessing || clientDataQuery.isLoading}
    >
      <div className="baseline-assesment-modal__content">
        <p>{t("paragraph_1")}</p>
        <p>{t("paragraph_2")}</p>
        <p>{t("paragraph_3")}</p>
        <p className="text-center">{t("paragraph_4")}</p>
      </div>

      {true && (
        <div className="baseline-assesment-modal__privacy-content">
          <p className="baseline-assesment-modal__privacy-content-heading ">
            {t("privacy")}
          </p>
          <div className="baseline-assesment-modal__privacy-content-consent">
            <p className="text">
              <Trans
                components={[
                  <span
                    onClick={() =>
                      window.open(websiteUrl, "_blank", "noreferrer").focus()
                    }
                    className="baseline-assesment-modal__privacy-content-link"
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
        </div>
      )}
    </Modal>
  );
};
