import { Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationInput from '../LocationInput'; // Ensure correct path

const Step2GetLocation = ({ formData, setFormData, onNext, onBack }) => {
  const handlePlaceSelected = (place) => {
    const components = place.address_components;

    const getComponent = (types) =>
      components.find((comp) => types.some((type) => comp.types.includes(type)))?.long_name || '';

    const city = getComponent(['locality', 'administrative_area_level_2']);
    const state = getComponent(['administrative_area_level_1']);
    const country = getComponent(['country']);

    setFormData({
      ...formData,
      city,
      state,
      country,
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
    });
  };

  const handleUseMyLocation = () => {
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

          setFormData({
            ...formData,
            city,
            state,
            country,
            location: { lat: latitude, lng: longitude },
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

  const isLocationReady = formData.city && formData.country;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Where are you located?
      </Typography>

      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', mb: 2 }}>
        <Tooltip title="Use My Current Location">
          <IconButton onClick={handleUseMyLocation} sx={{ mr: 1, color: '#FF5722' }}>
            <LocationOnIcon />
          </IconButton>
        </Tooltip>
        <LocationInput onPlaceSelected={handlePlaceSelected} />
      </Box>

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
