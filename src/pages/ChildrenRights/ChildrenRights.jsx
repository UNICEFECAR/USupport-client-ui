
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useTranslation,Trans } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { Page } from "#blocks";
import { useCustomNavigate as useNavigate, useGetOrganizationMetadata } from "#hooks";

import {
  Block,
  Button,
  Grid,
  GridItem,
  RadioButtonSelector,
  CheckBox,
  Loading,
  ArticlesGrid,
} from "@USupport-components-library/src";
import { cmsSvc } from "@USupport-components-library/services";

import "./children-rights.scss";
import { useSearchParams } from "react-router-dom";

// Screen definitions with all navigation logic
// For dynamic screens, use metadataField instead of answers
const SCREENS = {
  // ==================== NON-EMERGENCY FLOW ====================
  "non-emergency": {
    type: "question",
    inputType: "single",
    titleKey: "non_emergency_title",
    paragraphKey: "non_emergency_paragraph",
    questionKey: "non_emergency_question",
    answers: [
      { id: "new", labelKey: "non_emergency_answer_1", nextScreen: "untitled-q1" },
      { id: "recurring-no-pro", labelKey: "non_emergency_answer_2", nextScreen: "untitled-q1" },
      { id: "recurring-pro", labelKey: "non_emergency_answer_3", nextScreen: "final-q1" },
    ],
  },

  // Untitled Section - 5 questions (uses metadata for answers)
  "untitled-q1": {
    type: "form-question",
    inputType: "multi",
    questionKey: "untitled_q1_question",
    formField: "specialisation",
    filterSpecialisations: [ // Show only some specialisations for this section
      "pediatric_psychiatry",
      "psychological_evaluation",
      "psychological_counseling",
      "individual_psychotherapy",
    ],
    metadataField: "specialisations", // Dynamic from metadata
    metadataIdField: "organizationSpecialisationId",
    nextScreen: "untitled-q2",
  },
  "untitled-q2": {
    type: "form-question",
    inputType: "single",
    questionKey: "untitled_q2_question",
    formField: "district",
    metadataField: "districts", // Dynamic from metadata
    metadataIdField: "districtId",
    nextScreen: "untitled-q3",
  },
  "untitled-q3": {
    type: "form-question",
    inputType: "single",
    questionKey: "untitled_q3_question",
    formField: "propertyType",
    metadataField: "propertyTypes", // Dynamic from metadata
    metadataIdField: "organizationPropertyTypeId",
    nextScreen: "untitled-q4",
  },
  "untitled-q4": {
    type: "form-question",
    inputType: "single",
    questionKey: "untitled_q4_question",
    formField: "paymentMethod",
    metadataField: "paymentMethods", // Dynamic from metadata
    metadataIdField: "paymentMethodId",
    nextScreen: "untitled-q5",
  },
  "untitled-q5": {
    type: "form-question",
    inputType: "single",
    questionKey: "untitled_q5_question",
    formField: "userInteraction",
    metadataField: "userInteractions", // Dynamic from metadata
    metadataIdField: "userInteractionId",
    nextScreen: "submit-untitled",
    isLastFormQuestion: true,
  },

  // Final Section - 4 questions (uses metadata for answers)
  "final-q1": {
    type: "form-question",
    inputType: "multi",
    questionKey: "final_q1_question",
    formField: "specialisations",
    metadataField: "specialisations", // Dynamic from metadata - all specialisations
    metadataIdField: "organizationSpecialisationId",
    nextScreen: "final-q2",
  },
  "final-q2": {
    type: "form-question",
    inputType: "single",
    questionKey: "final_q2_question",
    formField: "district",
    metadataField: "districts", // Dynamic from metadata
    metadataIdField: "districtId",
    nextScreen: "final-q3",
  },
  "final-q3": {
    type: "form-question",
    inputType: "single",
    questionKey: "final_q3_question",
    formField: "propertyType",
    metadataField: "propertyTypes", // Dynamic from metadata
    metadataIdField: "organizationPropertyTypeId",
    nextScreen: "final-q4",
  },
  "final-q4": {
    type: "form-question",
    inputType: "single",
    questionKey: "final_q4_question",
    formField: "paymentMethod",
    metadataField: "paymentMethods", // Dynamic from metadata
    metadataIdField: "paymentMethodId",
    nextScreen: "submit-final",
    isLastFormQuestion: true,
  },

  // ==================== RIGHTS FLOW ====================
  "rights-intro": {
    type: "question",
    inputType: "single",
    titleKey: "rights_intro_title",
    paragraphKey: "rights_intro_paragraph",
    questionKey: "rights_intro_question",
    answers: [
      { id: "schools", labelKey: "rights_intro_answer_1", nextScreen: "section-2" },
      { id: "social_care", labelKey: "rights_intro_answer_2", nextScreen: "section-8" },
      { id: "health_system", labelKey: "rights_intro_answer_3", nextScreen: "section-11" },
    ],
  },

  // Section 2 - Services provided in schools
  "section-2": {
    type: "question",
    inputType: "single",
    titleKey: "section_2_title",
    questionKey: "section_2_question",
    answers: [
      { id: "all_students", labelKey: "section_2_answer_1", nextScreen: "section-3" },
      { id: "sen_students", labelKey: "section_2_answer_2", nextScreen: "section-4" },
      { id: "pregnant_students", labelKey: "section_2_answer_3", nextScreen: "section-5" },
      { id: "violence_victims", labelKey: "section_2_answer_4", nextScreen: "section-6" },
      { id: "disciplined_students", labelKey: "section_2_answer_5", nextScreen: "section-7" },
    ],
  },

  // Section 3 - Services for all students (Content)
  "section-3": {
    type: "content",
    titleKey: "section_3_title",
    paragraphKey: "section_3_paragraph",
    sectionNumber: 12,
  },

  // Section 4 - Services for SEN students (Content)
  "section-4": {
    type: "content",
    titleKey: "section_4_title",
    paragraphKey: "section_4_paragraph",
    sectionNumber: 4,
  },

  // Section 5 - Services for pregnant students (Content)
  "section-5": {
    type: "content",
    titleKey: "section_5_title",
    paragraphKey: "section_5_paragraph",
    sectionNumber: 5,
  },

  // Section 6 - Services for violence victims (Content)
  "section-6": {
    type: "content",
    titleKey: "section_6_title",
    paragraphKey: "section_6_paragraph",
    sectionNumber: 6,
  },

  // Section 7 - Disciplined students (Content)
  "section-7": {
    type: "content",
    titleKey: "section_7_title",
    paragraphKey: "section_7_paragraph",
    sectionNumber: 7,
  },

  // Section 8 - Services in social care system
  "section-8": {
    type: "question",
    inputType: "single",
    titleKey: "section_8_title",
    questionKey: "section_8_question",
    answers: [
      { id: "violence_by_parents", labelKey: "section_8_answer_1", nextScreen: "section-9" },
      { id: "day_care_centers", labelKey: "section_8_answer_2", nextScreen: "section-10" },
      { id: "residential_centers", labelKey: "section_8_answer_3", nextScreen: "section-10" },
      { id: "emergency_reception", labelKey: "section_8_answer_4", nextScreen: "section-10" },
      { id: "night_shelters", labelKey: "section_8_answer_5", nextScreen: "section-10" },
    ],
  },

  // Section 9 - Violence by parents (Content)
  "section-9": {
    type: "content",
    titleKey: "section_9_title",
    paragraphKey: "section_9_paragraph",
    sectionNumber: 9,
  },

  // Section 10 - Social care centers (Content)
  "section-10": {
    type: "content",
    titleKey: "section_10_title",
    paragraphKey: "section_10_paragraph",
    sectionNumber: 10,
  },

  // Section 11 - Services in health system
  "section-11": {
    type: "question",
    inputType: "single",
    titleKey: "section_11_title",
    questionKey: "section_11_question",
    answers: [
      { id: "children_0_18", labelKey: "section_11_answer_1", nextScreen: "section-12" },
      { id: "various_conditions", labelKey: "section_11_answer_2", nextScreen: "section-13" },
      { id: "mental_disorders", labelKey: "section_11_answer_3", nextScreen: "section-14" },
    ],
  },

  // Section 12 - Children 0-18 services (Content)
  "section-12": {
    type: "content",
    titleKey: "section_12_title",
    paragraphKey: "section_12_paragraph",
    sectionNumber: 12,
  },

  // Section 13 - Various conditions (Content)
  "section-13": {
    type: "content",
    titleKey: "section_13_title",
    paragraphKey: "section_13_paragraph",
    sectionNumber: 13,
  },

  // Section 14 - Mental disorders (Content)
  "section-14": {
    type: "content",
    titleKey: "section_14_title",
    paragraphKey: "section_14_paragraph",
    sectionNumber: 14,
  },
};

/**
 * ChildrenRights
 *
 * Multi-screen flow for children's rights and non-emergency situations
 *
 * @returns {JSX.Element}
 */
export const ChildrenRights = () => {
  const { t } = useTranslation("pages", { keyPrefix: "children-rights-page" });
  const { t: tOrg } = useTranslation("blocks", { keyPrefix: "organizations" });
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const startParam = searchParams.get("start");

  const [state, setState] = useState({
    currentScreen: startParam || "non-emergency",
    navigationHistory: [],
    selectedAnswer: null,
    selectedAnswers: [],
    formData: {},
    screenAnswers: {}, // Store answers for all screens (screenId -> answer value)
  });
  const { data: metadata, isLoading: isMetadataLoading } =
    useGetOrganizationMetadata();

  const currentScreenData = SCREENS[state.currentScreen];
  const { i18n } = useTranslation();

  // Fetch articles for content screens based on sectionNumber
  const { data: articlesData, isLoading: isArticlesLoading } = useQuery(
    ["children-rights-articles", currentScreenData?.sectionNumber, i18n.language],
    async () => {
      if (currentScreenData?.sectionNumber === undefined || currentScreenData?.sectionNumber === null) {
        return { data: [], meta: { pagination: { total: 0 } } };
      }
      
      // Search for articles that match the decision_tree_section field
      const { data } = await cmsSvc.getArticles({
        decisionTreeSection: currentScreenData.sectionNumber,
        locale: i18n.language,
        populate: true,
      });
      
      return data;
    },
    {
      enabled: currentScreenData?.type === "content" && currentScreenData?.sectionNumber !== undefined && currentScreenData?.sectionNumber !== null,
      refetchOnWindowFocus: false,
    }
  );

  const articles = articlesData?.data || [];

  // Restore saved answer when screen changes (if navigating back to a previously answered screen)
  useEffect(() => {
    if (currentScreenData && state.currentScreen) {
      const savedAnswer = state.screenAnswers[state.currentScreen];
      
      // Restore answer if we have a saved one and no current selection
      if (savedAnswer !== undefined) {
        if (currentScreenData.inputType === "multi") {
          const savedArray = Array.isArray(savedAnswer) ? savedAnswer : [];
          if (state.selectedAnswers.length === 0 && savedArray.length > 0) {
            setState((prev) => ({
              ...prev,
              selectedAnswers: savedArray,
            }));
          }
        } else {
          if (state.selectedAnswer === null && savedAnswer !== null) {
            setState((prev) => ({
              ...prev,
              selectedAnswer: savedAnswer,
            }));
          }
        }
      }
    }
  }, [state.currentScreen]); // Only depend on currentScreen to avoid loops

  // Helper function to get the translation key based on metadata field type
  const getTranslationKey = useCallback((metadataField, name) => {
    // UserInteractions need "_interaction" suffix
    if (metadataField === "userInteractions") {
      return `${name}_interaction`;
    }
    // All other fields use the name directly
    return name;
  }, []);

  // Helper function to get answers from metadata for dynamic screens
  const getAnswersFromMetadata = useCallback(
    (screen) => {
      if (!screen.metadataField || !metadata) return screen.answers || [];

      let metadataItems = metadata[screen.metadataField] || [];

      if (screen.filterSpecialisations) {
        metadataItems = metadataItems.filter((item) =>
          screen.filterSpecialisations.includes(item.name)
        );
      }

      return metadataItems
        .map((item) => ({
          id: item[screen.metadataIdField],
          labelKey: getTranslationKey(screen.metadataField, item.name),
          name: item.name,
          isFromMetadata: true, // Flag to use tOrg for translation
        }))
        .sort((a, b) => tOrg(a.labelKey).localeCompare(tOrg(b.labelKey)));
    },
    [metadata, tOrg, getTranslationKey]
  );

  // Get current screen answers (either static or from metadata)
  const currentAnswers = useMemo(() => {
    if (!currentScreenData) return [];
    if (currentScreenData.metadataField) {
      return getAnswersFromMetadata(currentScreenData);
    }
    return currentScreenData.answers || [];
  }, [currentScreenData, getAnswersFromMetadata]);

  // Placeholder function for content redirection
  const handleRedirectToContent = useCallback(() => {
    navigate("/information-portal/articles")
    // TODO: Implement actual content routing
  }, []);

  // Handle single answer selection
  const handleAnswerSelect = useCallback((answerId) => {
    setState((prev) => ({
      ...prev,
      selectedAnswer: answerId,
    }));
  }, []);

  // Handle multi-select answer toggle
  const handleMultiSelect = useCallback((answerId) => {
    setState((prev) => {
      const isSelected = prev.selectedAnswers.includes(answerId);
      return {
        ...prev,
        selectedAnswers: isSelected
          ? prev.selectedAnswers.filter((id) => id !== answerId)
          : [...prev.selectedAnswers, answerId],
      };
    });
  }, []);

  // Navigate to next screen
  const handleNext = useCallback(() => {
    const screen = currentScreenData;

    if (screen.type === "question") {
      // For question screens, find the selected answer and navigate to its nextScreen
      const selectedAnswerData = currentAnswers.find(
        (a) => a.id === state.selectedAnswer
      );
      if (selectedAnswerData?.nextScreen) {
        // Save the current answer before navigating
        const answerValue = state.selectedAnswer;
        setState((prev) => ({
          ...prev,
          navigationHistory: [...prev.navigationHistory, prev.currentScreen],
          currentScreen: selectedAnswerData.nextScreen,
          screenAnswers: {
            ...prev.screenAnswers,
            [prev.currentScreen]: answerValue,
          },
          selectedAnswer: null,
          selectedAnswers: [],
        }));
      }
    } else if (screen.type === "form-question") {
      // For form questions, save the answer and navigate to next screen
      const answerValue =
        screen.inputType === "multi"
          ? state.selectedAnswers
          : state.selectedAnswer;

      setState((prev) => ({
        ...prev,
        navigationHistory: [...prev.navigationHistory, prev.currentScreen],
        currentScreen: screen.nextScreen,
        formData: {
          ...prev.formData,
          [screen.formField]: answerValue,
        },
        screenAnswers: {
          ...prev.screenAnswers,
          [prev.currentScreen]: answerValue,
        },
        selectedAnswer: null,
        selectedAnswers: [],
      }));
    }
  }, [currentScreenData, currentAnswers, state.selectedAnswer, state.selectedAnswers]);

  // Navigate back
  const handleBack = useCallback(() => {
    if (state.navigationHistory.length > 0) {
      const previousScreen =
        state.navigationHistory[state.navigationHistory.length - 1];
      const previousScreenData = SCREENS[previousScreen];

      // Restore the previous answer from screenAnswers or formData
      let restoredAnswer = null;
      let restoredAnswers = [];

      // First check screenAnswers (works for all screen types)
      const savedAnswer = state.screenAnswers[previousScreen];
      
      if (previousScreenData?.type === "form-question") {
        // For form questions, prefer formData but fallback to screenAnswers
        const formDataValue = state.formData[previousScreenData.formField];
        const valueToUse = formDataValue !== undefined ? formDataValue : savedAnswer;
        
        if (previousScreenData.inputType === "multi") {
          restoredAnswers = Array.isArray(valueToUse) ? valueToUse : [];
        } else {
          restoredAnswer = valueToUse || null;
        }
      } else if (previousScreenData?.type === "question") {
        // For regular question screens, use screenAnswers
        restoredAnswer = savedAnswer || null;
      }

      setState((prev) => ({
        ...prev,
        navigationHistory: prev.navigationHistory.slice(0, -1),
        currentScreen: previousScreen,
        selectedAnswer: restoredAnswer,
        selectedAnswers: restoredAnswers,
      }));
    }
  }, [state.navigationHistory, state.formData, state.screenAnswers]);


  // Handle form submission (for untitled and final sections)
  const handleFormSubmit = useCallback(() => {
    const screen = currentScreenData;

    // Include the current screen's answer in formData (since it hasn't been saved yet)
    const currentAnswerValue =
      screen.inputType === "multi"
        ? state.selectedAnswers
        : state.selectedAnswer;

    const updatedFormData = {
      ...state.formData,
      [screen.formField]: currentAnswerValue,
    };

    // Build query params for organizations page
    const params = new URLSearchParams();

    // Handle specialisations from both flows (untitled uses 'specialisation', final uses 'specialisations')
    const specialisations = updatedFormData.specialisations || updatedFormData.specialisation;
    if (specialisations && specialisations.length > 0) {
      params.set("specialisations", `[${specialisations.join(",")}]`);
    }
    if (updatedFormData.district) {
      params.set("district", updatedFormData.district);
    }
    if (updatedFormData.propertyType) {
      params.set("propertyType", updatedFormData.propertyType);
    }
    if (updatedFormData.paymentMethod) {
      params.set("paymentMethod", updatedFormData.paymentMethod);
    }
    if (updatedFormData.userInteraction) {
      params.set("userInteraction", updatedFormData.userInteraction);
    }

    navigate(`/organizations?${params.toString()}`);
  }, [currentScreenData, state.formData, state.selectedAnswer, state.selectedAnswers, navigate]);

  // Check if current answer is valid for continuing
  const canContinue =
    currentScreenData?.inputType === "multi"
      ? state.selectedAnswers.length > 0
      : state.selectedAnswer !== null;

  // Render question screen with RadioButtonSelector
  const renderQuestionScreen = () => {
    const screen = currentScreenData;

    return (
      <>
        {/* Header with title and paragraph */}
        {(screen.titleKey || screen.paragraphKey) && (
          <GridItem md={8} lg={12} classes="children-rights__header">
            {screen.titleKey && <h2>{t(screen.titleKey)}</h2>}
            {screen.paragraphKey && (
              <p style={{marginTop:"1.2rem"}} className="text">{t(screen.paragraphKey)}</p>
            )}
          </GridItem>
        )}

        {/* Question */}
        {screen.questionKey && (
          <GridItem md={8} lg={12} classes="children-rights__question">
            <div className="children-rights__question__content">
              <h4>{t(screen.questionKey)}</h4>
            </div>
          </GridItem>
        )}

        {/* Answers */}
        <GridItem md={8} lg={12} classes="children-rights__answers">
          <div className="children-rights__answers__container">
            {currentAnswers.map((answer) => (
              <div
                key={answer.id}
                className="children-rights__answers__option"
                onClick={() => handleAnswerSelect(answer.id)}
              >
                <RadioButtonSelector
                  name={`question-${state.currentScreen}`}
                  isChecked={state.selectedAnswer === answer.id}
                  setIsChecked={() => {}}
                  label={answer.isFromMetadata ? tOrg(answer.labelKey) : t(answer.labelKey)}
                />
              </div>
            ))}
          </div>
        </GridItem>

        {/* Navigation */}
        <GridItem md={8} lg={12} classes="children-rights__navigation">
          <div className="children-rights__navigation__buttons">
            <Button
              disabled={state.navigationHistory.length === 0}
              label={t("back")}
              type="secondary"
              size="lg"
              onClick={handleBack}
            />
            <Button
              label={t("continue")}
              size="lg"
              onClick={handleNext}
              disabled={!canContinue}
            />
          </div>
        </GridItem>
      </>
    );
  };

  // Render form question screen (single or multi-select)
  const renderFormQuestionScreen = () => {
    const screen = currentScreenData;
    const isMulti = screen.inputType === "multi";
    const isLastQuestion = screen.isLastFormQuestion;

    return (
      <>
        {/* Question */}
        <GridItem md={8} lg={12} classes="children-rights__question">
          <div className="children-rights__question__content">
            <h4>{t(screen.questionKey)}</h4>
          </div>
        </GridItem>

        {/* Answers */}
        <GridItem
          md={8}
          lg={12}
          classes={`children-rights__answers ${
            isMulti ? "children-rights__answers--multi" : ""
          }`}
        >
          <div className="children-rights__answers__container">
            {isMulti
              ? currentAnswers.map((answer) => (
                  <CheckBox
                    key={answer.id}
                    label={answer.isFromMetadata ? tOrg(answer.labelKey) : t(answer.labelKey)}
                    isChecked={state.selectedAnswers.includes(answer.id)}
                    setIsChecked={() => handleMultiSelect(answer.id)}
                  />
                ))
              : currentAnswers.map((answer) => (
                  <div
                    key={answer.id}
                    className="children-rights__answers__option"
                    onClick={() => handleAnswerSelect(answer.id)}
                  >
                    <RadioButtonSelector
                      name={`question-${state.currentScreen}`}
                      isChecked={state.selectedAnswer === answer.id}
                      setIsChecked={() => {}}
                      label={answer.isFromMetadata ? tOrg(answer.labelKey) : t(answer.labelKey)}
                    />
                  </div>
                ))}
          </div>
        </GridItem>

        {/* Navigation */}
        <GridItem md={8} lg={12} classes="children-rights__navigation">
          <div className="children-rights__navigation__buttons">
            <Button
              disabled={state.navigationHistory.length === 0}
              label={t("back")}
              type="secondary"
              size="lg"
              onClick={handleBack}
            />
            <Button
              label={isLastQuestion ? t("submit") : t("continue")}
              size="lg"
              onClick={isLastQuestion ? handleFormSubmit : handleNext}
              disabled={!canContinue}
            />
          </div>
        </GridItem>
      </>
    );
  };

  // Handle article click
  const handleArticleClick = useCallback((article) => {
    const articleSlug = article.attributes?.slug || article.slug;
    const articleId = article.id;
    if (articleSlug) {
      navigate(`/information-portal/article/${articleId}/${articleSlug}`);
    }
  }, [navigate]);

  // Render content screen
  const renderContentScreen = () => {
    const screen = currentScreenData;

    return (
      <>
        <GridItem md={8} lg={12} classes="children-rights__content">
          {screen.titleKey && <h2>{t(screen.titleKey)}</h2>}
          {screen.paragraphKey && (
              <p style={{ whiteSpace: "pre-line",width:"100%" }}>
            <Trans t={t} components={[<strong/>, <br/>]}>
            {t(screen.paragraphKey)}
            </Trans>
            </p>
          )}
        </GridItem>

        {/* Articles Grid */}
        {isArticlesLoading && (
          <GridItem md={8} lg={12}>
            <Loading size="lg" />
          </GridItem>
        )}

        {!isArticlesLoading && articles.length > 0 && (
          <GridItem md={8} lg={12} classes="children-rights__articles">
            <ArticlesGrid
              articles={articles}
              onArticleClick={handleArticleClick}
              t={t}
              pattern={[3, 3, 1]}
            />
          </GridItem>
        )}


        {/* Back button */}
        <GridItem md={8} lg={12} classes="children-rights__navigation">
          <div className="children-rights__navigation__buttons">
            <Button
              disabled={state.navigationHistory.length === 0}
              label={t("back")}
              type="secondary"
              size="lg"
              onClick={handleBack}
            />
            {screen.sectionNumber !== undefined && screen.sectionNumber !== null && (
              <Button
                label={t("view_content")}
                size="lg"
                onClick={handleRedirectToContent}
              />
            )}
          </div>
        </GridItem>
      </>
    );
  };

  // Render the appropriate screen type
  const renderScreen = () => {
    if (!currentScreenData) return null;

    // Show loading if metadata is needed but not yet loaded
    if (currentScreenData.metadataField && isMetadataLoading) {
      return (
        <GridItem md={8} lg={12}>
          <Loading size="lg" />
        </GridItem>
      );
    }

    switch (currentScreenData.type) {
      case "question":
        return renderQuestionScreen();
      case "form-question":
        return renderFormQuestionScreen();
      case "content":
        return renderContentScreen();
      default:
        return null;
    }
  };

  return (
    <Page classes="page__children-rights">
      <Block classes="children-rights">
        <Grid classes="children-rights__grid">{renderScreen()}</Grid>
      </Block>
    </Page>
  );
};

