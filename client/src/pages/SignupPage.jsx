import React, {useState} from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    TextField, 
    Button, 
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    LinearProgress
  } from '@mui/material';


const SignupPage = () => {

    
  return (
    <>
        {/* Left Side */}
        <Box
          sx={{
            width: '50%',
            backgroundColor: '#2c3934',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}> 
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              width: '80%',
              maxWidth: 400,
              backgroundColor: '#b34725',
              color: 'white'
            }}
              >
            
          </Paper>
        </Box>
      
        {/* Right Side */}
        <Box
          sx={{
            width: '50%',
            backgroundColor: '#2c3934',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
          >
              <img src="/TranspLogo.png" alt="Logo" style={{ maxWidth: '80%' }} />
          
        </Box>
      </>

  );


};

export default SignupPage;