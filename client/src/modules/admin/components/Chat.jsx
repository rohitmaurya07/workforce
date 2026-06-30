import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../../socket/socket";
import axiosInstance from "../../../api/axios";

const Avatar = ({ name, size = "md" }) => {
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const sz = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";

  return (
    <div
      className={`${sz} rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white flex-shrink-0`}
    >
      {initials}
    </div>
  );
};

const Chat = () => {
  const { task } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const projectId = task?._id;
  const bottomRef = useRef(null);

  // Join room, leave on unmount or projectId change
  useEffect(() => {
    if (!projectId) return;

    socket.emit("join-project", projectId);

    return () => {
      socket.emit("leave-project", projectId);
    };
  }, [projectId]);

  // Fetch old messages
  useEffect(() => {
    if (!projectId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/messages/${projectId}`, {
          withCredentials: true,
        });
        setMessages(data.messages ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [projectId]);

  // Listen for new messages / errors
  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    const handleMessageError = (err) => {
      console.error("Message error:", err?.message);
      setError(err?.message || "Failed to send message.");
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message-error", handleMessageError);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message-error", handleMessageError);
    };
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed || !projectId || !user?._id) return;

    socket.emit("send-message", {
      projectId,
      sender: user._id,
      text: trimmed,
    });

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  useEffect(() => {
    console.log("projectId on mount:", projectId);
  }, [projectId]);

  return (
    <div className="bg-slate-900 border border-4 border-slate-800 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
          Project Chat
        </p>
        <span className="text-xs text-slate-600 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
          {messages.length}
        </span>
      </div>

      {error && (
        <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="space-y-5 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No messages yet.</div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender?._id === user?._id;
// space-y-5 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent
            return (
              <div
                key={msg._id}
                className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
              >
                <Avatar name={msg.sender?.name} size="sm" />

                <div
                  className={`flex-1 max-w-[75%] rounded-xl px-4 py-3 ${isOwn
                      ? "bg-indigo-600 ml-auto"
                      : "bg-slate-800"
                    }`}
                >
                  <div
                    className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse justify-end" : "justify-between"
                      }`}
                  >
                    <span
                      className={`text-xs font-semibold ${isOwn ? "text-indigo-100" : "text-slate-200"
                        }`}
                    >
                      {isOwn ? "You" : msg.sender?.name}
                    </span>
                    <span
                      className={`text-[10px] ${isOwn ? "text-indigo-200/70" : "text-slate-500"
                        }`}
                    >
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p
                    className={`text-sm ${isOwn ? "text-white" : "text-slate-300"
                      }`}
                  >
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>


      {/* Send Message */}
      <div className="border-t border-slate-800 mt-5 pt-5 flex gap-3">
        <Avatar name={user?.name} size="sm" />
        <div className="flex-1">
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;