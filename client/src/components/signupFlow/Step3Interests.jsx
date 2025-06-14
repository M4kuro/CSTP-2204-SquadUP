import React from "react";
import { Typography, Button, Grid, Chip } from '@mui/material';

const options = ['Video Games', 'Sports', 'Board Games'];

const Step3Interests = ({ formData, setFormData, onNext, onBack  }) => { 
    const toggleInterest = (interest) => {
        const interests = formData.interests.includes(interest)
          ? formData.interests.filter((item) => item !== interest)
          : [...formData.interests, interest];
    
        setFormData({ ...formData, interests });
    };
    return (
        <>
          <Typography variant="h6" gutterBottom>
            What kind of activity are you interested in?
          </Typography>
    
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {options.map((option) => (
              <Grid item key={option}>
                <Chip
                  label={option}
                  clickable
                  color={formData.interests.includes(option) ? 'primary' : 'default'}
                  onClick={() => toggleInterest(option)}
                  sx={{
                    fontSize: '1rem',
                    padding: '10px',
                  }}
                />
              </Grid>
            ))}
        </Grid>
        
        <Button
          variant="outlined"
          sx={{ color: 'white', borderColor: 'white', mr: 2 }}
          onClick={onBack}
        >
            Back
        </Button>
    
          <Button
            variant="contained"
            sx={{ backgroundColor: 'white', color: '#b34725' }}
            onClick={onNext}
            disabled={formData.interests.length === 0}
          >
            Next
          </Button>
        </>
      );

}

export default Step3Interests