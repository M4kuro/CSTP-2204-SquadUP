import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import socket from "../socket";
import { Box, Typography, Avatar } from "@mui/material";
import { getUserIdFromToken } from "../utils/auth"; // Use this instead of redefining

const ChatPage = () => {
  console.log("ChatPage mounted");
  const userId = getUserIdFromToken();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageContainerRef = useRef(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await api.get(`/chat/threads/${userId}`);
        setThreads(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching threads:", err);
      }
    };

    fetchThreads();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedThread) return;

      try {
        const res = await api.get(`/chat/message/${selectedThread._id}`);
        const sorted = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sorted);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [selectedThread]);

  useEffect(() => {
    socket.emit("join", userId);

    socket.on("receiveMessage", (msg) => {
      if (msg.threadId === selectedThread?._id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedThread]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight + 100;

    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      threadId: selectedThread._id,
      sender: userId,
      content: newMessage,
    };

    try {
      await api.post(`/chat/message`, newMsg);
      socket.emit("sendMessage", newMsg);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "50% 50%",
          width: "80%",
          height: "100%",
          ml: "370px",
          position: "Fixed",
        }}
      >
        {/* Left: Threads */}
        <Box
          sx={{
            width: "80%",
            height: "100%",
            overflowY: "auto",
            padding: 2,
            boxSizing: "border-box",
            fontFamily: "Michroma",
          }}
        >
          <Typography fontFamily={"Michroma"} fontSize={20} mb={3}>
            Your Conversations
          </Typography>

          {threads.map((thread) => {
            const otherUser = thread.participants.find(
              (p) => p._id.toString() !== userId
            );

            return (
              <Box
                key={thread._id}
                onClick={() => setSelectedThread(thread)}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 1.5,
                  marginBottom: 1,
                  borderRadius: 2,
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <Avatar
                  src={
                    otherUser?.profileImageUrl
                      ? `/uploads/${otherUser.profileImageUrl}`
                      : "/default-avatar.png"
                  }
                  alt={otherUser?.username || "Unknown User"}
                  sx={{ width: 60, height: 60, marginRight: 2 }}
                />

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {otherUser?.username || "Unknown User"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click to open chat
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Right: Chat Window */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "500px",
            overflowY: "auto",
            fontFamily: "Michroma",
          }}
        >
          {selectedThread ? (
            <>
              <h2>Chat</h2>
              <div
                ref={messageContainerRef}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "10px",
                  marginBottom: "10px",
                  background: "#111",
                  color: "white",
                  borderRadius: "10px",
                  
                  
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    style={{
                      backgroundColor:
                        msg.sender === userId ? "#ffbf00d8" : "#444",
                      padding: "10px",
                      borderRadius: "10px",
                      margin: "5px 0",
                      alignSelf:
                        msg.sender === userId ? "flex-end" : "flex-start",
                      maxWidth: "60%",
                    }}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleSendMessage}
                style={{ display: "flex", gap: "8px" }}
              >
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid gray",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#ffbf00d8",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <p>Select a conversation to start chatting</p>
          )}
        </Box>
      </Box>
    );
};

export default ChatPage;
