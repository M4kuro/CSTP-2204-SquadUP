import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';

const Step4InfoAndSignup = ({ formData, setFormData }) => { 

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
  const isPasswordStrong = (password) => { 
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
    /*
    At least include
    - 1 lower 
    - 1 upper
    - 1 number
    - 1 special
    - 8 char length
    
    */

  }; 

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };


    const handleSignup = async () => {
      setLoading(true);
  
      try {
        const res = await fetch('https://squad-up-mbi7.onrender.com/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.message || 'Signup failed');
        }
  
        alert('Signup successful!');
        navigate('/') // back to login page 

      } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    return (
        <>
          <Typography variant="h6" gutterBottom>
            Last step! Enter your email and password:
          </Typography>
    
          <TextField
            fullWidth
            label="Email"
            variant="filled"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ backgroundColor: 'white', mb: 2 }}
          />
    
          <TextField
            fullWidth
            label="Password"
            variant="filled"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            sx={{ backgroundColor: 'white', mb: 2 }}
          />
    
          <Button
            variant="contained"
            fullWidth
            sx={{ backgroundColor: 'white', color: '#b34725' }}
            onClick={handleSignup}
          disabled={loading ||
            !formData.email ||
            !formData.password ||
            !isValidEmail(formData.email) ||
            !isPasswordStrong(formData.password)
          
          }
          
        >
            
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </>
      );
}

export default Step4InfoAndSignup