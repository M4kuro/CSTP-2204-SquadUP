import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import socket from "../socket";
import { Box, Typography, Avatar } from "@mui/material";
import { getUserIdFromToken } from "../utils/auth";
import { useSearchParams } from "react-router-dom";

const ChatPage = () => {
  console.log("ChatPage mounted");
  const userId = getUserIdFromToken();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageContainerRef = useRef(null);
  const [searchParams] = useSearchParams();
  const directUserId = searchParams.get("userId");

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await api.get(`/chat/threads/${userId}`);
        const threadsData = Array.isArray(res.data) ? res.data : [];
        setThreads(threadsData);

        if (directUserId) {
          const matchedThread = threadsData.find((thread) =>
            thread.participants.some((p) => p._id.toString() === directUserId)
          );

          if (matchedThread) {
            setSelectedThread(matchedThread);
          } else {
            console.warn("No existing thread found for user:", directUserId);
          }
        }
      } catch (err) {
        console.error("Error fetching threads:", err);
      }
    };

    fetchThreads();
  }, [userId, directUserId]);

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

  const handleDeleteThread = async (threadId) => {
    try {
      await api.delete(`/chat/thread/${threadId}/${userId}`);
      setThreads((prev) => prev.filter((t) => t._id !== threadId));
      if (selectedThread?._id === threadId) {
        setSelectedThread(null);
      }
    } catch (err) {
      console.error("❌ Failed to delete thread:", err);
      alert("Could not delete thread.");
    }
  };

  const handleThreadClick = async (thread) => {
    setSelectedThread(thread);
    try {
      await api.post(`/chat/mark-thread-read/${thread._id}`, {
        userId,
      });

      const res = await api.get(`/chat/threads/${userId}`);
      setThreads(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error clearing unread status:", err);
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
        position: "fixed",
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
                position: "relative",
                backgroundColor:
                  selectedThread?._id === thread._id ? "#ffbf00" : "#ffffffff",
                "&:hover": {
                  backgroundColor:
                    selectedThread?._id === thread._id
                      ? "#848484ff"
                      : "#848484ff",
                },
              }}
              onClick={() => handleThreadClick(thread)}
            >
              {/* Delete button */}
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteThread(thread._id);
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 10,
                  background: "transparent",
                  border: "none",
                  fontSize: "16px",
                  color: "#888",
                  cursor: "pointer",
                  zIndex: 1,
                  "&:hover": {
                    color: "#ff4444",
                  },
                }}
              ></Box>

              {/* Avatar with unread indicator */}
              <Box sx={{ position: "relative", marginRight: 2 }}>
                <Avatar
                  src={
                    otherUser?.profileImageUrl?.startsWith("http")
                      ? otherUser.profileImageUrl
                      : otherUser?.profileImageUrl
                      ? `/uploads/${otherUser.profileImageUrl}`
                      : "/default-avatar.png"
                  }
                  alt={otherUser?.username || "Unknown User"}
                  sx={{ width: 60, height: 60 }}
                />
                {thread.unreadFor === userId && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "red",
                      borderRadius: "50%",
                      width: 12,
                      height: 12,
                      boxShadow: 1,
                    }}
                  />
                )}
              </Box>

              {/* User info */}
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
          width: "400px",
          overflowY: "auto",
          fontFamily: "Michroma",
        }}
      >
        {selectedThread ? (
          <>
            <Typography variant="h4" mb={2}>
              Chat
            </Typography>
            <Box
              ref={messageContainerRef}
              sx={{
                flex: 1,
                overflowY: "auto",
                padding: "10px",
                marginBottom: "10px",
                background: "#111",
                color: "white",
                borderRadius: "10px",
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {messages.map((msg) => (
                <Box
                  key={msg._id}
                  sx={{
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
                </Box>
              ))}
            </Box>
            <Box
              component="form"
              onSubmit={handleSendMessage}
              sx={{ display: "flex", gap: "8px" }}
            >
              <Box
                component="input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                sx={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid gray",
                  backgroundColor: "white",
                  color: "black",
                }}
              />
              <Box
                component="button"
                type="submit"
                sx={{
                  backgroundColor: "#ffbf00d8",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  color: "white",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#e6ac00",
                  },
                }}
              >
                Send
              </Box>
            </Box>
          </>
        ) : (
          <Typography>Select a conversation to start chatting</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
