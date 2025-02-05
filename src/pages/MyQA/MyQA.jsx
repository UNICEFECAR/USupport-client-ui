import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

import { Page, MascotHeaderMyQA, MyQA as MyQABlock } from "#blocks";
import { CreateQuestion, QuestionDetails, HowItWorksMyQA } from "#modals";
import { ScheduleConsultationGroup, FilterQuestions } from "#backdrops";
import {
  useGetClientQuestions,
  useGetQuestions,
  useAddVoteQuestion,
  useGetClientData,
} from "#hooks";
import { RootContext } from "#routes";

import "./my-qa.scss";

/**
 * MyQA
 *
 * MyQA page
 *
 * @returns {JSX.Element}
 */
export const MyQA = () => {
  const { isTmpUser, handleRegistrationModalOpen } = useContext(RootContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);
  const [isQuestionDetailsOpen, setIsQuestionDetailsOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isSelectConsultationOpen, setIsSelectConsultationOpen] =
    useState(false);
  const [isConfirmBackdropOpen, setIsConfirmBackdropOpen] = useState(false);
  const [isRequireDataAgreementOpen, setIsRequireDataAgreementOpen] =
    useState(false);
  const [isFilterQuestionsOpen, setIsFilterQuestionsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [questions, setQuestions] = useState([]);
  const [tabs, setTabs] = useState([
    { label: "All", value: "all", isSelected: true },
    { label: "Most popular", value: "most_popular", isSelected: false },
    { label: "New", value: "newest", isSelected: false },
    { label: "Your questions", value: "your_questions", isSelected: false },
  ]);
  const [providerId, setProviderId] = useState(null);
  const [filterTag, setFilterTag] = useState("");
  const [hasOpenedQuestionFromLocation, setHasOpenedQuestionFromLocation] =
    useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [shouldFetchQuestions, setShouldFetchQuestions] = useState(false);

  const clientData = useGetClientData()[1];

  const isUserQuestionsEnabled =
    tabs.filter((tab) => tab.value === "your_questions" && tab.isSelected)
      .length > 0 &&
    shouldFetchQuestions &&
    !!selectedLanguage;

  const userQuestions = useGetClientQuestions(isUserQuestionsEnabled);
  const allQuestions = useGetQuestions(
    tabs.find((tab) => tab.isSelected).value,
    !isUserQuestionsEnabled,
    selectedLanguage
  );

  // If redirected to this screen from notifications
  // Open the question details modal
  useEffect(() => {
    if (
      location.state?.questionId &&
      allQuestions.data?.length &&
      !hasOpenedQuestionFromLocation
    ) {
      const question = allQuestions.data.find(
        (question) => question.questionId === location.state.questionId
      );
      if (question) {
        handleSetIsQuestionDetailsOpen(question);
        // Make sure to open the question modal just once
        setHasOpenedQuestionFromLocation(true);
      }
    }
  }, [location.state, allQuestions.data, hasOpenedQuestionFromLocation]);

  useEffect(() => {
    if (isTmpUser) {
      setTabs(tabs.filter((tab) => tab.value !== "your_questions"));
    }
  }, [isTmpUser]);

  useEffect(() => {
    if (isUserQuestionsEnabled && userQuestions.data) {
      setQuestions(userQuestions.data);
    }

    if (!isUserQuestionsEnabled && allQuestions.data) {
      setQuestions(allQuestions.data);
    }
  }, [tabs, userQuestions.data, allQuestions.data]);

  const handleLike = (vote, answerId) => {
    if (isTmpUser) {
      handleRegistrationModalOpen();
    } else {
      addVoteQuestionMutation.mutate({ vote, answerId });
    }
  };

  const handleScheduleConsultationClick = (question) => {
    if (isTmpUser) {
      handleRegistrationModalOpen();
    } else {
      setProviderId(question.providerData.providerId);
      if (!clientData.dataProcessing) {
        openRequireDataAgreement();
      } else {
        setIsSelectConsultationOpen(true);
      }
    }
  };

  const handleSetIsQuestionDetailsOpen = (question) => {
    setSelectedQuestion(question);
    setIsQuestionDetailsOpen(true);
  };

  const openRequireDataAgreement = () => setIsRequireDataAgreementOpen(true);

  const onError = (error, rollback) => {
    toast(error, { type: "error" });
    rollback();
  };

  const onMutate = ({ vote, answerId }) => {
    const rollbackCopy = JSON.parse(JSON.stringify([...questions]));

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

    return () => {
      setQuestions(rollbackCopy);
    };
  };

  const addVoteQuestionMutation = useAddVoteQuestion(onError, onMutate);

  const handleAskAnonymous = () => {
    if (isTmpUser) {
      handleRegistrationModalOpen();
    } else {
      setIsCreateQuestionOpen(true);
    }
  };

  const handleProviderClick = (providerId) => {
    navigate(`/provider-overview?provider-id=${providerId}`);
  };

  return (
    <Page classes="page__my-qa" showGoBackArrow={false}>
      <MascotHeaderMyQA
        handleSeeHowItWorksClick={() => setIsHowItWorksOpen(true)}
        handleHowItWorks={() => setIsHowItWorksOpen(true)}
      />
      <MyQABlock
        handleAskAnonymous={handleAskAnonymous}
        handleReadMore={handleSetIsQuestionDetailsOpen}
        handleLike={handleLike}
        handleScheduleConsultationClick={handleScheduleConsultationClick}
        questions={questions}
        tabs={tabs}
        setTabs={setTabs}
        isUserQuestionsEnabled={isUserQuestionsEnabled}
        filterTag={filterTag}
        handleFilterTags={() => setIsFilterQuestionsOpen(true)}
        isQuestionsDataLoading={
          userQuestions.isFetching || allQuestions.isFetching
        }
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        setShouldFetchQuestions={setShouldFetchQuestions}
      />
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
          handleProviderClick={handleProviderClick}
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
      <FilterQuestions
        isOpen={isFilterQuestionsOpen}
        onClose={() => setIsFilterQuestionsOpen(false)}
        setTag={setFilterTag}
      />
    </Page>
  );
};
