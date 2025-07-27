import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import socket from "../socket";
import UserSidebar from "../components/UserMainSideBarControl";
import { Box } from "@mui/material";

const ChatRoomPage = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageContainerRef = useRef(null);

  function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const base64 = token.split(".")[1];
      const decoded = JSON.parse(atob(base64));
      return decoded.id || decoded.userId;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  }

  const currentUserId = getUserIdFromToken();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/message/${threadId}`);
        const sorted = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
        setMessages(sorted);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [threadId]);

  useEffect(() => {
    socket.emit("join", currentUserId);

    socket.on("receiveMessage", (msg) => {
      if (msg.threadId === threadId) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [threadId]);

  // this useeffect scrolls to the bottom based on last message

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 100;

    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      threadId,
      sender: currentUserId,
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
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          backgroundColor: "black",
          color: "white",
          padding: "40px",
          minHeight: "60vh",
          flex: 1,
          display: "flex",
          maxWidth: "900px",
          flexDirection: "column",
          margin: "auto",
          ml: "500px", // pushes it to the right
          mr: "60px",
        }}
      >
        <button
          onClick={() => navigate("/messages")}
          style={{
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ← Back to Messages
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Chat with your match
        </h2>

        <div
          ref={messageContainerRef}
          style={{
            backgroundColor: "black",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
            maxHeight: "60vh", // 👈 limits height
            overflowY: "auto",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg._id || Math.random()}
              style={{
                backgroundColor:
                  msg.sender === currentUserId ? "#ffbf00d8" : "#666",
                color: "white",
                padding: "10px 15px",
                borderRadius: "20px",
                marginBottom: "10px",
                maxWidth: "60%",
                alignSelf:
                  msg.sender === currentUserId ? "flex-end" : "flex-start",
              }}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSendMessage}
          style={{ display: "flex", width: "100%" }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px 0 0 8px",
              border: "none",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#ffbf00d8",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "0 8px 8px 0",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </Box>
    </Box>
  );
};

export default ChatRoomPage;
