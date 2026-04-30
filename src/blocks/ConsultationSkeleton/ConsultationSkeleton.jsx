import React from "react";
import { Icon } from "@USupport-components-library/src";

import "./consultation-skeleton.scss";

/**
 * ConsultationSkeletonCard
 *
 * Reusable consultation card skeleton.
 *
 * @returns {jsx}
 */
export const ConsultationSkeletonCard = ({ withActions = false }) => {
  return (
    <div className="consultation-skeleton">
      <div className="consultation-skeleton__tag shimmer" />
      <div className="consultation-skeleton__top">
        <div className="consultation-skeleton__avatar shimmer" />
        <div className="consultation-skeleton__main">
          <div className="consultation-skeleton__line consultation-skeleton__line--title shimmer" />
          <div className="consultation-skeleton__line consultation-skeleton__line--subtitle shimmer" />
        </div>
      </div>
      <div className="consultation-skeleton__separator shimmer" />
      <div className="consultation-skeleton__date-row">
        <div className="consultation-skeleton__date-item">
          <Icon name="calendar" size="sm" />
          <div className="consultation-skeleton__line consultation-skeleton__line--date shimmer" />
        </div>
        <div className="consultation-skeleton__date-item">
          <Icon name="time" size="sm" />
          <div className="consultation-skeleton__line consultation-skeleton__line--time shimmer" />
        </div>
      </div>
      {withActions && (
        <>
          <div className="consultation-skeleton__separator shimmer" />
          <div className="consultation-skeleton__actions">
            <div className="consultation-skeleton__button consultation-skeleton__button--primary shimmer" />
            <div className="consultation-skeleton__button shimmer" />
          </div>
        </>
      )}
    </div>
  );
};
