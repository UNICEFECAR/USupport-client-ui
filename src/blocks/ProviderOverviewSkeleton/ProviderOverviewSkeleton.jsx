import React from "react";
import { Icon } from "@USupport-components-library/src";

import "./provider-overview-skeleton.scss";

/**
 * ProviderOverviewSkeleton
 *
 * Reusable skeleton for provider overview cards.
 *
 * @returns {jsx}
 */
export const ProviderOverviewSkeleton = ({ t = (key) => key }) => {
  return (
    <div className="provider-overview-skeleton">
      <div className="provider-overview-skeleton__tag shimmer" />
      <div className="provider-overview-skeleton__top">
        <div className="provider-overview-skeleton__avatar shimmer" />
        <div className="provider-overview-skeleton__main">
          <div className="provider-overview-skeleton__line provider-overview-skeleton__line--title shimmer" />
          <div className="provider-overview-skeleton__line provider-overview-skeleton__line--subtitle shimmer" />
        </div>
      </div>

      <div className="provider-overview-skeleton__separator shimmer" />

      <div className="provider-overview-skeleton__earliest">
        <p className="text provider-overview-skeleton__earliest-text">
          {t("earliest_available_slot")}
        </p>

        <div className="provider-overview-skeleton__date-row">
          <div className="provider-overview-skeleton__date-item">
            <Icon name="calendar" size="sm" />
            <div className="provider-overview-skeleton__line provider-overview-skeleton__line--date shimmer" />
          </div>
          <div className="provider-overview-skeleton__date-item">
            <Icon name="time" size="sm" />
            <div className="provider-overview-skeleton__line provider-overview-skeleton__line--time shimmer" />
          </div>
        </div>
      </div>

      <div className="provider-overview-skeleton__separator shimmer" />

      <div className="provider-overview-skeleton__actions">
        <div className="provider-overview-skeleton__button shimmer" />
        <div className="provider-overview-skeleton__button provider-overview-skeleton__button--primary shimmer" />
      </div>
    </div>
  );
};
