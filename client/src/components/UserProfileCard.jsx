import React from 'react';
import { Box, Typography, Paper, Button, Avatar } from '@mui/material';

const UserProfileCard = ({ user, onBack }) => {
  // Utility to calculate age from birthdate
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birth = new Date(dob);
    const ageDiffMs = Date.now() - birth.getTime();
    return Math.floor(ageDiffMs / (1000 * 60 * 60 * 24 * 365.25));
  };


  // --------------------------- RENDER CONTENT FROM HERE DOWN -----------------------------------------------\
  return (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        backgroundColor: '#2D3932',
        minHeight: '100vh',
        minWidth: '100vw',
        padding: 4,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          backgroundColor: '#b0b0b0',
          color: '#000',
          padding: 4,
          width: '100%',
          maxWidth: 600,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ width: 70, height: 70, bgcolor: '#FF5722' }}>
            {user.username[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.username}</Typography>
            <Typography variant="body2">{user.email}</Typography>
            <Typography variant="body2">Age: {calculateAge(user.birthdate)}</Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mt: 3 }}>About Me</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{user.bio || 'No bio provided.'}</Typography>

        <Typography variant="h6">Interests</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {user.interests?.length > 0 ? user.interests.join(', ') : 'No interests listed.'}
        </Typography>

        <Typography variant="h6">Location</Typography>
        <Typography variant="body1">{user.location?.city || 'N/A'}</Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={onBack}
          sx={{ mt: 3 }}
        >
          Back to Grid
        </Button>
      </Paper>
    </Box>
  );
};

export default UserProfileCard;
