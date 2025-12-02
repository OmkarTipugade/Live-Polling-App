import React, { useState, useEffect } from "react";
import { useSocketEvent, useSocketEmit } from "../hooks/useSocketEvent";
import {
  SOCKET_EVENTS,
  type QuestionData,
  type ResultsData,
} from "../utils/socketEvents";
import { toast } from "react-toastify";
import toastOptions from "../utils/ToastOptions";
import clock from "../assets/clock.png";
import PollOption from "../components/PollOption";
import { RiLoader4Fill } from "react-icons/ri";
import BadgeStar from "../components/BadgeStar";

const StudentQuePage: React.FC = () => {
  const { emit } = useSocketEmit();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [timer, setTimer] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Get session and user info from localStorage
  const sessionId = localStorage.getItem("sessionId");
  const studentId = localStorage.getItem("userId");

  // Listen for new questions
  useSocketEvent<{ question: QuestionData }>(
    SOCKET_EVENTS.QUESTION_ASKED,
    (data) => {
      setQuestion(data.question);
      setTimer(data.question.timeLimit);
      setSubmitted(false);
      setShowResults(false);
      setSelectedOption(null);
      setResults({});
      toast.info("New question received!", toastOptions);
    }
  );

  // Listen for answer submission success
  useSocketEvent<{ success: boolean; answerId: string }>(
    SOCKET_EVENTS.ANSWER_SUBMITTED,
    (data) => {
      if (data.success) {
        setShowResults(true); // Show percentages immediately after submission
      }
    }
  );

  // Listen for real-time result updates (update percentages as other students answer)
  useSocketEvent<ResultsData>(SOCKET_EVENTS.UPDATE_RESULTS, (data) => {
    if (submitted) {
      // Only show to students who have submitted
      setResults(data.results);
      setShowResults(true);
    }
  });

  // Listen for final results when question ends
  useSocketEvent<ResultsData>(SOCKET_EVENTS.SHOW_RESULTS, (data) => {
    setResults(data.results);
    setShowResults(true);
    setSubmitted(true);
  });

  // Listen for errors
  useSocketEvent<{ message: string }>(SOCKET_EVENTS.ERROR, (data) => {
    toast.error(data.message, toastOptions);
  });

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !submitted) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !submitted && question) {
      setSubmitted(true);
      toast.warning("Time's up!", toastOptions);
    }
  }, [timer, submitted, question]);

  const handleSubmit = () => {
    if (!selectedOption || !question || !studentId || !sessionId) {
      toast.error("Please select an option", toastOptions);
      return;
    }

    // Emit answer to socket
    emit(SOCKET_EVENTS.SUBMIT_ANSWER, {
      questionId: question.id,
      studentId,
      selectedOption,
      sessionId,
    });

    setSubmitted(true);
  };

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 min-h-screen bg-white px-4 sora">
        <BadgeStar />
        <RiLoader4Fill className="animate-spin text-[#8F64E1] h-8 w-8" />
        <p className="text-black text-lg font-medium text-center">
          Wait for the teacher to ask a new question...
        </p>
      </div>
    );
  }

  const totalVotes = Object.values(results).reduce(
    (sum, votes) => sum + votes,
    0
  );

  return (
    <div className="min-h-screen bg-white relative px-4 py-10 sora">
      <div className="max-w-xl w-full mx-auto pt-14">
        <div className="flex justify-between items-center mb-5">
          <div className="text-black font-semibold text-xl">
            Question{" "}
            {question.questionNumber ? `#${question.questionNumber}` : ""}
          </div>
          <div className="flex space-x-2 items-center">
            <img src={clock} className="h-5 w-5" alt="clock" />
            <div className="text-red-500 font-medium">
              {`${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(
                timer % 60
              ).padStart(2, "0")}`}
            </div>
          </div>
        </div>
        <div className="border border-[#AF8FF1] rounded-lg overflow-hidden shadow">
          <div className="bg-linear-to-r from-[#343434] to-[#6E6E6E] px-4 py-3">
            <span className="text-white font-semibold text-sm">
              {question.text}
            </span>
          </div>

          <div className="p-4 mt-4">
            {question.options.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  if (!submitted) setSelectedOption(option);
                }}
                className={`cursor-pointer ${
                  selectedOption === option
                    ? "ring ring-[#8F64E1] bg-white"
                    : ""
                } rounded-sm mb-2`}
                style={{ transition: "background 0.2s, box-shadow 0.2s" }}
              >
                {showResults ? (
                  <PollOption
                    option={{
                      id: index + 1,
                      text: option,
                      votes: results[option] || 0,
                      totalVotes,
                    }}
                  />
                ) : (
                  <div
                    className={`relative border border-[#F6F6F6] rounded-sm overflow-hidden mb-2${
                      selectedOption === option ? "bg-white" : "bg-[#F6F6F6]"
                    }`}
                  >
                    <div className="absolute top-0 left-0 h-full  transition-all duration-300"></div>
                    <div className="relative z-10 flex justify-between items-center px-4 py-2 border border-transparent rounded-md">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-6 w-6 rounded-full ${
                            selectedOption === option
                              ? "bg-[#8F64E1] text-white"
                              : "bg-[#8D8D8D] text-white"
                          } flex items-center justify-center text-sm font-bold`}
                        >
                          {index + 1}
                        </div>
                        <p
                          className={`text-sm font-medium ${
                            selectedOption === option
                              ? "text-black"
                              : "text-[#2E2E2E]"
                          }`}
                        >
                          {option}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mb-6 mt-8 gap-4">
          {!submitted && (
            <button
              className="flex items-center gap-2 cursor-pointer bg-linear-to-r from-[#8F64E1] to-[#1D68BD] text-white text-sm font-medium px-14 py-3 rounded-full shadow disabled:opacity-50"
              onClick={handleSubmit}
              disabled={!selectedOption || submitted}
            >
              Submit
            </button>
          )}
        </div>
        {submitted && !showResults && (
          <div className="flex justify-center items-center mt-8">
            <BadgeStar />
            <RiLoader4Fill className="animate-spin text-[#8F64E1] h-6 w-6" />
            <span className="text-black text-lg font-medium text-center">
              Wait for the teacher to ask a new question...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentQuePage;
