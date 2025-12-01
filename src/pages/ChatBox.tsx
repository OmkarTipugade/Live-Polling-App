import React, { useState } from "react";
import { LuMessageSquare } from "react-icons/lu";

interface messageType {
  id: number;
  text: string;
  sender: string;
}
interface participantType {
  id: number;
  name: string;
}

const ChatBox: React.FC<{ accessor: string }> = ({ accessor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [messages, setMessages] = useState<messageType[]>([
    {
      id: 1,
      text: "Hello, how can I help?",
      sender: "user1",
    },
    {
      id: 2,
      text: "Hello, how can I help?",
      sender: "user2",
    },
  ]);

  const [participants, setParticipants] = useState<participantType[]>([
    { id: 1, name: "user1" },
    { id: 2, name: "user2" },
    { id: 3, name: "raj" },
    { id: 4, name: "mengo" },
    { id: 5, name: "kero" },
  ]);

  const [teacherMessage, setTeacherMessage] = useState([
    {
      id: 1,
      text: "Hello, how can I help?",
      sender: "teacher name",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const handleChatIconClick = () => {
    setIsOpen(!isOpen);
  };

  const handleKickOut = (id: number) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const role = localStorage.getItem("role");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    if (accessor === "teacher") {
      setTeacherMessage((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: inputMessage,
          sender: "Teacher",
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: inputMessage,
          sender: "Student",
        },
      ]);
    }

    setInputMessage("");
  };

  return (
    <>
      <button
        onClick={handleChatIconClick}
        className="fixed bottom-4 right-4 z-45 bg-[#5A66D1] p-4 rounded-full shadow-lg text-white cursor-pointer"
      >
        <LuMessageSquare className="w-6 h-6 text-white transform -scale-x-100" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 sora text-sm right-4 w-[429px] h-[477px] rounded-sm shadow-lg border border-gray-300 bg-white z-50 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-300 justify-start gap-x-4 pl-4">
            <button
              onClick={() => setActiveTab("chat")}
              className={`relative px-4 py-2 font-semibold ${
                activeTab === "chat"
                  ? "text-black border-b-2 border-[#8F64E1]"
                  : "text-gray-500 border-b-2 border-transparent"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              className={`relative px-4 py-2 font-semibold ${
                activeTab === "participants"
                  ? "text-black border-b-2 border-[#8F64E1]"
                  : "text-gray-500 border-b-2 border-transparent"
              }`}
            >
              Participants
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 bg-white flex-1 overflow-y-auto">
            {activeTab === "chat" && accessor === "teacher" && (
              <>
                {messages.map((message) => (
                  <div key={message.id} className="text-left">
                    <p className="text-sm text-purple-800 font-semibold">
                      {message.sender}
                    </p>
                    <div className="bg-black text-white px-3 py-2 mt-1 rounded-lg w-fit max-w-[70%] mr-auto">
                      {message.text}
                    </div>
                  </div>
                ))}

                {teacherMessage.map((message) => (
                  <div key={message.id} className="text-right">
                    <p className="text-sm text-black font-semibold">
                      {message.sender}
                    </p>
                    <div className="bg-[#8F64E1] text-white px-3 py-2 mt-1 rounded-lg w-fit max-w-[70%] ml-auto">
                      {message.text}
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === "participants" && accessor === "teacher" && (
              <>
                <div className="flex justify-between text-[#726F6F] px-3">
                  <span>Name</span>
                  <span>Action</span>
                </div>
                <div className="text-gray-600">
                  <ul className="list-disc pl-5">
                    {participants.map((p) => (
                      <div key={p.id} className="flex justify-between">
                        <span className="text-black">{p.name}</span>
                        {role === "student" && (
                          <button
                            onClick={() => handleKickOut(p.id)}
                            className="text-[#1D68BD] px-3 py-2 mt-1 underline cursor-pointer rounded-lg"
                          >
                            kick out
                          </button>
                        )}
                      </div>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
          
          {activeTab === "chat" && (
            <div className="border-t border-gray-300 p-3 flex gap-2">
              <input
                type="text"
                className="flex-1 border px-3 py-2 rounded-md focus:outline-none"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#8F64E1] text-white px-4 rounded-md"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBox;
