import { Box, Avatar, Typography, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
// importing these next 4 for help with logic on "New messages"
import { useEffect, useState } from 'react';
import api from '../api';
import { getUserIdFromToken } from '../utils/auth';
import socket from '../socket';


const UserSidebar = ({
  currentUser,
  incomingRequests = [],
  setView,
  setTabValue,
  navigate
}) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  //  adding this for unreadcount for messages:
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get(`/chat/unread/${userId}`);
        setUnreadCount(res.data.unreadCount || 0);
      } catch (err) {
        console.error('❌ Failed to get unread count:', err);
      }
    };

    fetchUnread();

    // 💬 Listen for incoming messages
    socket.on('receiveMessage', (msg) => {
      if (msg.sender !== userId) {
        fetchUnread();
      }
    });

    // 🧹 Cleanup on unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  return (
    <Box
      sx={{
        maxWidth: '500px',
        backgroundColor: '#000000ff',
        borderRadius: '20px',
        m: 3,
        boxShadow: 10,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,

      }}
    >
      {/* Top Avatar Section */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          src={
            currentUser?.profileImageUrl
              ? `${import.meta.env.VITE_API_URL}/uploads/${currentUser.profileImageUrl}`
              : '/placeholder-profile.png'
          }
          alt={currentUser?.username || 'User'}
          sx={{ width: 200, height: 200, mx: 'auto' }}
        />
        
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 3 }}>
        <Typography sx={{ color: 'white', textAlign: 'center', fontFamily: 'Michroma, sans-serif', fontSize: '20px' }}>
          {currentUser?.username || 'Unknown'}
        
        </Typography>
        <Typography sx={{ color: 'white', textAlign: 'center', fontFamily: 'Michroma, sans-serif', fontSize: '15px' }}>
          {currentUser?.email || ''}
        </Typography>

        {/* Homepage Button */}
        <Button
          variant="outlined"
          sx={buttonStyle}
          onClick={() => {
            setView?.('discover');     // Updating this because prabh wanted us to force discover view logic
            setTabValue?.(1);          // this matches the discover tab
            navigate('/home?view=discover');         // and keeps URL consistent
          }}
        >
          Home Page
        </Button>

        {/* MyProfile Button */}
        <Button variant="outlined" sx={buttonStyle} onClick={() => navigate('/profile')}>My Profile</Button>

        {/* Requests Button */}
        <Button variant="outlined" sx={buttonStyle} onClick={() => setView?.('requests')}>
          Requests {incomingRequests.length > 0 && `(${incomingRequests.length})`}
        </Button>

        {/* Squad Button */}
        <Button
          variant="outlined"
          sx={buttonStyle}
          onClick={() => {
            setView?.('matches');  // trying to ensure homepage fetches matches
            setTabValue?.(2);      // and also ensure the matches tab is highlighted
            navigate('/home?view=matches');  // trying to keep the URL updated with what prabh wanted 
          }}
        >
          Squad
        </Button>

        {/* Messages Button */}
        <Button
          variant="outlined"
          sx={buttonStyle}
          onClick={async () => {
            try {
              await api.post(`/chat/mark-all-read/${userId}`);
              setUnreadCount(0); // locally clear the badge
            } catch (err) {
              console.error('❌ Failed to mark messages as read:', err);
            }
            navigate('/messages');
          }}
        >
          Messages {unreadCount > 0 && `(${unreadCount})`}
        </Button>
      </Box>

      {/* Bottom Section */}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 10, p: 3 }}>

        {/* Settings Button */}
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          sx={{ ...buttonStyle, justifyContent: 'flex-start' }}
          fullWidth
          onClick={() => navigate('/settings')}
        >

          Settings
        </Button>

        {/* Help Button */}
        <Button
          variant="outlined"
          startIcon={<HelpIcon />}
          sx={{ ...buttonStyle, justifyContent: 'flex-start' }}
          fullWidth
          onClick={() => navigate('/help')}
        >
          Help
        </Button>

        {/* SignOut Button */}
        <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ ...buttonStyle, justifyContent: 'flex-start' }} fullWidth>
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

const buttonStyle = {
  color: 'white',
  '&:hover': { backgroundColor: '#585858ff' },
  borderColor: 'white',
  textTransform: 'none',
  fontFamily: 'Michroma, sans-serif',
};

export default UserSidebar;
