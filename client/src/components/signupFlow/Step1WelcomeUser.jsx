import {useState} from "react";
import { TextField, Button, Typography } from '@mui/material';

const Step1WelcomeUser = ({ formData, setFormData, onNext }) => {
  const [showNameInput, setShowNameInput] = useState(false);

  const handleNextClick = () => {
    if (showNameInput) {
      onNext(); 
    } else {
      setShowNameInput(true); 
    }
  };



// --------------------------- RENDER CONTENT FROM HERE DOWN -----------------------------------------------\
    return (
      <>
      
        {!showNameInput ? (
          <>
            <Typography variant="h5" gutterBottom>
              Welcome to SquadUp!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Connect with people who love the same games and activities as you. We’ll walk you through a few quick steps to get started.
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'white', color: '#b34725', mt: 3 }}
              onClick={handleNextClick}
            >
              Let’s Get Started
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              What’s your name?
            </Typography>
            <TextField
              fullWidth
              label="Username"
              variant="filled"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              sx={{ backgroundColor: 'white', mb: 2,
                '& .MuiFilledInput-root': {
                  '&:after': {
                    borderBottomColor: '#b34725  '  // your focus color here
                  },
                },
                '& label.Mui-focused': {
                  color: '#b34725  ', // label color on focus
                }, }}
              />
              
            <Button
              variant="contained"
              sx={{ backgroundColor: 'white', color: '#b34725' }}
              onClick={handleNextClick}
              disabled={!formData.username?.trim()}
            >
              Next
            </Button>
              
          </>
        )}
      </>
    );
  };
  
  export default Step1WelcomeUser;