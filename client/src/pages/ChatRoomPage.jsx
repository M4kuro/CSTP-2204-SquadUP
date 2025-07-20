import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import socket from '../socket';  // client/src/socket.js
import UserSidebar from '../components/UserMainSideBarControl'; 


const ChatRoomPage = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  // const currentUserId = '684a354fec7ec0473b7336fc'; // 🔐 replace with real user ID from JWT later


  // using existing JWT 

  function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const base64 = token.split('.')[1];
    const decoded = JSON.parse(atob(base64));
    return decoded.id || decoded.userId;
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}

const currentUserId = getUserIdFromToken();


  // Fetch messages on load
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/message/${threadId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [threadId]);

  // Join room and listen for incoming messages
  useEffect(() => {
  socket.emit('join', currentUserId);

  socket.on('receiveMessage', (msg) => {
    if (msg.threadId === threadId) {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        return exists ? prev : [...prev, msg];
      });
    }
  });

  return () => {
    socket.off('receiveMessage');
  };
}, [threadId]);

  // Handle message send
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
    socket.emit('sendMessage', newMsg); // let the socket handle display
    setNewMessage('');  // clears input after sending.
   
  } catch (err) {
    console.error('Error sending message:', err);
  }
};

  return (
    <div
      style={{
        backgroundColor: '#2c3934',
        color: 'white',
        padding: '40px',
        minHeight: '100vh',
        maxWidth: '900px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <button
        onClick={() => navigate('/messages')}
        style={{
          backgroundColor: '#FF5722',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        ← Back to Messages
      </button>

      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Chat with your match</h2>

      <div
        style={{
          backgroundColor: '#444',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg._id || Math.random()}
            style={{
              backgroundColor: msg.sender === currentUserId ? '#FF5722' : '#666',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '20px',
              marginBottom: '10px',
              maxWidth: '60%',
              alignSelf: msg.sender === currentUserId ? 'flex-end' : 'flex-start'
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage}
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '16px',
            borderRadius: '8px 0 0 8px',
            border: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#FF5722',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoomPage;
