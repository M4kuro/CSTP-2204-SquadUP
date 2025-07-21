import React from 'react';
import { Box, Typography } from '@mui/material';
import UserSidebar from '../components/UserMainSideBarControl'; 
import { useNavigate } from 'react-router-dom';

const HelpPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <UserSidebar
        navigate={navigate}
        setView={() => {}}
        setTabValue={() => {}}
        handleLogout={() => {}} // if needed, can log or do nothing
        currentUser={null}      // optional: or remove if the sidebar handles null fine
        incomingRequests={[]}   // optional: or remove if the sidebar handles it fine
      />

      <Box sx={{ p: 5, flex: 1 }}>
        <Typography variant="h3" gutterBottom>Help Center</Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to the SquadUP Help Center! Here are some common questions:
        </Typography>

        <ul>
          <li> How do I S+UP with someone?</li>
          <li> How do bookings work?</li>
          <li> How can I edit my profile?</li>
        </ul>

        <Typography variant="body2" mt={4}>
          Still need help? Email us at <strong>support@squadup.app</strong>
        </Typography>
      </Box>
    </Box>
  );
};

export default HelpPage;

