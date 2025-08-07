import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Backdrop,
  DropdownWithLabel,
  Loading,
} from "@USupport-components-library/src";
import { useGetQuestionsTags } from "#hooks";
import "./filter-questions.scss";

/**
 * FilterQuestions
 *
 * The FilterQuestions backdrop
 *
 * @return {jsx}
 */
export const FilterQuestions = ({ isOpen, onClose, setTag }) => {
  const { t } = useTranslation("backdrops", { keyPrefix: "filter-questions" });

  const [tags, setTags] = useState([]);

  const onSuccess = (data) => {
    setTags(data);
  };
  const tagsQuery = useGetQuestionsTags(onSuccess);

  const [selectedTagId, setSelectedTagId] = useState();

  const handleSave = () => {
    const selectedTag = tags.find((tag) => tag.id === selectedTagId).label;
    setTag(selectedTag);
    onClose();
  };

  const handleResetFilter = () => {
    setSelectedTagId(null);
    setTag(null);
    onClose();
  };

  return (
    <Backdrop
      classes="filter-questions"
      title="FilterQuestions"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      ctaLabel={t("cta_label")}
      ctaHandleClick={handleSave}
      secondaryCtaLabel={t("secondary_cta_label")}
      secondaryCtaHandleClick={handleResetFilter}
      secondaryCtaType="secondary"
    >
      {tagsQuery.isLoading ? (
        <Loading />
      ) : (
        <div className="filter-questions__dropdown-wrapper">
          <DropdownWithLabel
            label={t("dropdown_label")}
            options={tags.map((tag) => {
              return { value: tag.id, ...tag };
            })}
            className="filter-questions__dropdown"
            selected={selectedTagId}
            setSelected={setSelectedTagId}
            placeholder={t("dropdown_placeholder")}
          />
        </div>
      )}
    </Backdrop>
  );
};
