import React, {useState} from 'react';
import {  Box, TextField, Button, Typography, Paper, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
    
  const handleLogin = async () => {
    console.log('Login button clicked');
    try {
      setLoading(true)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      setLoading(false)
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      localStorage.setItem('token', data.token); // Store JWT
      alert('Login successful!');
      navigate('/home'); // Redirect
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };
  
  // --------------------------- RENDER CONTENT FROM HERE DOWN -----------------------------------------------\
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
      <img src="/TranspLogo.png" alt="Logo" style={{ maxWidth: '70%' }} />
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
        
        <Typography variant="h5" gutterBottom>Login</Typography>
          <TextField label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant='filled'
            sx={{ backgroundColor: 'white',
              '& .MuiFilledInput-root': {
                '&:after': {
                  borderBottomColor: '#b34725  '  // your focus color here
                },
              },
              '& label.Mui-focused': {
                color: '#b34725  ', // label color on focus
              }, }}/>
          
          <TextField label="Password"
            fullWidth
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant='filled'
            sx={{ backgroundColor: 'white',
              '& .MuiFilledInput-root': {
                '&:after': {
                  borderBottomColor: '#b34725  '  // your focus color here
                },
              },
              '& label.Mui-focused': {
                color: '#b34725  ', // label color on focus
              }, }}/>
        
          
          
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, backgroundColor: 'white', color: '#b34725' }}
            onClick={handleLogin}
            disabled={loading || !email || !password}

          >
            {loading ? 'Logging in...' : 'Login'}
          
          </Button>
          
          <Box my={2}><hr /></Box> {/* Line between login and google button */}
          
          <Button fullWidth
            variant="contained"
            sx={{ backgroundColor: '#4285F4', color: 'white' }}
            
          >
            Google
          
          </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?
            <a href="/signup" style={{ color: '#90caf9' }}> Sign up</a>
        </Typography>
          
      </Paper>
    </Box>
  </>
  
  );


};

export default LoginPage;