import { Typography, Button, Box, TextField } from '@mui/material';
import { useState } from 'react';

const Step2GetLocation = ({ formData, setFormData, onNext, onBack }) => {
  const [manualLocation, setManualLocation] = useState({
    city: formData.city || '',
    state: formData.state || '',
    country: formData.country || '',
  });

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    const updatedLocation = { ...manualLocation, [name]: value };
    setManualLocation(updatedLocation);
    setFormData({
      ...formData,
      location: null,
      city: updatedLocation.city,
      state: updatedLocation.state,
      country: updatedLocation.country,
    });
  };

  const handleGetLocation = () => {
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
          );
          const data = await res.json();

          if (!data.results.length) throw new Error('No location results found');

          const components = data.results[0].components;
          const city = components.city || components.town || components.village || '';
          const state = components.state || '';
          const country = components.country || '';

          setManualLocation({ city, state, country });

          setFormData({
            ...formData,
            location: { lat: latitude, lng: longitude },
            city,
            state,
            country,
          });
        } catch (err) {
          console.error('OpenCage error:', err);
          alert('Could not determine city from location.');
        }
      },
      (error) => {
        alert('Location access denied or unavailable.');
        console.error(error);
      }
    );
  };

  const isLocationReady =
    (formData.location && formData.city && formData.country) ||
    (manualLocation.city && manualLocation.state && manualLocation.country);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Where are you located?
      </Typography>

      {/* Manual Location Fields */}
      <TextField
        label="City"
        name="city"
        fullWidth
        sx={{ mb: 2 }}
        value={manualLocation.city}
        onChange={handleManualChange}
      />
      <TextField
        label="State / Province"
        name="state"
        fullWidth
        sx={{ mb: 2 }}
        value={manualLocation.state}
        onChange={handleManualChange}
      />
      <TextField
        label="Country"
        name="country"
        fullWidth
        sx={{ mb: 2 }}
        value={manualLocation.country}
        onChange={handleManualChange}
      />

      <Typography variant="body2" sx={{ mt: 1, mb: 2, fontStyle: 'italic', color: '#fff' }}>
        Or...
      </Typography>

      {/* Use My Location Button */}
      <Button
        variant="contained"
        sx={{ backgroundColor: 'white', color: '#b34725', mb: 2 }}
        onClick={handleGetLocation}
      >
        Use My Current Location
      </Button>

      {formData.city && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          📍 {formData.city}, {formData.state}, {formData.country}
        </Typography>
      )}

      <Box sx={{ display: 'flex', mt: 3 }}>
        <Button
          variant="outlined"
          sx={{ color: 'white', borderColor: 'white', mr: 1 }}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: 'white', color: '#b34725', ml: 1 }}
          onClick={onNext}
          disabled={!isLocationReady}
        >
          Next
        </Button>
      </Box>
    </>
  );
};

export default Step2GetLocation;
