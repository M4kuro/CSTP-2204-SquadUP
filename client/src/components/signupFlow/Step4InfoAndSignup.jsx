import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";

const Step4InfoAndSignup = ({ formData, setFormData, onBack }) => {
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      alert("Signup successful!");
      navigate("/"); // back to login page
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------- RENDER CONTENT FROM HERE DOWN -----------------------------------------------\

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
        sx={{
          backgroundColor: "white",
          mb: 2,
          "& .MuiFilledInput-root": {
            "&:after": {
              borderBottomColor: "#000000ff  ", // your focus color here
            },
          },
          "& label.Mui-focused": {
            color: "#000000ff  ", // label color on focus
          },
        }}
      />

      <TextField
        fullWidth
        label="Password"
        variant="filled"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        sx={{
          backgroundColor: "white",
          mb: 2,
          "& .MuiFilledInput-root": {
            "&:after": {
              borderBottomColor: "#000000ff  ", // your focus color here
            },
          },
          "& label.Mui-focused": {
            color: "#000000ff  ", // label color on focus
          },
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="outlined"
          sx={{ color: "white", borderColor: "white" }}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          variant="Outlined"
          fullWidth
          sx={{
            backgroundColor: "white",
            color: "#000000ff",
            ml: 2,
            maxWidth: 200,
          }}
          onClick={handleSignup}
          disabled={
            loading ||
            !formData.email ||
            !formData.password ||
            !isPasswordStrong(formData.password) ||
            !isValidEmail(formData.email)
          }
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </Box>
    </>
  );
};

export default Step4InfoAndSignup;
