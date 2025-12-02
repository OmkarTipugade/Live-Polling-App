import React, { useState } from "react";
import { LuMessageSquare } from "react-icons/lu";
import { useSocketEvent, useSocketEmit } from "../hooks/useSocketEvent";
import {
  SOCKET_EVENTS,
  type ChatMessage,
  type Participant,
} from "../utils/socketEvents";
import { toast } from "react-toastify";
import toastOptions from "../utils/ToastOptions";

interface messageType {
  id: number;
  text: string;
  sender: string;
  senderRole: string;
}

const ChatBox: React.FC<{ accessor: string }> = ({ accessor }) => {
  const { emit } = useSocketEmit();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [messages, setMessages] = useState<messageType[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const sessionId = localStorage.getItem("sessionId");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // Listen for new messages
  useSocketEvent<ChatMessage>(SOCKET_EVENTS.NEW_MESSAGE, (data) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: data.message,
        sender: data.senderName,
        senderRole: data.senderRole,
      },
    ]);
  });

  // Listen for participant updates
  useSocketEvent<{ participants: Participant[] }>(
    SOCKET_EVENTS.UPDATE_PARTICIPANTS,
    (data) => {
      setParticipants(data.participants);
    }
  );



  const handleChatIconClick = () => {
    setIsOpen(!isOpen);
  };

  const handleKickOut = (studentId: string) => {
    if (!sessionId) {
      toast.error("No active session", toastOptions);
      return;
    }

    // Emit kick event via socket
    emit(SOCKET_EVENTS.STUDENT_KICKED, {
      sessionId,
      studentId,
    });

  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    if (!sessionId || !userId) {
      toast.error("Session information missing", toastOptions);
      return;
    }

    // Emit message via socket
    emit(SOCKET_EVENTS.SEND_MESSAGE, {
      sessionId,
      senderId: userId,
      senderRole: role as "teacher" | "student",
      message: inputMessage,
    });

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
              Participants ({participants.length})
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 bg-white flex-1 overflow-y-auto">
            {activeTab === "chat" && (
              <>
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={
                        message.senderRole === role ? "text-right" : "text-left"
                      }
                    >
                      <p
                        className={`text-sm font-semibold ${
                          message.senderRole === role
                            ? "text-black"
                            : "text-purple-800"
                        }`}
                      >
                        {message.sender}
                      </p>
                      <div
                        className={`px-3 py-2 mt-1 rounded-lg w-fit max-w-[70%] ${
                          message.senderRole === role
                            ? "bg-[#8F64E1] text-white ml-auto"
                            : "bg-black text-white mr-auto"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === "participants" && (
              <>
                {accessor === "teacher" && (
                  <>
                    <div className="flex justify-between text-[#726F6F] px-3">
                      <span>Name</span>
                      <span>Action</span>
                    </div>
                    <div className="text-gray-600">
                      {participants.length === 0 ? (
                        <div className="text-center text-gray-500 mt-8">
                          No students have joined yet
                        </div>
                      ) : (
                        <ul className="list-disc pl-5">
                          {participants.map((p) => (
                            <div key={p.id} className="flex justify-between">
                              <span className="text-black">{p.name}</span>
                              <button
                                onClick={() => handleKickOut(p.id)}
                                className="text-[#1D68BD] px-3 py-2 mt-1 underline cursor-pointer rounded-lg hover:opacity-80 transition"
                              >
                                kick out
                              </button>
                            </div>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
                {accessor === "student" && (
                  <div className="text-gray-600">
                    {participants.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        No other students in the session
                      </div>
                    ) : (
                      <ul className="list-disc pl-5">
                        {participants.map((p) => (
                          <li key={p.id} className="text-black">
                            {p.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
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
                className="bg-[#8F64E1] text-white px-4 rounded-md hover:opacity-90 transition"
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
