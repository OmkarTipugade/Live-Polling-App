import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useSocketEmit } from "../hooks/useSocketEvent";
import { SOCKET_EVENTS } from "../utils/socketEvents";
import { toast } from "react-toastify";
import toastOptions from "../utils/ToastOptions";
import { FaCaretDown } from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import BadgeStar from "../components/BadgeStar";

interface optionType {
  value: string;
  isCorrect: boolean;
}
const TeacherPage: React.FC = () => {
  const navigate = useNavigate();
  const { emit } = useSocketEmit();
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<optionType[]>([
    { value: "", isCorrect: false },
    { value: "", isCorrect: false },
  ]);
  const [duration, setDuration] = useState<number>(60);

  const sessionId = sessionStorage.getItem("sessionId");

  const handleOptionChange = (index: number, newValue: string) => {
    const updated = [...options];
    updated[index].value = newValue;
    setOptions(updated);
  };

  const handleCorrectChange = (index: number, isCorrect: boolean) => {
    const updated = [...options];
    updated[index].isCorrect = isCorrect;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, { value: "", isCorrect: false }]);
    }
  };

  const handleAskQuestion = () => {
    // Validation
    if (!question.trim()) {
      toast.error("Please enter a question", toastOptions);
      return;
    }

    const filledOptions = options.filter((opt) => opt.value.trim() !== "");
    if (filledOptions.length < 2) {
      toast.error("Please provide at least 2 options", toastOptions);
      return;
    }

    // Check if at least one correct option is selected
    const hasCorrectOption = filledOptions.some((opt) => opt.isCorrect);
    if (!hasCorrectOption) {
      toast.error("Please select at least one correct option", toastOptions);
      return;
    }

    if (!sessionId) {
      toast.error("No active session found", toastOptions);
      return;
    }

    // Emit new question via socket
    emit(SOCKET_EVENTS.NEW_QUESTION, {
      sessionId,
      text: question,
      options: filledOptions.map((opt) => opt.value),
      correctAnswer: filledOptions.find((opt) => opt.isCorrect)?.value,
      timeLimit: duration,
    });

    setTimeout(() => {
      navigate("/teacher/que");
    }, 500);
  };

  const handleCopySessionCode = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      toast.success("Session code copied to clipboard!", toastOptions);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10 flex flex-col items-center sora">
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-left flex justify-between items-center">
          <div className="flex items-center rounded-full w-fit">
            <BadgeStar />
          </div>

          {sessionId && (
            <div className="flex items-center gap-3 bg-linear-to-r from-[#8F64E1] to-[#1D68BD] px-5 py-2.5 rounded-full shadow-md">
              <div className="flex flex-col">
                <span className="text-white text-xs font-medium opacity-90">
                  Session Code
                </span>
                <span className="text-white text-lg font-bold tracking-wider">
                  {sessionId.slice(-6).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleCopySessionCode}
                className="bg-opacity-20 hover:bg-opacity-30 transition p-2 rounded-lg cursor-pointer"
                title="Copy session code"
              >
                <FaCopy className="text-white h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="text-left mb-10">
          <h1 className="text-3xl md:text-4xl font-normal">
            Let’s <span className="font-semibold">Get Started</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            you’ll have the ability to create and manage polls, ask questions,
            and monitor your students' responses in real-time.
          </p>
        </div>

        <div className="space-y-2 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label className="font-semibold text-black">
              Enter your question
            </label>
            <div className="relative w-fit">
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="border cursor-pointer rounded px-6 py-2 text-sm focus:outline-none bg-[#F2F2F2] appearance-none"
              >
                <option value="30">30 seconds</option>
                <option value="45">45 seconds</option>
                <option value="60">60 seconds</option>
                <option value="90">90 seconds</option>
                <option value="120">120 seconds</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <FaCaretDown className="text-[#480FB3]" />
              </div>
            </div>
          </div>
          <textarea
            className="w-full h-24 p-3 bg-[#F2F2F2] rounded-md focus:outline-none resize-none"
            maxLength={100}
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="text-right text-sm text-gray-400">
            {question.length}/100
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <h2 className="font-semibold">Edit Options</h2>
            <h2 className="font-semibold">Is it Correct?</h2>
          </div>

          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-[#8F64E1] text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <input
                className="flex-1 bg-[#F2F2F2] rounded-md px-4 py-2 focus:outline-none"
                placeholder={`Option ${index + 1}`}
                value={opt.value}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <div className="flex items-center gap-4 ml-2">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={opt.isCorrect}
                    onChange={() => handleCorrectChange(index, true)}
                    className="accent-[#8F64E1]"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={!opt.isCorrect}
                    onChange={() => handleCorrectChange(index, false)}
                    className="accent-[#8F64E1]"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>
          ))}

          {options.length < 5 && (
            <button
              onClick={addOption}
              className="text-[#7765DA] cursor-pointer border border-[#7765DA] rounded-lg px-4 py-2.5 text-sm mt-2"
            >
              + Add More option
            </button>
          )}
        </div>
      </div>{" "}
      <hr className="w-full border-gray-200 my-10" />
      <div className="w-full max-w-3xl">
        <div className="flex justify-end">
          <button
            onClick={handleAskQuestion}
            className="px-6 py-3 bg-linear-to-r from-[#8F64E1] to-[#1D68BD] text-white font-semibold rounded-full hover:opacity-90 transition"
          >
            Ask Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
