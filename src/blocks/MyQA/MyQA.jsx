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
  Loading,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

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
  isQuestionsDataLoading,
}) => {
  const { t } = useTranslation("my-qa");
  const { width } = useWindowDimensions();

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
    const filteredQuestions = questions.filter((question) => {
      if (filterTag) {
        const tags = question.tags;
        if (!tags.includes(filterTag)) {
          return null;
        }
      }
      const value = searchValue.toLowerCase();

      if (value) {
        if (
          !question.answerTitle?.toLowerCase().includes(value) &&
          !question.answerText?.toLowerCase().includes(value) &&
          !question.tags?.find((x) => x.toLowerCase().includes(value))
        )
          return null;
      }
      return true;
    });

    if (!filteredQuestions.length)
      return (
        <GridItem md={8} lg={12}>
          <p>{t("no_answers_found")}</p>
        </GridItem>
      );

    return filteredQuestions.map((question, index) => {
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
          <Grid classes="my-qa__tabs-grid">
            <GridItem md={5} lg={7}>
              <InputSearch
                placeholder={t("search_placeholder")}
                value={searchValue}
                onChange={(value) => setSearchValue(value.toLowerCase())}
              />
            </GridItem>
            <GridItem
              md={3}
              lg={5}
              classes="my-qa__tabs-grid__filter-button-item"
            >
              <ButtonWithIcon
                label={t("filter")}
                iconName="filter"
                iconColor="#ffffff"
                iconSize="sm"
                color="purple"
                size="sm"
                onClick={handleFilterTags}
                classes="my-qa__tabs-grid__filter-button"
              />
            </GridItem>
            <GridItem md={6} lg={7} classes="my-qa__categories-item">
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
            <GridItem md={2} lg={5} classes="my-qa__button-item">
              <Button
                label={t("ask_button_label")}
                size={width < 980 && width > 768 ? "sm" : "lg"}
                classes="my-qa__ask-question-button"
                onClick={handleAskAnonymous}
              />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem xs={4} md={8} lg={12}>
          {questions?.length > 0 ? (
            <div className="my-qa__answers-container">{renderQuestions()}</div>
          ) : isQuestionsDataLoading ? (
            <Loading />
          ) : (
            <p className="paragraph my-qa__answers-container__no-questions">
              {t("no_questions_found")}
            </p>
          )}
        </GridItem>
      </Grid>
    </Block>
  );
};
