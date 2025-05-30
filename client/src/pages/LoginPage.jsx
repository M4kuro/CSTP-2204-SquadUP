import React, {useState} from 'react';
import { Grid, Box, TextField, Button, Typography, Paper, Checkbox, FormControlLabel } from '@mui/material';


const LoginPage = () => {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
    

  const validateInput = (input) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(input) || input.length >= 3;
  };

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
      <img src="/TranspLogo.png" alt="Logo" style={{ maxWidth: '80%' }} />
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
        {/* Your existing Paper content stays exactly the same */}
        <Typography variant="h5" gutterBottom>Login</Typography>
        <TextField fullWidth label="Username/Email" margin="normal"  />
        <TextField fullWidth type="password" label="Password" margin="normal" variant="filled" />
        <FormControlLabel control={<Checkbox />} label="Remember me" />
        <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: 'white', color: '#b34725' }}>Login</Button>
        <Box my={2}><hr /></Box>
        <Button fullWidth variant="contained" sx={{ backgroundColor: '#4285F4', color: 'white' }}>Google</Button>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? <a href="/signup" style={{ color: '#90caf9' }}>Sign up</a>
        </Typography>
      </Paper>
    </Box>
  </>
  
  );


};

export default LoginPage;