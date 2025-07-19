import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';
import { getUserIdFromToken } from '../utils/auth';

const MessagesPage = () => {
    const [threads, setThreads] = useState([]);
    const navigate = useNavigate();

    const userId = getUserIdFromToken();

    const backendBase = import.meta.env.PROD
    ? 'https://cstp-2204-squadup-production.up.railway.app'
    : 'http://localhost:5000';

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const res = await api.get(`/chat/threads/${userId}`);
                console.log('🧵 Thread response:', res.data);
                setThreads(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('🚨 Error fetching threads:', err);
                setThreads([]);
            }
        };

        fetchThreads();
    }, []);

    return (

        <div className="messages-container">
            <button
                onClick={() => navigate('/home')}
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
                ← Back to Homepage
            </button>
            <h2 className="messages-title">Your Conversations</h2>

            <div className="messages-wrapper-container">
                <div className="message-wrapper">
                    <ul className="message-list">
                        {threads.map((thread) => {
                            const otherUser = thread.participants.find(p => p._id.toString() !== userId);
                            return (
                                <li
                                    key={thread._id}
                                    onClick={() => navigate(`/messages/${thread._id}`)}
                                    className="message-card"
                                >
                                    <img
                                        src={
                                            otherUser?.profileImageUrl
                                                ? `${backendBase}/uploads/${otherUser.profileImageUrl}`
                                                : '/default-avatar.png'
                                        }
                                        alt="avatar"
                                        className="message-avatar"
                                    />
                                    <div className="message-content">
                                        <p className="message-username">{otherUser?.username || 'Unknown User'}</p>
                                        <p className="message-subtext">Click to open chat</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>

    );


};

export default MessagesPage;
