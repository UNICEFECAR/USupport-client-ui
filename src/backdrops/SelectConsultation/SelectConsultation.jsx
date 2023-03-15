import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { RootContext } from "#routes";

import {
  Backdrop,
  Header,
  RadioButtonSelectorGroup,
  Loading,
} from "@USupport-components-library/src";
import { providerSvc } from "@USupport-components-library/services";
import {
  getTimestampFromUTC,
  parseUTCDate,
} from "@USupport-components-library/utils";

import { useGetProviderDataById } from "#hooks";

import "./select-consultation.scss";

/**
 * SelectConsultation
 *
 * The SelectConsultation backdrop
 *
 * @return {jsx}
 */
export const SelectConsultation = ({
  isOpen,
  onClose,
  edit = false,
  handleBlockSlot,
  providerId,
  isCtaDisabled = false,
  errorMessage,
  campaignId: campaingIdFromProps,
}) => {
  const { t } = useTranslation("select-consultation");
  const { activeCoupon } = useContext(RootContext);

  const campaignId = activeCoupon?.campaignId || campaingIdFromProps;

  let providerData = useGetProviderDataById(providerId, campaignId).data;

  const [startDate, setStartDate] = useState(null);
  const [currentDay, setCurrentDay] = useState(new Date().getTime());

  useEffect(() => {
    if (providerData) {
      const earliestAvailableSlot = providerData?.earliestAvailableSlot;
      setCurrentDay(new Date(earliestAvailableSlot).getTime());
    }
  }, [providerData]);

  const [selectedSlot, setSelectedSlot] = useState("");

  const getAvailableSlots = async (startDate, currentDay, providerId) => {
    const { data } = await providerSvc.getAvailableSlotsForSingleDay(
      getTimestampFromUTC(startDate),
      getTimestampFromUTC(currentDay),
      providerId,
      campaignId
    );

    if (campaignId) {
      return data.map((x) => ({
        time: parseUTCDate(x.time),
        campaign_id: x.campaign_id,
      }));
    }

    return data;
  };
  const availableSlotsQuery = useQuery(
    ["available-slots", startDate, currentDay, providerId],
    () => getAvailableSlots(startDate, currentDay, providerId),
    { enabled: !!startDate && !!currentDay && !!providerId }
  );
  const availableSlots = availableSlotsQuery.data;

  const handleDayChange = (start, day) => {
    setStartDate(start);
    setCurrentDay(day);
  };

  const handleChooseSlot = (slot) => {
    setSelectedSlot(slot);
  };

  const renderFreeSlots = () => {
    const todaySlots = availableSlots?.filter((slot) => {
      const slotDate = new Date(campaignId ? slot.time : slot).getDate();
      const currentDayDate = new Date(currentDay).getDate();

      // Check if the slot is for the current campaign
      if (campaignId && campaignId !== slot.campaign_id) {
        return false;
      }
      return slotDate === currentDayDate;
    });
    if (!todaySlots || todaySlots?.length === 0)
      return <p>{t("no_slots_available")}</p>;

    const options = todaySlots?.map(
      (slot) => {
        const slotLocal = new Date(campaignId ? slot.time : slot);

        const value = new Date(campaignId ? slot.time : slot).getTime();

        const getDoubleDigitHour = (hour) =>
          hour === 24 ? "00" : hour < 10 ? `0${hour}` : hour;

        const displayStartHours = getDoubleDigitHour(slotLocal.getHours());
        const displayStartMinutes = getDoubleDigitHour(slotLocal.getMinutes());
        const displayEndHours = getDoubleDigitHour(slotLocal.getHours() + 1);
        const displayEndMinutes = getDoubleDigitHour(slotLocal.getMinutes());
        const label = `${displayStartHours}:${displayStartMinutes} - ${displayEndHours}:${displayEndMinutes}`;

        return { label: label, value };
      },
      [availableSlots]
    );

    return (
      <RadioButtonSelectorGroup
        options={options}
        name="free-slots"
        selected={selectedSlot}
        setSelected={handleChooseSlot}
        classes="select-consultation__radio-button-selector-group"
      />
    );
  };

  const handleSave = () => {
    let slotObject;
    if (campaignId) {
      slotObject = availableSlots.find(
        (slot) => new Date(slot.time).getTime() === selectedSlot
      );
    }
    const time = campaignId ? slotObject : selectedSlot;
    handleBlockSlot(time, providerData.consultationPrice);
  };

  return (
    <Backdrop
      classes="select-consultation"
      title="SelectConsultation"
      isOpen={isOpen}
      onClose={onClose}
      heading={edit === true ? t("heading_edit") : t("heading_new")}
      text={edit === true ? t("subheading_edit") : t("subheading_new")}
      ctaLabel={t("cta_button_label")}
      ctaHandleClick={handleSave}
      isCtaDisabled={isCtaDisabled ? true : !selectedSlot ? true : false}
      errorMessage={errorMessage}
    >
      <div className="select-consultation__content-container">
        <Header
          handleDayChange={handleDayChange}
          setStartDate={setStartDate}
          startDate={providerData?.earliestAvailableSlot}
        />
        <div className="select-consultation__content-container__slots">
          {availableSlotsQuery.isLoading ? (
            <Loading size="md" />
          ) : (
            renderFreeSlots()
          )}
        </div>
      </div>
    </Backdrop>
  );
};

SelectConsultation.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  edit: PropTypes.bool,
  handleConfirmConsultation: PropTypes.func,
  providerId: PropTypes.string,
  isCtaDisabled: PropTypes.bool,
};
