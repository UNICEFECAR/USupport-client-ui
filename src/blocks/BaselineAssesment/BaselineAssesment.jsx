import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

import { BaselineAssesmentResult } from "../BaselineAssesmentResult";

import {
  useGetBaselineAssessmentQuestions,
  useAddBaselineAssessmentAnswer,
  useCreateBaselineAssessment,
  useGetClientAnswersForBaselineAssessmentById,
  useCustomNavigate as useNavigate,
} from "#hooks";

import {
  Block,
  Button,
  ButtonWithIcon,
  Grid,
  GridItem,
  RadioButtonSelector,
  Loading,
  ProgressBar,
} from "@USupport-components-library/src";

import "./baseline-assesment.scss";

/**
 * BaselineAssesment
 *
 * Baseline assesment block
 *
 * @return {jsx}
 */
export const BaselineAssesment = ({
  selectedSession,
  setHasStartedAssessment,
  inProgressSession,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("blocks", {
    keyPrefix: "baseline-assesment",
  });
  const queryClient = useQueryClient();
  const [hasSetInitially, setHasSetInitially] = useState(false);
  const [state, setState] = useState({
    currentStep: "intro", // intro, questions, completed
    currentQuestionIndex: 0,
    answers: {},
    baselineAssessmentId: null,
    isNewSession: false,
  });

  const {
    isLoading,
    data: questions,
    error,
  } = useGetBaselineAssessmentQuestions();

  const {
    isFetching: isFetchingAnswers,
    data: answers,
    error: answersError,
  } = useGetClientAnswersForBaselineAssessmentById(
    selectedSession?.baselineAssessmentId,
    !state.isNewSession
  );

  useEffect(() => {
    if (answers && selectedSession && !hasSetInitially) {
      setState((prev) => ({
        ...prev,
        answers,
        baselineAssessmentId: selectedSession.baselineAssessmentId,
        currentQuestionIndex: selectedSession.currentPosition - 1,
        currentStep:
          selectedSession.status === "completed" ? "completed" : "questions",
        finalResult: selectedSession.finalResult,
      }));
      setHasSetInitially(true);
    }
  }, [answers, selectedSession, hasSetInitially]);

  const addBaselineAssessmentAnswerMutation = useAddBaselineAssessmentAnswer();

  const createBaselineAssessmentMutation = useCreateBaselineAssessment();

  const currentQuestion = questions?.[state.currentQuestionIndex];
  const progress = questions?.length
    ? ((state.currentQuestionIndex + 1) / questions.length) * 100
    : 0;
  const answeredProgress = questions?.length
    ? (Object.keys(state.answers).length / questions.length) * 100
    : 0;

  const canStartNewAssessment = !inProgressSession;

  const canContinue =
    currentQuestion && state.answers[currentQuestion.questionId];
  const isLastQuestion = state.currentQuestionIndex === questions?.length - 1;

  // Start the assessment
  const handleStartAssessment = () => {
    if (!canStartNewAssessment) {
      toast.error(
        "You have an assessment in progress. Please complete it before starting a new one."
      );
      return;
    }

    createBaselineAssessmentMutation.mutate(undefined, {
      onSuccess: (assessmentData) => {
        setState((prev) => ({
          ...prev,
          currentStep: "questions",
          baselineAssessmentId: assessmentData.baselineAssessmentId,
          isNewSession: true,
        }));
        setHasStartedAssessment(true);
      },
      onError: (error) => {
        toast.error("Error creating assessment. Please try again.");
        console.error("Failed to create baseline assessment:", error);
      },
    });
  };

  // Handle answer selection
  const handleAnswerSelect = useCallback(
    (answerValue) => {
      if (!currentQuestion) return;

      const questionId = currentQuestion.questionId;

      setState((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: answerValue,
        },
      }));
    },
    [currentQuestion]
  );

  // Navigate to next question
  const handleNext = () => {
    if (!currentQuestion || !state.answers[currentQuestion.questionId]) return;
    const currentAnswer = answers ? answers[currentQuestion.questionId] : null;

    const questionId = currentQuestion.questionId;
    const answerValue = state.answers[questionId];

    if (
      answers &&
      currentAnswer &&
      currentAnswer === answerValue &&
      !isLastQuestion
    ) {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
      return;
    }

    // Submit answer to API first
    addBaselineAssessmentAnswerMutation.mutate(
      {
        questionId,
        answerValue,
        baselineAssessmentId: state.baselineAssessmentId,
        currentPosition: state.currentQuestionIndex + 1,
      },
      {
        onSuccess: (data) => {
          // Update assessment ID if we got one back
          if (data.baselineAssessmentId && !state.baselineAssessmentId) {
            setState((prev) => ({
              ...prev,
              baselineAssessmentId: data.baselineAssessmentId,
            }));
          }

          // Navigate after successful submission
          if (state.currentQuestionIndex < questions.length - 1) {
            setState((prev) => ({
              ...prev,
              currentQuestionIndex: prev.currentQuestionIndex + 1,
            }));
          } else {
            // Assessment completed
            setState((prev) => ({
              ...prev,
              currentStep: "completed",
              finalResult: data.finalResult,
            }));
            queryClient.invalidateQueries({
              queryKey: ["baseline-assessments"],
            });
          }
          queryClient.invalidateQueries({
            queryKey: ["latest-baseline-assessment"],
          });
        },
        onError: () => {
          toast.error("Error submitting answer. Please try again.");
          // Remove the answer from local state if submission failed
          setState((prev) => {
            const newAnswers = { ...prev.answers };
            delete newAnswers[questionId];
            return { ...prev, answers: newAnswers };
          });
        },
      }
    );
  };

  // Navigate to previous question
  const handleBack = () => {
    if (state.currentQuestionIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  // Render rating scale (1-5)
  const renderRatingScale = () => {
    const currentAnswer = currentQuestion
      ? state.answers[currentQuestion.questionId]
      : null;

    return (
      <div className="baseline-assesment__rating-scale">
        {[1, 2, 3, 4, 5].map((value) => (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleAnswerSelect(value);
            }}
            key={value}
            className="baseline-assesment__rating-option"
          >
            <RadioButtonSelector
              name={`question-${currentQuestion?.questionId}`}
              isChecked={currentAnswer === value}
              setIsChecked={() => {}}
              disabled={addBaselineAssessmentAnswerMutation.isLoading}
              label={
                (value === 1 && "1. Strongly Disagree") ||
                (value === 2 && "2. Disagree") ||
                (value === 3 && "3. Neutral") ||
                (value === 4 && "4. Agree") ||
                (value === 5 && "5. Strongly Agree")
              }
            />
          </div>
        ))}
      </div>
    );
  };

  if (isLoading || isFetchingAnswers) {
    return (
      <Block classes="baseline-assesment">
        <Loading size="lg" />
      </Block>
    );
  }

  if (error) {
    return (
      <Block classes="baseline-assesment">
        <div className="baseline-assesment__error">
          <h3>Error Loading Questions</h3>
          <p>
            Unable to load baseline assessment questions. Please try again
            later.
          </p>
        </div>
      </Block>
    );
  }

  return (
    <Block classes="baseline-assesment">
      <Grid classes="baseline-assesment__grid">
        {/* Intro Step */}
        {state.currentStep === "intro" && (
          <>
            <GridItem md={8} lg={12} classes="baseline-assesment__intro">
              <h1>Baseline Assessment</h1>
              <p className="text">
                This assessment will help us understand your current mental
                health status. Please answer each question honestly.
              </p>
              <div className="baseline-assesment__intro__stats">
                <p className="small-text">{questions?.length || 0} questions</p>
                <p className="small-text">~5 minutes</p>
              </div>
            </GridItem>
            {canStartNewAssessment && (
              <GridItem md={8} lg={12}>
                <Button
                  label={"Start Assessment"}
                  size="lg"
                  onClick={handleStartAssessment}
                  loading={createBaselineAssessmentMutation.isLoading}
                  disabled={createBaselineAssessmentMutation.isLoading}
                  type="primary"
                />
              </GridItem>
            )}
          </>
        )}

        {/* Questions Step */}
        {state.currentStep === "questions" && currentQuestion && (
          <>
            <GridItem md={8} lg={12} classes="baseline-assesment__progress">
              <h3>{t("instructions")}</h3>

              <div className="baseline-assesment__progress__info">
                <span className="small-text">
                  {t("question", {
                    number: state.currentQuestionIndex + 1,
                    total: questions.length,
                  })}
                </span>
                <span className="small-text">
                  {t("completed", {
                    percentage: Math.round(answeredProgress),
                  })}
                </span>
              </div>
              <ProgressBar
                progress={progress}
                height="md"
                classes="baseline-assesment__progress-bar"
              />
            </GridItem>

            {/* Question */}
            <GridItem md={8} lg={12} classes="baseline-assesment__question">
              <div className="baseline-assesment__question__content">
                <h4>{t(currentQuestion.questionText)}</h4>
              </div>
            </GridItem>

            {/* Rating Scale */}
            <GridItem md={8} lg={12} classes="baseline-assesment__rating">
              {renderRatingScale()}
            </GridItem>

            {/* Navigation */}
            <GridItem md={8} lg={12} classes="baseline-assesment__navigation">
              <div className="baseline-assesment__navigation__buttons">
                <Button
                  disabled={state.currentQuestionIndex === 0}
                  label={t("back")}
                  type="secondary"
                  size="lg"
                  onClick={handleBack}
                />
                <Button
                  label={isLastQuestion ? t("finish_assessment") : t("next")}
                  size="lg"
                  onClick={handleNext}
                  disabled={!canContinue}
                  loading={addBaselineAssessmentAnswerMutation.isLoading}
                />
              </div>
              <ButtonWithIcon
                iconName="save"
                iconColor="#ffffff"
                size="md"
                color="purple"
                label="Save for later"
                classes="baseline-assesment__navigation__save-for-later"
                onClick={() => navigate("/dashboard")}
              />
            </GridItem>
          </>
        )}

        {/* Completed Step */}
        {state.currentStep === "completed" && (
          <BaselineAssesmentResult result={state.finalResult} t={t} />
        )}
      </Grid>
    </Block>
  );
};
