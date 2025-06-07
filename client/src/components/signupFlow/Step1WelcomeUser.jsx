import React from "react";
import { TextField, Button, Typography } from '@mui/material';

const Step1WelcomeUser = ({ formData, setFormData, onNext }) => {
    return (
      <>
        <Typography variant="h6" gutterBottom>
          Welcome! What’s your name?
        </Typography>
        <TextField
          fullWidth
          label="Enter your username"
          variant="filled"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          sx={{ backgroundColor: 'white', mb: 2 }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: 'white', color: '#b34725' }}
          onClick={onNext}
          disabled={!formData.username.trim()}
        >
          Next
        </Button>
      </>
    );
  };
  
  export default Step1WelcomeUser;