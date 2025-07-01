// this is what's talking to the Step2GetLocation.jsx
// but also is tied in with the index.css for the Google Places input override <--

import React from 'react';
import GooglePlacesAutocomplete from 'react-google-autocomplete';

const LocationInput = ({ onPlaceSelected }) => {
  return (
    <GooglePlacesAutocomplete
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onPlaceSelected={onPlaceSelected}
      options={{
        types: ['(cities)'],
        componentRestrictions: { country: [] }, // Optional: Restrict to certain countries
      }}
      placeholder="Enter your city..."
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
      }}
    />
  );
};

export default LocationInput;
