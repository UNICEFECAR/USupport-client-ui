import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

import { Page, MascotHeaderMyQA, MyQA as MyQABlock } from "#blocks";
import { CreateQuestion, QuestionDetails, HowItWorksMyQA } from "#modals";
import { ScheduleConsultationGroup } from "#backdrops";
import {
  useGetClientQuestions,
  useGetQuestions,
  useAddVoteQuestion,
  useGetClientData,
} from "#hooks";

import "./my-qa.scss";

/**
 * MyQA
 *
 * MyQA page
 *
 * @returns {JSX.Element}
 */
export const MyQA = () => {
  const navigate = useNavigate();

  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);
  const [isQuestionDetailsOpen, setIsQuestionDetailsOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isSelectConsultationOpen, setIsSelectConsultationOpen] =
    useState(false);
  const [isConfirmBackdropOpen, setIsConfirmBackdropOpen] = useState(false);
  const [isRequireDataAgreementOpen, setIsRequireDataAgreementOpen] =
    useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [questions, setQuestions] = useState([]);
  const [tabs, setTabs] = useState([
    { label: "All", value: "all", isSelected: true },
    { label: "Most popular", value: "most_popular", isSelected: false },
    { label: "New", value: "newest", isSelected: false },
    { label: "Your questions", value: "your_questions", isSelected: false },
  ]);
  const [providerId, setProviderId] = useState(null);

  const clientData = useGetClientData()[1];

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["getQuestions"] });
    toast("Successful");
  };

  const onError = () => {
    toast(`Error`);
  };

  const addQuestionMutation = useAddVoteQuestion(onSuccess, onError);

  const isUserQuestionsEnabled =
    tabs.filter((tab) => tab.value === "your_questions" && tab.isSelected)
      .length > 0;

  const userQuestions = useGetClientQuestions(isUserQuestionsEnabled);
  const allQuestions = useGetQuestions(
    tabs.find((tab) => tab.isSelected).value,
    !isUserQuestionsEnabled
  );

  useEffect(() => {
    if (userQuestions.data || allQuestions.data) {
      if (isUserQuestionsEnabled) {
        setQuestions(userQuestions.data);
      } else setQuestions(allQuestions.data);
    }
  }, [tabs, userQuestions.data, allQuestions.data]);

  useEffect(() => {
    if (selectedQuestion)
      setSelectedQuestion(
        questions.find((question) => question.answerId === question.answerId)
      );
  }, [questions]);

  const handleLike = (vote, answerId) => {
    const questionsCopy = [...questions];
    const isLike = vote === "like" || vote === "remove-like";

    for (let i = 0; i < questionsCopy.length; i++) {
      if (questionsCopy[i].answerId === answerId) {
        if (isLike) {
          if (questionsCopy[i].isLiked) {
            questionsCopy[i].likes--;
          } else {
            questionsCopy[i].likes++;
          }

          if (questionsCopy[i].isDisliked) {
            questionsCopy[i].dislikes--;
          }
        } else {
          if (questionsCopy[i].isDisliked) {
            questionsCopy[i].dislikes--;
          } else {
            questionsCopy[i].dislikes++;
          }
          if (questionsCopy[i].isLiked) {
            questionsCopy[i].likes--;
          }
        }
        questionsCopy[i].isLiked = questionsCopy[i].isLiked ? false : isLike;
        questionsCopy[i].isDisliked = !isLike
          ? questionsCopy[i].isDisliked
            ? false
            : !isLike
          : !isLike;
      }
    }

    setQuestions(questionsCopy);
    addQuestionMutation.mutate({ vote, answerId });
  };

  const handleScheduleConsultationClick = (question) => {
    setProviderId(question.providerData.providerId);
    if (!clientData.dataProcessing) {
      openRequireDataAgreement();
    } else {
      setIsSelectConsultationOpen(true);
    }
  };

  const handleSetIsQuestionDetailsOpen = (question) => {
    setSelectedQuestion(question);
    setIsQuestionDetailsOpen(true);
  };

  const openRequireDataAgreement = () => setIsRequireDataAgreementOpen(true);

  return (
    <Page classes="page__my-qa" showGoBackArrow={false}>
      <MascotHeaderMyQA
        handleSeeHowItWorksClick={() => setIsHowItWorksOpen(true)}
        handleHowItWorks={() => setIsHowItWorksOpen(true)}
      />
      <MyQABlock
        handleAskAnonymous={() => setIsCreateQuestionOpen(true)}
        handleReadMore={handleSetIsQuestionDetailsOpen}
        handleLike={handleLike}
        handleScheduleConsultationClick={handleScheduleConsultationClick}
        questions={questions}
        tabs={tabs}
        setTabs={setTabs}
        isUserQuestionsEnabled={isUserQuestionsEnabled}
      />
      {/* <Block>
        <Answer />
      </Block> */}
      <CreateQuestion
        isOpen={isCreateQuestionOpen}
        onClose={() => setIsCreateQuestionOpen(false)}
      />
      {selectedQuestion && (
        <QuestionDetails
          isOpen={isQuestionDetailsOpen}
          onClose={() => setIsQuestionDetailsOpen(false)}
          question={selectedQuestion}
          handleLike={handleLike}
          handleScheduleClick={handleScheduleConsultationClick}
        />
      )}
      <HowItWorksMyQA
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
      <ScheduleConsultationGroup
        isSelectConsultationOpen={isSelectConsultationOpen}
        setIsSelectConsultationOpen={setIsSelectConsultationOpen}
        isConfirmBackdropOpen={isConfirmBackdropOpen}
        setIsConfirmBackdropOpen={setIsConfirmBackdropOpen}
        isRequireDataAgreementOpen={isRequireDataAgreementOpen}
        setIsRequireDataAgreementOpen={setIsRequireDataAgreementOpen}
        providerId={providerId}
      />
    </Page>
  );
};
