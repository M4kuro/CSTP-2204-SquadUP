import { Typography, Button, Box, TextField, IconButton } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import Autocomplete from "react-google-autocomplete";
import { useState } from "react";

const Step2GetLocation = ({ formData, setFormData, onNext, onBack }) => {
  const [manualLocationText, setManualLocationText] = useState("");

  const handlePlaceSelected = (place) => {
    const address = place.address_components;

    const getPart = (type) => {
      const part = address.find((comp) => comp.types.includes(type));
      return part ? part.long_name : "";
    };

    const city = getPart("locality") || getPart("sublocality") || "";
    const state = getPart("administrative_area_level_1") || "";
    const country = getPart("country") || "";

    setManualLocationText(`${city}, ${state}, ${country}`);

    setFormData({
      ...formData,
      city,
      state,
      country,
      location: null,
    });
  };

  const handleUseMyLocation = () => {
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`,
          );
          const data = await res.json();

          if (!data.results.length)
            throw new Error("No location results found");

          const components = data.results[0].components;
          const city =
            components.city || components.town || components.village || "";
          const state = components.state || "";
          const country = components.country || "";

          setManualLocationText(`${city}, ${state}, ${country}`);

          setFormData({
            ...formData,
            city,
            state,
            country,
            location: { lat: latitude, lng: longitude },
          });
        } catch (err) {
          console.error("OpenCage error:", err);
          alert("Could not determine city from location.");
        }
      },
      (error) => {
        alert("Location access denied or unavailable.");
        console.error(error);
      },
    );
  };

  const isLocationReady = formData.city && formData.country;

  return (
    <>
      <Typography
        gutterBottom
        sx={{
          color: "#ffffffff",
          fontFamily: "Michroma, sans-serif",
          textAlign: "center",
          mb: 2,
          fontSize: "1.5rem",
        }}
      >
        Where are you located?
      </Typography>

      {/* Location Input Section with Pin on Left */}
      {/* added a component for location input.  Also updated the index.css for the Google Places input override */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <IconButton onClick={handleUseMyLocation} sx={{ color: "#fc0b0bff" }}>
          <PlaceIcon />
        </IconButton>

        <Autocomplete
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          onPlaceSelected={handlePlaceSelected}
          types={["(cities)"]}
          options={{
            fields: ["address_components", "geometry"],
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Start typing your city"
              variant="outlined"
              value={manualLocationText}
              onChange={(e) => setManualLocationText(e.target.value)}
              fullWidth
              sx={{ flexGrow: 1, fontSize: "1.2rem", height: "60px" }}
              InputProps={{
                ...params.InputProps,
                style: {
                  height: "65px",
                  fontSize: "1.2rem",
                  paddingLeft: "12px",
                },
                "& input": {
                  padding: "20px 14px",
                }, // More inner spacing
              }}
            />
          )}
        />
      </Box>

      {formData.city && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          📍 {formData.city}, {formData.state}, {formData.country}
        </Typography>
      )}

      <Box sx={{ display: "flex", mt: 3 }}>
        <Button
          variant="outlined"
          sx={{ color: "white", borderColor: "white", mr: 1 }}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          sx={{ backgroundColor: "white", color: "#000000ff", ml: 1 }}
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
