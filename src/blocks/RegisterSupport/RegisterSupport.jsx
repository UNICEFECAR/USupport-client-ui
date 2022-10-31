import React from "react";
import {
  Block,
  Grid,
  GridItem,
  RadioButtonSelectorGroup,
  Button,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

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

  const [data, setData] = React.useState("");

  const options = [
    { label: t("answer_yes_label"), value: true },
    { label: t("answer_no_label"), value: false },
  ];

  const handleContinue = () => {
    console.log("Continue");
  };

  const canContinue = data !== null;

  return (
    <Block classes="register-support">
      <Grid md={8} lg={12} classes="register-support__grid">
        <GridItem md={8} lg={12} classes="register-support__grid__content-item">
          <RadioButtonSelectorGroup
            name="doYouNeedHelp"
            options={options}
            selected={data}
            setSelected={setData}
          />
          <Button
            disabled={!canContinue}
            label={t("button_continue_label")}
            size="lg"
            onClick={() => handleContinue()}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
