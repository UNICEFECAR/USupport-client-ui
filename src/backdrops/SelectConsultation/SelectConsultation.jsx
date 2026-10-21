import React, { useState, useEffect, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { RootContext } from "#routes";

import { Backdrop, Header, Loading } from "@USupport-components-library/src";
import { providerSvc } from "@USupport-components-library/services";
import {
  getTimestampFromUTC,
  getTimeRangeAsString,
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
  isMutating,
  isCtaDisabled = false,
  errorMessage,
  campaignId: campaingIdFromProps,
  couponCode,
}) => {
  const { t } = useTranslation("backdrops", {
    keyPrefix: "select-consultation",
  });
  const { activeCoupon } = useContext(RootContext);
  const [startDate, setStartDate] = useState(null);
  const [currentDay, setCurrentDay] = useState(new Date().getTime());

  const localStorageCountry = localStorage.getItem("country");
  const SHOW_COUPON = localStorageCountry !== "KZ";

  const campaignId = activeCoupon?.campaignId || campaingIdFromProps;

  const providerDataQuery = useGetProviderDataById(providerId, campaignId);
  const providerData = providerDataQuery.data;

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
      campaignId,
    );
    // The API returns { time, duration_minutes, campaign_id, organization_id }
    // for every slot, and has already removed slots that overlap one another -
    // that de-duplication used to live here, which meant the browser owned a
    // booking rule the server had no idea about.
    //
    // `time` is epoch milliseconds, so it goes straight into Date(). It used to
    // be a rendered "YYYY-MM-DD HH:MM:SS UTC" string, which is what parseUTCDate
    // was for; a number needs no parsing and cannot be read in the wrong zone.
    if (campaignId) {
      return data.map((x) => ({
        time: new Date(x.time),
        duration_minutes: x.duration_minutes,
        campaign_id: x.campaign_id,
      }));
    }

    return data.map((x) => ({
      time: new Date(x.time),
      duration_minutes: x.duration_minutes,
      organization_id: x.organization_id,
    }));
  };
  const availableSlotsQuery = useQuery(
    ["available-slots", startDate, currentDay, providerId],
    () => getAvailableSlots(startDate, currentDay, providerId),
    { enabled: !!startDate && !!currentDay && !!providerId },
  );
  const availableSlots = availableSlotsQuery.data;

  const handleDayChange = (start, day) => {
    setStartDate(start);
    setCurrentDay(day);
  };

  const handleChooseSlot = (slot) => {
    setSelectedSlot(slot);
  };

  /** Slots on the day being viewed. Each is bookable at its own length only. */
  const todaySlots = useMemo(
    () =>
      availableSlots?.filter((slot) => {
        const slotDate = new Date(slot.time || slot).getDate();
        const currentDayDate = new Date(currentDay).getDate();

        if (campaignId && campaignId !== slot.campaign_id) return false;
        return slotDate === currentDayDate;
      }) || [],
    [availableSlots, currentDay, campaignId],
  );

  const renderFreeSlots = () => {
    if (!todaySlots || todaySlots?.length === 0)
      return (
        <div className="select-consultation__content-container__slots-empty">
          <p className="select-consultation__no-slots-text">
            {t("no_slots_available")}
          </p>
        </div>
      );

    const options = todaySlots?.map(
      (slot) => {
        const slotLocal = new Date(slot.time || slot);

        const value = new Date(slot.time || slot).getTime();

        // The provider decided this slot's length; the client books it as it
        // stands rather than choosing a duration.
        const label = getTimeRangeAsString(slotLocal, slot.duration_minutes);

        return { label: label, value };
      },
      [availableSlots],
    );

    const isSingleOption = options.length === 1;

    return (
      <div
        className={`select-consultation__time-grid${
          isSingleOption ? " select-consultation__time-grid--single" : ""
        }`}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`select-consultation__time-chip${
              selectedSlot === option.value
                ? " select-consultation__time-chip--selected"
                : ""
            }`}
          >
            <input
              type="radio"
              name="free-slots"
              value={option.value}
              checked={selectedSlot === option.value}
              onChange={() => handleChooseSlot(option.value)}
            />
            <p className="text">{option.label}</p>
          </label>
        ))}
      </div>
    );
  };

  const handleSave = () => {
    let slotObject;
    if (campaignId) {
      slotObject = availableSlots.find((slot) => {
        const isTimeMatching = new Date(slot.time).getTime() === selectedSlot;
        if (!campaignId) {
          return isTimeMatching;
        }
        return isTimeMatching && slot.campaign_id === campaignId;
      });
    } else {
      const allMatchingSlots = availableSlots.filter((slot) => {
        const isTimeMatching = new Date(slot.time).getTime() === selectedSlot;
        return isTimeMatching;
      });

      if (allMatchingSlots.length >= 1) {
        const hasOrganizationSlot = allMatchingSlots.find(
          (slot) => !!slot.organization_id,
        );
        if (hasOrganizationSlot) {
          slotObject = hasOrganizationSlot;
        }
      }
    }
    const time = slotObject || selectedSlot;

    const selectedSlotDuration = todaySlots.find(
      (slot) => new Date(slot.time).getTime() === selectedSlot,
    )?.duration_minutes;

    handleBlockSlot(
      time,
      providerData.consultationPrice,
      selectedSlotDuration,
    );
  };

  return (
    <Backdrop
      classes="select-consultation"
      title="SelectConsultation"
      isOpen={isOpen}
      onClose={onClose}
      // heading={edit === true ? t("heading_edit") : t("heading_new")}
      // text={edit === true ? t("subheading_edit") : t("subheading_new")}
      heading={edit === true ? t("subheading_edit") : t("subheading_new")}
      ctaLabel={t("cta_button_label")}
      ctaHandleClick={handleSave}
      isCtaDisabled={isCtaDisabled ? true : !selectedSlot ? true : false}
      isLoading={providerDataQuery.isLoading || availableSlotsQuery.isLoading}
      isCtaLoading={isMutating}
      errorMessage={errorMessage}
    >
      {SHOW_COUPON && (activeCoupon || couponCode) && (
        <div className="select-consultation__coupon-container">
          <p>
            <strong>
              {t("coupon_code")}: {activeCoupon?.couponValue || couponCode}
            </strong>
          </p>
        </div>
      )}
      {providerDataQuery.isLoading ? (
        <Loading size="lg" />
      ) : !providerData.earliestAvailableSlot ? (
        <p className="select-consultation__no-slots">
          {t("provider_not_available")}
        </p>
      ) : (
        <div className="select-consultation__content-container">
          <Header
            handleDayChange={handleDayChange}
            setStartDate={setStartDate}
            startDate={providerData?.earliestAvailableSlot}
            t={t}
          />
          <div className="select-consultation__content-container__slots">
            {availableSlotsQuery.isLoading ? (
              <Loading size="md" />
            ) : (
              renderFreeSlots()
            )}
          </div>
        </div>
      )}
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
