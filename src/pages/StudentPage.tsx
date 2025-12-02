import { useState } from "react";
import { useNavigate } from "react-router";
import { useSocketEmit } from "../hooks/useSocketEvent";
import { SOCKET_EVENTS } from "../utils/socketEvents";
import BadgeStar from "../components/BadgeStar";
import { toast } from "react-toastify";
import toastOptions from "../utils/ToastOptions";

const StudentPage: React.FC = () => {
  const navigate = useNavigate();
  const { emit } = useSocketEmit();
  const [name, setName] = useState<string>("");
  const [sessionCode, setSessionCode] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name", toastOptions);
      return;
    }

    if (!sessionCode.trim()) {
      toast.error("Please enter session code", toastOptions);
      return;
    }

    const userId = `student_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", name);
    localStorage.setItem("sessionId", sessionCode);
    localStorage.setItem("role", "student");

    emit(SOCKET_EVENTS.JOIN_SESSION, {
      sessionId: sessionCode,
      userId,
      userName: name,
      role: "student"
    });

    toast.success(`Welcome, ${name}!`, toastOptions);

    setTimeout(() => {
      navigate("/student/que");
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 sora">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl text-center space-y-6 sm:space-y-10">
        <div className="inline-flex items-center justify-center ">
          <BadgeStar />
        </div>

        <div className="space-y-3 md:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sora font-normal text-black">
            Let's <span className="font-semibold">Get Started</span>
          </h1>
          <p className="text-[#5C5B5B] text-sm sm:text-base md:text-lg max-w-full md:max-w-2xl lg:max-w-3xl mx-auto px-2 sm:px-0">
            If you're a student, you'll be able to{" "}
            <strong className="text-black">submit your answers</strong>,
            participate in live polls, and see how your responses compare with
            your classmates.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6 w-full max-w-sm sm:max-w-md mx-auto"
        >
          <div className="text-left">
            <label
              htmlFor="name"
              className="block mb-2 text-sm sm:text-base font-medium text-black"
            >
              Enter your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Rahul Bajaj"
              className="w-full px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
            />
          </div>

          <div className="text-left">
            <label
              htmlFor="sessionCode"
              className="block mb-2 text-sm sm:text-base font-medium text-black"
            >
              Enter Session Code
            </label>
            <input
              id="sessionCode"
              type="text"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              required
              placeholder="ABC123"
              className="w-full px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 sm:py-4 text-base sm:text-lg rounded-full bg-linear-to-r from-[#8F64E1] to-[#1D68BD] text-white font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Continue
          </button>
        </form>
      </div>
    </main>
  );
};

export default StudentPage;
