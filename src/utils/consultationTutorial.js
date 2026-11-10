import { getConsultationEndDate } from "@USupport-components-library/utils";

export const getConsultationTutorialKey = (consultations = [], now = Date.now()) => {
  if (consultations.some((item) => item.status === "scheduled" && item.timestamp > now)) {
    return "change-or-cancel";
  }

  if (consultations.some((item) =>
    ["scheduled", "finished"].includes(item.status) &&
    getConsultationEndDate(item.timestamp, item.durationMinutes).getTime() < now
  )) {
    return "past-sessions";
  }

  return null;
};
