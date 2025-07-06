import { useEffect, useState } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';  // REMOVED PARAMS BECAUSE WERE NOT USING IT ANYMORE DUE TO JWT DECODING

const baseUrl = `${import.meta.env.VITE_API_URL}/api/users`;

const UserProfile = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [otherImages, setOtherImages] = useState([null, null, null]);
  const [otherImageFiles, setOtherImageFiles] = useState([null, null, null]);
  const allInterests = ['Video Games', 'Board Games', 'Sports', 'Music', 'Fitness'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${baseUrl}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUser(data);
        setFormData(data);
        if (data.profileImageUrl) {
          setMainImage(`${import.meta.env.VITE_API_URL}/uploads/${data.profileImageUrl}`);
        }
        if (data.otherImages && data.otherImages.length > 0) {
          const imageUrls = data.otherImages.map(filename =>
            filename ? `${import.meta.env.VITE_API_URL}/uploads/${filename}` : null
          );
          setOtherImages(imageUrls);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setIsEditing(true);
      if (index === 'main') {
        setMainImage(URL.createObjectURL(file));
        setMainImageFile(file);
      } else {
        const updated = [...otherImages];
        const updatedFiles = [...otherImageFiles];
        updated[index] = URL.createObjectURL(file);
        updatedFiles[index] = file;
        setOtherImages(updated);
        setOtherImageFiles(updatedFiles);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = () => {
    if (!isEditing) setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      let updatedFields = { ...formData };
      const imageForm = new FormData();
      if (mainImageFile) imageForm.append('main', mainImageFile);
      otherImageFiles.forEach((file, i) => {
        if (file) imageForm.append(`other${i}`, file);
      });

      if (mainImageFile || otherImageFiles.some(f => f)) {
        const imgRes = await fetch(`${baseUrl}/me/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: imageForm,
        });
        const imgData = await imgRes.json();
        if (imgData.profileImageUrl) {
          updatedFields.profileImageUrl = imgData.profileImageUrl;
          setMainImage(`${import.meta.env.VITE_API_URL}/uploads/${imgData.profileImageUrl}`);
        }
        if (imgData.otherImages) {
          updatedFields.otherImages = imgData.otherImages;
          const updatedPreviews = imgData.otherImages.map(filename =>
            filename ? `${import.meta.env.VITE_API_URL}/uploads/${filename}` : null
          );
          setOtherImages(updatedPreviews);
        }
      }

      const res = await fetch(`${baseUrl}/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) throw new Error('Failed to update profile');
      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to update profile.');
    }
  };

  const sectionStyle = {
    backgroundColor: '#b0b0b0',
    color: '#000',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  if (!user) {
    return <Typography sx={{ color: '#fff', p: 4 }}>Loading profile...</Typography>;
  }


  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const interestOptions = [
    'Sports',
    'Board Games',
    'Video Games',
  ];

  // ================================ MAIN RETURN/CONTENT START FROM HERE ================================

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#2D3932',
        minHeight: '100vh',
        minWidth: '100vw',
        padding: 4,
        gap: 4,
        justifyContent: 'center',
      }}
    >
      {/* LEFT - IMAGES */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 7 }}>
        <Paper elevation={4} sx={{ padding: 2, backgroundColor: '#b0b0b0' }}>
          <Avatar
            src={mainImage}
            sx={{ width: 340, height: 340 }}
          >
            {!mainImage && user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Button variant="contained" component="label" sx={{ mt: 1 }}>
            Upload Main
            <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange('main', e)} />
          </Button>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {otherImages.map((img, idx) => (
            <Paper
              key={idx}
              elevation={4}
              sx={{
                backgroundColor: '#b0b0b0',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 2,
              }}
            >
              <Avatar
                src={img}
                sx={{ width: 160, height: 160 }}
              />
              <Button
                variant="outlined"
                component="label"
                sx={{ mt: 1, fontSize: '1.7rem' }}
              >
                +
                <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(idx, e)} />
              </Button>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* RIGHT - PROFILE DETAILS */}
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Button
          onClick={() => navigate('/home')}  // fixed this it was set to the login page for some reason.. Just changed it to homepage.
          variant="outlined"
          sx={{ mb: 2, color: '#fff', borderColor: '#fff' }}
        >
          ⬅ Back to Homepage
        </Button>

        <Paper elevation={4} sx={{ ...sectionStyle, mb: 3 }}>
          <Avatar
            src={mainImage}
            sx={{ width: 80, height: 80, bgcolor: '#FF5722', mx: 'auto' }}
          >
            {!mainImage && user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="h5" sx={{ mt: 1 }}>{user.username}</Typography>
          <Typography variant="body2">{user.email}</Typography>
        </Paper>

        {/* Personal info section */}
        <Paper elevation={4} sx={sectionStyle}>
          <Typography variant="h6">Personal Info</Typography>
          <TextField
            label="Birthdate"
            name="birthdate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.birthdate ? formData.birthdate.split('T')[0] : ''}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />
          {/* Commenting this out for now because we *MAY* use this in the future.  Some trainers/Pros may want to know before hand what client stats are like
          <TextField label="Height" name="height" value={formData.height || ''} onChange={handleChange} onFocus={handleFocus} InputProps={{ style: { backgroundColor: '#b0b0b0' }, readOnly: !isEditing }} />
          <TextField label="Weight" name="weight" value={formData.weight || ''} onChange={handleChange} onFocus={handleFocus} InputProps={{ style: { backgroundColor: '#b0b0b0' }, readOnly: !isEditing }} /> */}
        </Paper>

        {/* Bio Section */}
        <Paper elevation={4} sx={sectionStyle}>
          <Typography variant="h6">About Me</Typography>
          <TextField fullWidth name="bio" label="Your Bio" multiline rows={3} value={formData.bio || ''} onChange={handleChange} onFocus={handleFocus} InputProps={{ readOnly: !isEditing }} />
        </Paper>

        {/* Interests section */}
        <Paper elevation={4} sx={sectionStyle} onClick={() => {
          if (!isEditing) setIsEditing(true);
        }}>
          <Typography variant="h6" gutterBottom>Interests</Typography>

          {isEditing ? (
            interestOptions.map((interest) => (
              <FormControlLabel
                key={interest}
                control={
                  <Checkbox
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                  />
                }
                label={interest}
              />
            ))
          ) : (
            <Box sx={{ ml: 1 }}>
              {formData.interests.length ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.interests.map((interest) => (
                    <Box
                      key={interest}
                      sx={{
                        px: 2,
                        py: 0.5,
                        backgroundColor: '#FF5722',
                        color: 'white',
                        borderRadius: '16px',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                      }}
                    >
                      {interest}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">No interests selected.</Typography>
              )}
            </Box>
          )}
        </Paper>


        {/* Payment and rating section */}
        <Paper elevation={4} sx={sectionStyle}>
          <Typography variant="h6">Pro Coaching</Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isPro || false}
                onChange={(e) =>
                  setFormData({ ...formData, isPro: e.target.checked })
                }
                onFocus={handleFocus}
              />
            }
            label="I'm a Pro who can teach or coach"
          />

          {formData.isPro && (
            <>
              <TextField
                label="Hourly Rate ($)"
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate || ''}
                onChange={handleChange}
                onFocus={handleFocus}
                InputProps={{ readOnly: !isEditing }}
                sx={{ mt: 2 }}
              />
              <Box
                sx={{
                  borderLeft: '4px solid #FF5722',
                  pl: 1.5,
                  mt: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: 'black' }}>
                  What I'm Offering
                </Typography>
              </Box>


              <TextField
                label="Service Details"
                name="proDescription"
                multiline
                rows={3}
                value={formData.proDescription || ''}
                onChange={handleChange}
                onFocus={handleFocus}
                InputProps={{ readOnly: !isEditing }}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </Paper>

        {/* Socials section */}
        <Paper elevation={4} sx={sectionStyle}>
          <Typography variant="h6">Social Links</Typography>
          <TextField name="instagram" label="Instagram" value={formData.instagram || ''} onChange={handleChange} onFocus={handleFocus} InputProps={{ readOnly: !isEditing }} />
          <TextField name="facebook" label="Facebook" value={formData.facebook || ''} onChange={handleChange} onFocus={handleFocus} InputProps={{ readOnly: !isEditing }} />
          <TextField name="x" label="X (Twitter)" value={formData.x || ''} onChange={handleChange} onFocus={handleFocus} InputProps={{ readOnly: !isEditing }} />
          <TextField name="bluesky" label="Bluesky" value={formData.bluesky || ''} onChange={handleChange} onFocus={handleFocus} InputProps={{ readOnly: !isEditing }} />
        </Paper>

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
