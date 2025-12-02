import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSocketEvent } from "../hooks/useSocketEvent";
import {
  SOCKET_EVENTS,
  type QuestionData,
  type ResultsData,
} from "../utils/socketEvents";
import PollOption from "../components/PollOption";
import { IoEyeSharp } from "react-icons/io5";
import { FaCopy } from "react-icons/fa6";
import { toast } from "react-toastify";
import toastOptions from "../utils/ToastOptions";
import { api } from "../utils/api";
import clock from "../assets/clock.png";

interface OptionType {
  id: number;
  text: string;
  votes: number;
}

const AskQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [results, setResults] = useState<Record<string, number>>({});
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);

  const sessionId = localStorage.getItem("sessionId");

  // Fetch current question on mount
  useEffect(() => {
    const fetchCurrentQuestion = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const { question: currentQuestion } = await api.getCurrentQuestion(
          sessionId
        );
        if (currentQuestion) {
          setQuestion({
            id: currentQuestion._id,
            text: currentQuestion.text,
            options: currentQuestion.options,
            timeLimit: currentQuestion.timeLimit,
            startTime: currentQuestion.startTime,
            questionNumber: currentQuestion.questionNumber,
          });

          // Calculate remaining time
          const elapsed = Math.floor(
            (Date.now() - new Date(currentQuestion.startTime).getTime()) / 1000
          );
          const remaining = Math.max(0, currentQuestion.timeLimit - elapsed);
          setTimer(remaining);

          // Initialize results with 0 votes
          const initialResults: Record<string, number> = {};
          currentQuestion.options.forEach((opt: string) => {
            initialResults[opt] = 0;
          });
          setResults(initialResults);
        }
      } catch (error) {
        console.error("Error fetching current question:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentQuestion();
  }, [sessionId]);

  // Listen for when a question is asked (sent to all clients)
  useSocketEvent<{ question: QuestionData }>(
    SOCKET_EVENTS.QUESTION_ASKED,
    (data) => {
      setQuestion(data.question);
      setTimer(data.question.timeLimit);
      // Initialize results with 0 votes
      const initialResults: Record<string, number> = {};
      data.question.options.forEach((opt) => {
        initialResults[opt] = 0;
      });
      setResults(initialResults);
      setAnsweredCount(0);
    }
  );

  // Listen for real-time result updates as students answer
  useSocketEvent<ResultsData>(SOCKET_EVENTS.UPDATE_RESULTS, (data) => {
    if (data.questionId === question?.id) {
      setResults(data.results);
      setAnsweredCount(data.answeredCount || 0);
      setTotalStudents(data.totalStudents || 0);
    }
  });

  // Listen for final results when time expires or all students answered
  useSocketEvent<ResultsData>(SOCKET_EVENTS.SHOW_RESULTS, (data) => {
    if (data.questionId === question?.id) {
      setResults(data.results);
      setAnsweredCount(data.totalAnswers || 0);
      toast.info("Question ended! Results are now final.", toastOptions);
    }
  });

  // Listen for errors
  useSocketEvent<{ message: string }>(SOCKET_EVENTS.ERROR, (data) => {
    toast.error(data.message, toastOptions);
  });

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && question) {
      const interval = setInterval(() => {
        setTimer((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, question]);

  const handleAskNewQuestion = () => {
    navigate("/teacher");
  };

  const handleViewHistory = () => {
    toast.info("Poll history feature coming soon!", toastOptions);
  };

  const handleCopySessionCode = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      toast.success("Session code copied to clipboard!", toastOptions);
    }
  };

  // Calculate poll data for display
  const pollData: OptionType[] = question
    ? question.options.map((opt, index) => ({
        id: index + 1,
        text: opt,
        votes: results[opt] || 0,
      }))
    : [];

  const totalVotes = Object.values(results).reduce(
    (sum, votes) => sum + votes,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 sora">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 sora">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            No active question. Ready to ask one?
          </p>
          <button
            onClick={handleAskNewQuestion}
            className="flex items-center gap-2 cursor-pointer bg-linear-to-r from-[#8F64E1] to-[#1D68BD] text-white text-sm font-medium px-5 py-3 rounded-full shadow mx-auto"
          >
            + Ask a question
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative px-4 py-10 sora">
      <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
        {sessionId && (
          <div className="flex items-center gap-2 bg-linear-to-r from-[#8F64E1] to-[#1D68BD] px-4 py-2 rounded-full shadow-md">
            <div className="flex flex-col">
              <span className="text-white text-xs font-medium opacity-90">
                Session Code
              </span>
              <span className="text-white text-sm font-bold tracking-wider">
                {sessionId.slice(-6).toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleCopySessionCode}
              className=" bg-opacity-20 hover:bg-opacity-30 transition p-1.5 rounded-lg cursor-pointer"
              title="Copy session code"
            >
              <FaCopy className="text-white h-4 w-4" />
            </button>
          </div>
        )}
        <button
          onClick={handleViewHistory}
          className="flex items-center gap-2 cursor-pointer bg-[#8F64E1] text-white text-sm font-medium px-5 py-2 rounded-full shadow hover:opacity-90 transition"
        >
          <IoEyeSharp className="h-5 w-5 text-white" />
          View Poll history
        </button>
      </div>
      <div className="max-w-xl w-full mx-auto pt-14">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-4">
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
          <div className="text-sm text-gray-600">
            {answeredCount} / {totalStudents || "?"} students answered
          </div>
        </div>
        <div className="border border-[#AF8FF1] rounded-lg overflow-hidden shadow">
          <div className="bg-linear-to-r from-[#343434] to-[#6E6E6E] px-4 py-3">
            <span className="text-white font-semibold text-sm">
              {question.text}
            </span>
          </div>

          <div className="p-4 mt-4">
            {pollData.map((option) => (
              <PollOption key={option.id} option={{ ...option, totalVotes }} />
            ))}
          </div>
        </div>

        <div className="flex justify-end mb-6 mt-8 gap-4">
          <button
            onClick={handleAskNewQuestion}
            className="flex items-center gap-2 cursor-pointer bg-linear-to-r from-[#8F64E1] to-[#1D68BD] text-white text-sm font-medium px-5 py-3 rounded-full shadow hover:opacity-90 transition"
          >
            + Ask new question
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
