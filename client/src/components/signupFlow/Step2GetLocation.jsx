import React from "react";
import { Typography, Button, Box } from '@mui/material';

const Step2GetLocation = ({ formData, setFormData, onNext, onBack  }) => { 


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
      const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
      const data = await res.json();

      if (!data.results.length) {
        throw new Error('No location results found');
      }

      const components = data.results[0].components;
      const city = components.city || components.town || components.village || 'Unknown';
      
      setFormData({
        ...formData,
        location: { lat: latitude, lng: longitude },
        city: city
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
  

// --------------------------- RENDER CONTENT FROM HERE DOWN -----------------------------------------------\
      return (
        <>
          <Typography variant="h6" gutterBottom>
            What is your location?
          </Typography>
    
          <Button
            variant="contained"
            sx={{ backgroundColor: 'white', color: '#b34725', mb: 2 }}
            onClick={handleGetLocation}
          >
            Use My Current Location
          </Button>
    
          {formData.city && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              {formData.city}
            </Typography>
)}

          <Box sx={{ display: 'flex', mt: 3, }}>
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
              disabled={!formData.location?.lat}
            >
              Next
            </Button>
          </Box>
        </>
      );
}

export default Step2GetLocation