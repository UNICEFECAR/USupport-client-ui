import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Block,
  Grid,
  GridItem,
  Tabs,
  Button,
  Answer,
  InputSearch,
  ButtonWithIcon,
} from "@USupport-components-library/src";

import "./my-qa.scss";

/**
 * MyQA
 *
 * MyQA block
 *
 * @return {jsx}
 */
export const MyQA = ({
  handleAskAnonymous,
  handleReadMore,
  handleLike,
  handleScheduleConsultationClick,
  questions,
  tabs,
  setTabs,
  isUserQuestionsEnabled,
  handleFilterTags,
  filterTag,
}) => {
  const { t } = useTranslation("my-qa");

  const [searchValue, setSearchValue] = useState("");

  const handleTabChange = (index) => {
    const tabsCopy = [...tabs];

    for (let i = 0; i < tabsCopy.length; i++) {
      if (i === index) {
        tabsCopy[i].isSelected = true;
      } else {
        tabsCopy[i].isSelected = false;
      }
    }
    setTabs(tabsCopy);
  };

  const renderQuestions = () => {
    return questions.map((question, index) => {
      if (filterTag) {
        const tags = question.tags;
        if (!tags.includes(filterTag)) {
          return null;
        }
      }

      if (searchValue) {
        if (
          !question.answerTitle
            .toLowerCase()
            .includes(searchValue.toLowerCase()) &&
          !question.answerText.toLowerCase().includes(searchValue.toLowerCase())
        )
          return null;
      }

      return (
        <Answer
          question={question}
          key={index}
          classes="my-qa__answer"
          isInYourQuestions={isUserQuestionsEnabled}
          handleLike={handleLike}
          handleReadMore={() => handleReadMore(question)}
          handleScheduleConsultationClick={handleScheduleConsultationClick}
          t={t}
        />
      );
    });
  };

  return (
    <Block classes="my-qa">
      <Grid>
        <GridItem xs={4} md={8} lg={12}>
          <GridItem md={8} lg={12}>
            <div className="my-qa__search-input-container">
              <InputSearch
                placeholder={t("search_placeholder")}
                value={searchValue}
                onChange={(value) => setSearchValue(value.toLowerCase())}
              />
              <ButtonWithIcon
                label={t("filter")}
                iconName="filter"
                iconColor="#ffffff"
                iconSize="sm"
                color="purple"
                size="xs"
                classes="customers-qa__search-input-container__button"
                onClick={handleFilterTags}
              />
            </div>
          </GridItem>
          <Grid classes="my-qa__tabs-grid">
            <GridItem md={5} lg={7} classes="my-qa__categories-item">
              <Tabs
                options={tabs.map((tab) => {
                  return {
                    label: t(tab.value),
                    value: tab.value,
                    isSelected: tab.isSelected,
                  };
                })}
                handleSelect={handleTabChange}
              />
            </GridItem>
            <GridItem md={3} lg={5}>
              <Button
                label={t("ask_button_label")}
                size="lg"
                classes="my-qa__ask-question-button"
                onClick={handleAskAnonymous}
              />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem xs={4} md={8} lg={12}>
          {questions?.length > 0 && (
            <div className="my-qa__answers-container">{renderQuestions()}</div>
          )}
        </GridItem>
      </Grid>
    </Block>
  );
};
