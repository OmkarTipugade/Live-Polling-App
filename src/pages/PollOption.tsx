import React from "react";

interface optionType {
  id: number;
  text: string;
  votes: number;
  totalVotes: number;
}
const PollOption: React.FC<{ option: optionType }> = ({ option }) => {
  const percent =
    option.totalVotes > 0
      ? ((option.votes / option.totalVotes) * 100).toFixed(1)
      : 0;
  return (
    <div className="relative rounded-sm overflow-hidden mb-2 bg-[#F6F6F6] ">
      <div
        className="absolute top-0 left-0 h-full bg-[#8F64E1] transition-all duration-300"
        style={{ width: `${percent}%`, zIndex: 0 }}
      ></div>

      <div className="relative z-10 flex justify-between items-center px-4 py-2 border border-transparent rounded-md">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full text-[#8F64E1] bg-white flex items-center justify-center text-sm font-bold">
            {option.id}
          </div>
          <p className="text-sm font-medium text-black">{option.text}</p>
        </div>
        <p className="text-sm font-semibold text-black">{percent}%</p>
      </div>
    </div>
  );
};

export default PollOption;
