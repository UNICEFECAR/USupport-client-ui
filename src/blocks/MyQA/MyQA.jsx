import React, { useCallback, useMemo, useEffect, useState } from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useTranslation } from "react-i18next";

import {
  Block,
  Grid,
  GridItem,
  TabsUnderlined,
  Tabs,
  NewButton,
  Answer,
  Loading,
  Dropdown,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import { useEventListener, useGetLanguages, useGetQuestionsTags } from "#hooks";

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
  filterTag,
  setFilterTag,
  isQuestionsDataLoading,
  selectedLanguage,
  setSelectedLanguage,
  setShouldFetchQuestions,
  searchValue,
}) => {
  const { t } = useTranslation("blocks", { keyPrefix: "my-qa" });
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const { data: languages } = useGetLanguages();
  const [tags, setTags] = useState([]);

  const onTagsSuccess = useCallback((data) => {
    setTags(data);
  }, []);

  useGetQuestionsTags(onTagsSuccess);

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

  const getTagsOptions = useMemo(() => {
    return tags.map((tag) => ({
      label: tag.label,
      value: tag.id,
      isSelected: filterTag === tag.label,
    }));
  }, [tags, filterTag]);

  const handleTagSelect = (index) => {
    const selectedTag = tags[index];
    if (selectedTag && setFilterTag) {
      // If clicking the same tag, clear the filter; otherwise set it
      if (filterTag === selectedTag.label) {
        setFilterTag("");
      } else {
        setFilterTag(selectedTag.label);
      }
    }
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
          x.toLowerCase().includes(value),
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
        <GridItem key={index} md={8} lg={6}>
          <Answer
            question={question}
            classes="my-qa__answer"
            isInYourQuestions={isUserQuestionsEnabled}
            handleLike={handleLike}
            handleReadMore={() => handleReadMore(question)}
            handleScheduleConsultationClick={handleScheduleConsultationClick}
            handleProviderClick={handleProviderClick}
            t={t}
          />
        </GridItem>
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
              <Grid>
                <GridItem md={4} lg={6}>
                  <div className="my-qa__tabs-grid__search-container__tabs">
                    <TabsUnderlined
                      textType="h3"
                      options={tabs.map((tab) => {
                        return {
                          label: t(tab.value),
                          value: tab.value,
                          isSelected: tab.isSelected,
                        };
                      })}
                      handleSelect={handleTabChange}
                    />
                  </div>
                </GridItem>
                <GridItem md={4} lg={6}>
                  <div className="my-qa__tabs-grid__search-container__dropdown">
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
                  </div>
                </GridItem>
              </Grid>
            </GridItem>
            {tags.length > 0 && (
              <GridItem
                md={8}
                lg={12}
                classes="my-qa__tabs-grid__tags-container"
              >
                <Tabs
                  options={getTagsOptions}
                  handleSelect={handleTagSelect}
                  t={t}
                />
              </GridItem>
            )}
            <GridItem
              md={8}
              lg={12}
              classes="my-qa__tabs-grid__filter-button-item"
            ></GridItem>
            <GridItem md={8} lg={12} classes="my-qa__button-item">
              <NewButton
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
            <Grid classes="my-qa__answers-container">{renderQuestions()}</Grid>
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
