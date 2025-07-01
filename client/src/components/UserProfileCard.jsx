import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  TextField,
  Rating
} from '@mui/material';
import React, { useState, useEffect } from 'react';

const UserProfileCard = ({ user, onBack }) => {
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const currentUserId = localStorage.getItem('userId'); // or decode from JWT later

  const handleSubmitRating = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stars: newRating,
          comment: newComment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Rating submitted!');
        // You could optionally trigger a reload here
      } else {
        alert(data.message || 'Error submitting rating.');
      }
    } catch (err) {
      console.error('Rating error:', err);
      alert('Something went wrong.');
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birth = new Date(dob);
    const ageDiffMs = Date.now() - birth.getTime();
    return Math.floor(ageDiffMs / (1000 * 60 * 60 * 24 * 365.25));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
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
          maxWidth: '1500px', // or try '1000px' or remove it for full stretch
          flexGrow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={
              user.profileImageUrl
                ? `${import.meta.env.VITE_API_URL}/uploads/${user.profileImageUrl}`
                : undefined
            }
            alt={user.username}
            sx={{ width: 120, height: 120 }}
          >
            {!user.profileImageUrl && user.username[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.username}</Typography>

            {/* -- <Typography variant="body2">{user.email}</Typography> -- removing the display for user email we dont want 
            everyone to see eachothers email for spam/security reasons --  */}

            <Typography variant="body2">Age: {calculateAge(user.birthdate)}</Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mt: 3 }}>About Me</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{user.bio || 'No bio provided.'}</Typography>

        {/* Pro section */}
        {user.isPro && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #FF5722', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#FF5722' }}>🌟 <strong>Pro Coach Available!</strong></Typography>
            <Typography><strong>Hourly Rate:</strong> ${user.hourlyRate}/hr</Typography>
            <Typography><strong>What I'm Offering:</strong> {user.proDescription || 'No description provided.'}</Typography>
            {user.ratings?.length > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Rating
                  value={
                    user.ratings.reduce((sum, r) => sum + r.stars, 0) / user.ratings.length
                  }
                  precision={0.5}
                  readOnly
                />
                <Typography variant="body2">
                  ({user.ratings.length} rating{user.ratings.length > 1 ? 's' : ''})
                </Typography>
              </Box>
            ) : (
              <Typography>No ratings yet</Typography>
            )}
          </Box>
        )}

        {/* Leave a rating */}
        {user.isPro && !user.ratings?.some(r => r.userId === currentUserId) && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ color: '#FF5722' }}>Rate This Pro</Typography>
            <TextField
              type="number"
              label="Stars (1–5)"
              inputProps={{ min: 1, max: 5 }}
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Comment (optional)"
              fullWidth
              multiline
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="warning" onClick={handleSubmitRating}>
              Submit Rating
            </Button>
          </Box>
        )}

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
