import React from "react";
import { useNavigate } from "react-router";
import { FiAlertCircle } from "react-icons/fi";

const KickOut: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 sora">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 rounded-full p-4">
            <FiAlertCircle className="w-16 h-16 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You've Been Removed
        </h1>

        <p className="text-gray-600 mb-8 text-lg">
          The teacher has removed you from this polling session. Thank you for
          participating!
        </p>

        {/* Button */}
        <button
          onClick={handleGoHome}
          className="w-full bg-linear-to-r from-[#8F64E1] to-[#A78BFA] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
        >
          Return to Home
        </button>

        <p className="text-gray-500 text-sm mt-6">
          If you believe this was a mistake, please contact your teacher.
        </p>
      </div>
    </div>
  );
};

export default KickOut;
