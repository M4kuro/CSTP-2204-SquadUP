import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';
import { getUserIdFromToken } from '../utils/auth';
import UserSidebar from '../components/UserMainSideBarControl';
import { Box } from '@mui/material';

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
                setThreads(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('🚨 Error fetching threads:', err);
                setThreads([]);
            }
        };

        fetchThreads();
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <UserSidebar               
                navigate={navigate}
            />
            
            <Box sx={{
                flex: 1,
                p: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                ml: 50
            }}>
                <h2>Your Conversations</h2>

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
            </Box>
        </Box>
    );
};

export default MessagesPage;
