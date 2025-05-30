import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
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
  Dropdown,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import { useEventListener, useGetLanguages } from "#hooks";

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
  selectedLanguage,
  setSelectedLanguage,
  setShouldFetchQuestions,
}) => {
  const { t } = useTranslation("my-qa");
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");

  const { data: languages } = useGetLanguages();

  const handler = useCallback(() => {
    const lang = localStorage.getItem("language");
    const languageId = languages?.find((x) => x.alpha2 === lang)?.language_id;
    setSelectedLanguage(languageId || "all");
  }, [languages]);

  useEventListener("languageChanged", handler);

  useEffect(() => {
    if (languages?.length) {
      const currentLang = localStorage.getItem("language");
      const langObject = languages.find((x) => x.alpha2 === currentLang);
      setSelectedLanguage(langObject?.language_id || "all");
      setShouldFetchQuestions(true);
    }
  }, [languages]);

  const languageOptions = useMemo(() => {
    const showAllOption = {
      value: "all",
      label: t("all_languages"),
    };

    if (!languages) return [showAllOption];

    return [
      showAllOption,
      ...languages.map((x) => ({
        value: x.language_id,
        label: x.local_name,
      })),
    ];
  }, [languages, t]);

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

  const handleProviderClick = (providerId) => {
    navigate(`/provider-overview?provider-id=${providerId}`);
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
        const isTitleMatching = question.answerTitle
          ?.toLowerCase()
          .includes(value);
        const isTextMatching = question.answerText
          ?.toLowerCase()
          .includes(value);
        const isTagMatching = question.tags?.find((x) =>
          x.toLowerCase().includes(value)
        );
        const isQuestionMatching = question.question
          ?.toLowerCase()
          .includes(value);

        const isMatching =
          isTitleMatching ||
          isTextMatching ||
          isTagMatching ||
          isQuestionMatching
            ? true
            : false;
        return !!isMatching;
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
          handleProviderClick={handleProviderClick}
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
            <GridItem
              md={8}
              lg={12}
              classes="my-qa__tabs-grid__search-container"
            >
              <InputSearch
                placeholder={t("search_placeholder")}
                value={searchValue}
                onChange={(value) => setSearchValue(value.toLowerCase())}
                classes="my-qa__tabs-grid__search-container__input"
              />
              <Dropdown
                options={languageOptions}
                selected={selectedLanguage}
                setSelected={(lang) => {
                  console.log(lang);
                  setSelectedLanguage(lang);
                }}
                placeholder={t("placeholder")}
                classes="my-qa__categories-item__language-dropdown"
              />
            </GridItem>
            <GridItem
              md={8}
              lg={8}
              classes="my-qa__tabs-grid__filter-button-item"
            >
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
              <div>
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
              </div>
            </GridItem>
            <GridItem md={8} lg={4} classes="my-qa__button-item">
              <Button
                label={t("ask_button_label")}
                size={width < 980 && width > 768 ? "lg" : "lg"}
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
              {t("no_answers_found")}
            </p>
          )}
        </GridItem>
      </Grid>
    </Block>
  );
};
