import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";

const Step4InfoAndSignup = ({ formData, setFormData, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

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

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/\d/.test(password)) errors.push("One number");
    if (!/[\W_]/.test(password)) errors.push("One special character");
    return errors;
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
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={(e) => {
          const value = e.target.value;
          setFormData({ ...formData, password: value });
          setPasswordErrors(validatePassword(value));
          {
            passwordErrors.length > 0 && (
              <Box sx={{ mb: 2, color: "red", fontSize: "0.875rem" }}>
                <Typography>Password must include:</Typography>
                <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                  {passwordErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </Box>
            );
          }
        }}
        
        InputProps={{
          endAdornment: (
            <Button
              onClick={() => setShowPassword((prev) => !prev)}
              size="small"
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          ),
        }}
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
