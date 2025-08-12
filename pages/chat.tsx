// /pages/chat.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { FiSend } from "react-icons/fi";

let socket: any;

export default function ChatPage() {
  const router = useRouter();
  const { user } = router.query; // Name of person from URL
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );

  useEffect(() => {
    socket = io({
      path: "/api/socketio",
    });

    socket.on("message", (msg: { user: string; text: string }) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMsg = { user: "Me", text: message };
      socket.emit("message", newMsg);
      setMessages((prev) => [...prev, newMsg]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center shadow-md">
        <span className="text-lg font-semibold">
          {user ? decodeURIComponent(String(user)) : "Chat"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-xs ${
              msg.user === "Me"
                ? "bg-green-500 text-white ml-auto"
                : "bg-white text-black mr-auto"
            }`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-white flex items-center border-t">
        <input
          type="text"
          className="flex-1 p-2 border rounded-full outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-green-500 rounded-full text-white flex items-center justify-center"
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
}
