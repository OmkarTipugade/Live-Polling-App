import { useEffect, useState } from "react";
import PollOption from "../components/PollOption";
import { api } from "../utils/api";
import { toast } from "react-toastify";
import toastOptions from "../utils/ToastOptions";
import { RiLoader4Fill } from "react-icons/ri";
import BadgeStar from "../components/BadgeStar";

interface PollType {
  question: string;
  options: {
    id: number;
    text: string;
    votes: number;
  }[];
  answer: string;
}

const PollHistory = () => {
  const [history, setHistory] = useState<PollType[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionId = sessionStorage.getItem("sessionId");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!sessionId) {
          toast.error("No session found", toastOptions);
          return;
        }

        const data = await api.getSessionHistory(sessionId);
        setHistory(data.history || []);
      } catch (error) {
        toast.error("Failed to load history", toastOptions);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 min-h-screen bg-white px-4 sora">
        <BadgeStar />
        <RiLoader4Fill className="animate-spin text-[#8F64E1] h-8 w-8" />
        <p className="text-black text-lg font-medium text-center">
          Loading poll history...
        </p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-white px-4 py-8 sora">
        <h1 className="text-[40px] relative text-center mb-8">
          View <span className="font-semibold">Poll History</span>
        </h1>
        <div className="text-center text-gray-500 mt-20">
          <p>No questions have been asked in this session yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 sora">
      <h1 className="text-[40px] relative text-center mb-8">
        View <span className="font-semibold">Poll History</span>
      </h1>
      {history.map((poll: PollType, index: number) => {
        const totalVotes = poll.options.reduce(
          (sum, opt) => sum + opt.votes,
          0
        );
        return (
          <div className="max-w-xl w-full mx-auto pt-8" key={index}>
            <div className="text-black font-semibold text-xl mb-5">
              Question {index + 1}
            </div>
            <div className="border border-[#AF8FF1] rounded-lg overflow-hidden shadow">
              <div className="bg-linear-to-r from-[#343434] to-[#6E6E6E] px-4 py-3">
                <span className="text-white font-semibold text-sm">
                  {poll.question}
                </span>
              </div>

              <div className="p-4 mt-4">
                {poll.options.map((option) => (
                  <PollOption
                    key={option.id}
                    option={{ ...option, totalVotes }}
                  />
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm">
                  <span className="font-semibold text-green-700">
                    ✓ Correct Answer:
                  </span>{" "}
                  <span className="text-gray-800">{poll.answer}</span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PollHistory;
