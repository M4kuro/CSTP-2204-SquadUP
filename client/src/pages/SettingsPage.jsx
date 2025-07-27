import React from 'react';
import {
  Box, Typography, TextField, Button, Divider, Switch, FormControlLabel, List, ListItem, ListItemText
} from '@mui/material';
import UserSidebar from '../components/UserMainSideBarControl';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <UserSidebar
        navigate={navigate}
        setView={() => { }}
        setTabValue={() => { }}
        handleLogout={() => { }}
        currentUser={null}
        incomingRequests={[]}
      />

      <Box sx={{ flex: 1, p: 5 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Michroma, sans-serif', mb: 3 }}>
          Account Settings
        </Typography>

        {/* Username & Email */}
        <Typography variant="h6" sx={{ fontFamily: 'Michroma, sans-serif' }}>Personal Information</Typography>
        <TextField fullWidth label="Username" margin="normal" />
        <TextField fullWidth label="Email" type="email" margin="normal" />
        <Button variant="contained" sx={{ mt: 2 }}>Save Changes</Button>

        <Divider sx={{ my: 4 }} />

        {/* Password Change */}
        <Typography variant="h6" sx={{ fontFamily: 'Michroma, sans-serif' }}>Change Password</Typography>
        <TextField fullWidth label="Current Password" type="password" margin="normal" />
        <TextField fullWidth label="New Password" type="password" margin="normal" />
        <TextField fullWidth label="Confirm New Password" type="password" margin="normal" />
        <Button variant="contained" color="warning" sx={{ mt: 2 }}>Update Password</Button>

        <Divider sx={{ my: 4 }} />

        {/* Blocked Users */}
        <Typography variant="h6" sx={{ fontFamily: 'Michroma, sans-serif', mb: 1 }}>
          Blocked Users
        </Typography>

        <Box
          sx={{
            maxHeight: 300,
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: 2,
            p: 1,
            backgroundColor: '#f9f9f9',
          }}
        >
          <List>
            {/* Example Blocked Users */}
            {['User123', 'Player99', 'ToxicTim', 'SaltySarah', 'AFKAndy', 'SpammySam'].map((user, idx) => (
              <ListItem key={idx} secondaryAction={
                <Button color="error" variant="outlined" size="small">Unblock</Button>
              }>
                <ListItemText primary={user} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider sx={{ my: 4 }} />

        {/* Delete Account */}
        <Typography variant="h6" sx={{ fontFamily: 'Michroma, sans-serif', color: 'red' }}>Danger Zone</Typography>
        <Button variant="outlined" color="error" sx={{ mt: 2 }}>
          Delete My Account
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;

