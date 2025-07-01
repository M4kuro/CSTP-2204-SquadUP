import GooglePlacesAutocomplete from 'react-google-autocomplete';

const LocationInput = ({ onPlaceSelected }) => {
  return (
    <GooglePlacesAutocomplete
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}

      selectProps={{
        onChange: (place) => onPlaceSelected(place),
        placeholder: 'Enter your city...',
      }}
      autocompletionRequest={{
        types: ['(cities)'],
      }}
    />
  );
};

export default LocationInput;
