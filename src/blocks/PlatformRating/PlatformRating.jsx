import React, { useState } from "react";
import {
  Block,
  Grid,
  GridItem,
  Rating,
  Textarea,
  Button,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./platform-rating.scss";

/**
 * PlatformRating
 *
 * PlatformRating block
 *
 * @return {jsx}
 */
export const PlatformRating = () => {
  const { t } = useTranslation("platform-rating");

  const [data, setData] = useState({
    rating: null,
    comment: "",
  });

  const handleSendRating = () => {
    console.log(`Rating sent: ${data.rating} - ${data.comment}`);
  };

  const handleChange = (field, value) => {
    const newData = { ...data };

    newData[field] = value;

    setData(newData);
  };

  const canContinue = data.rating === null;

  return (
    <Block classes="platform-rating">
      <Grid md={8} lg={12} classes="platform-rating__grid">
        <GridItem md={8} lg={12} classes="platform-rating__grid__item">
          <Rating
            label={t("rating_label")}
            changeOnHoverEnabled
            setParentState={(value) => handleChange("rating", value)}
          />
          <Textarea
            label={t("textarea_label")}
            placeholder={t("textarea_placeholder")}
            onChange={(value) => handleChange("comment", value)}
            classes="platform-rating__grid__item__textarea"
          />
          <Button
            label={t("button_label")}
            size="lg"
            onClick={() => handleSendRating()}
            disabled={canContinue}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
