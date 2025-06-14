import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
} from '@mui/material';
import { useParams } from 'react-router-dom';

const baseUrl = `${import.meta.env.VITE_API_URL}/api/users`;


const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${baseUrl}/${userId}`);
        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = () => {
    if (!isEditing) setIsEditing(true);
  };

  const handleSave = async () => {
  try {
    const userId = localStorage.getItem('userId'); // Or get from route
    const res = await fetch(`${baseUrl}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), // 🧠 sends the updated fields
    });

    if (!res.ok) throw new Error('Failed to update profile');
    
    const updatedUser = await res.json();
    setUser(updatedUser); // Update local state with latest info
    setIsEditing(false);
    alert('Profile updated successfully!');
  } catch (err) {
    console.error('Error saving profile:', err);
    alert('Failed to update profile.');
  }
};

const calculateAge = (dob) => {
  if (!dob) return '';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
  
  if (!user) return <Typography>Loading profile...</Typography>;

  const sectionStyle = {
    backgroundColor: '#b0b0b0',
    color: '#000',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        {/* Avatar + Email */}
        <Paper elevation={4} sx={sectionStyle}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#FF5722', mx: 'auto' }}>
            {user.username[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="h5">{user.username}</Typography>
          <Typography variant="body2">{user.email}</Typography>
        </Paper>

        {/* Personal Info */}
        <Paper elevation={4} sx={sectionStyle}>
          <Typography variant="h6">Personal Info</Typography>
          <TextField
            label="Birthdate"
            name="birthdate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.birthdate || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />
          <TextField
            label="Height"
            name="height"
            value={formData.height || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ style: { backgroundColor: '#b0b0b0' }, readOnly: !isEditing }}
          />
          <TextField
            label="Weight"
            name="weight"
            value={formData.weight || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ style: { backgroundColor: '#b0b0b0' }, readOnly: !isEditing }}
          />
        </Paper>

        {/* Bio */}
        <Paper elevation={4} sx={sectionStyle}>
          <Typography variant="h6">About Me</Typography>
          <TextField
            fullWidth
            name="bio"
            label="Your Bio"
            multiline
            rows={3}
            value={formData.bio || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />
        </Paper>

        {/* Interests */}
        <Paper elevation={4} sx={sectionStyle}>
          <Typography variant="h6">Interests</Typography>
          <TextField
            fullWidth
            name="interests"
            label="Comma-separated"
            value={formData.interests?.join(', ') || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                interests: e.target.value.split(',').map((s) => s.trim()),
              })
            }
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />
        </Paper>

        {/* Socials */}
        <Paper elevation={4} sx={sectionStyle}>
          <Typography variant="h6">Social Links</Typography>
          <TextField
            name="instagram"
            label="Instagram"
            value={formData.instagram || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />
          <TextField
            name="facebook"
            label="Facebook"
            value={formData.facebook || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />
          <TextField
            name="x"
            label="X (Twitter)"
            value={formData.x || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />
          <TextField
            name="bluesky"
            label="Bluesky"
            value={formData.bluesky || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />
        </Paper>

        {/* Button */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            variant="contained"
            color="warning"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            sx={{ borderRadius: '12px', fontWeight: 'bold' }}
          >
            {isEditing ? 'Save My Profile' : 'Edit My Profile'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
