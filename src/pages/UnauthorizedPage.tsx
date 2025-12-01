import { useNavigate } from "react-router";
import BadgeStar from "../components/BadgeStar";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 sora">
      <div className="w-full max-w-md md:max-w-2xl text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center justify-center">
          <BadgeStar />
        </div>

        <div className="space-y-4">
          <div className="text-6xl sm:text-7xl">🔒</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-black">
            Access <span className="font-semibold">Denied</span>
          </h1>
          <p className="text-[#5C5B5B] text-sm sm:text-base md:text-lg max-w-full md:max-w-xl mx-auto px-2 sm:px-0">
            You don't have permission to access this page. Please select your
            role on the landing page to continue.
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full max-w-[234px] h-[52px] sm:h-[58px] mx-auto rounded-full bg-linear-to-r from-[#8F64E1] to-[#1D68BD] text-base sm:text-lg font-semibold text-white hover:opacity-90 transition"
        >
          Go to Home
        </button>
      </div>
    </main>
  );
};

export default UnauthorizedPage;
