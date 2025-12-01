import React, { useState } from "react";
import PollOption from "../components/PollOption";
import { MdRemoveRedEye } from "react-icons/md";

interface questionType {
  qno: number;
  que: string;
}

interface optionType {
  id: number;
  text: string;
  votes: number;
}
const TeacherQuePage:React.FC = () => {
  const [pollData, setPollData] = useState<optionType[]>([
    { id: 1, text: "Mars", votes: 12 },
    { id: 2, text: "Venus", votes: 10 },
    { id: 3, text: "Jupiter", votes: 9 },
    { id: 4, text: "Saturn", votes: 20 },
  ]);

  const [question, setQuestion] = useState<questionType>({
    qno: 1,
    que: " Which planet is known as the Red Planet?",
  });

  const totalVotes = pollData.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="min-h-screen bg-white relative px-4 py-10 sora">
      <div className="absolute top-6 right-6 z-10">
        <button className="flex items-center gap-2 cursor-pointer bg-[#8F64E1] text-white text-sm font-medium px-5 py-2 rounded-full shadow">
          <MdRemoveRedEye className="h-5 w-5 text-white" />
          View Poll history
        </button>
      </div>
      <div className="max-w-xl w-full mx-auto pt-14">
        <div className="text-black font-semibold text-xl mb-5">
          Question {question.qno}
        </div>
        <div className="border border-[#AF8FF1] rounded-lg overflow-hidden shadow">
          <div className="bg-linear-to-r from-[#343434] to-[#6E6E6E] px-4 py-3">
            <span className="text-white font-semibold text-sm">
              {question.que}
            </span>
          </div>

          <div className="p-4 mt-4">
            {pollData.map((option) => (
              <PollOption key={option.id} option={{ ...option, totalVotes }} />
            ))}
          </div>
        </div>

        <div className="flex justify-end mb-6 mt-8 gap-4">
          <button className="flex items-center gap-2 cursor-pointer bg-linear-to-r from-[#8F64E1] to-[#1D68BD] text-white text-sm font-medium px-5 py-3 rounded-full shadow">
            + Ask new question
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherQuePage;
