import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  Block,
  Rating,
  Textarea,
  NewButton,
  Error,
} from "@USupport-components-library/src";

import { useAddPlatformRating } from "#hooks";
import { mascotHappyBlue } from "@USupport-components-library/assets";

import "./platform-rating.scss";

/**
 * PlatformRating
 *
 * PlatformRating block
 *
 * @return {jsx}
 */
export const PlatformRating = () => {
  const { t } = useTranslation("blocks", { keyPrefix: "platform-rating" });

  const [data, setData] = useState({
    rating: 5,
    comment: "",
  });

  const [errors, setErrors] = useState({});

  const onSuccess = () => {
    toast(t("success"));
    setData({
      rating: 5,
      comment: "",
    });
  };
  const onError = (error) => {
    setErrors({ submit: error });
  };
  const addRatingMutation = useAddPlatformRating(onSuccess, onError);

  const handleSendRating = () => {
    addRatingMutation.mutate(data);
  };

  const handleChange = (field, value) => {
    const newData = { ...data };

    newData[field] = value;

    setData(newData);
  };

  const canContinue = data.rating === null;

  return (
    <Block classes="platform-rating">
      <div className="platform-rating__content-wrapper">
        <div className="platform-rating__content-wrapper__left">
          <Rating
            label={t("rating_label")}
            changeOnHoverEnabled
            setParentState={(value) => handleChange("rating", value)}
            rating={data.rating}
          />
          <Textarea
            label={t("textarea_label")}
            placeholder={t("textarea_placeholder")}
            onChange={(value) => handleChange("comment", value)}
            classes="platform-rating__textarea"
            value={data.comment}
          />
          {errors.submit && <Error error={errors.submit} />}
          <NewButton
            label={t("button_label")}
            size="lg"
            onClick={() => handleSendRating()}
            disabled={canContinue}
            loading={addRatingMutation.isLoading}
          />
        </div>
        <div className="platform-rating__content-wrapper__right">
          <img src={mascotHappyBlue} alt="mascot" />
        </div>
      </div>
    </Block>
  );
};
