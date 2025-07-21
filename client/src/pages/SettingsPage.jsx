import React from 'react';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';
import UserSidebar from '../components/UserMainSideBarControl';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <UserSidebar navigate={navigate} />
      <Box sx={{ p: 5, flex: 1 }}>
        <Typography variant="h3">Settings</Typography>
      </Box>
    </Box>
  );
};

export default SettingsPage;
