import React from "react";
import { Typography, Button, Box } from '@mui/material';

const Step2GetLocation = ({ formData, setFormData, onNext, onBack  }) => { 


    const handleGetLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setFormData({
                ...formData,
                location: { lat: latitude, lng: longitude }
              });
            },
            (error) => {
              alert('Location access denied or unavailable.');
              console.error(error);
            }
          );
        } else {
          alert('Geolocation is not supported by your browser.');
        }
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
    
          {formData.location?.lat && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Location set: {formData.location.lat.toFixed(2)}, {formData.location.lng.toFixed(2)}
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