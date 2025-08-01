import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Login button clicked");
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      setLoading(false);
      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      alert("Login successful!");
      navigate("/home"); // Redirect
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  // Google Login ---------------------------------------------------------------\
  // const handleGoogleLogin = async (credentialResponse) => {
  //   try {
  //     setLoading(true);

  //     const res = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/auth/google-login`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ token: credentialResponse.credential }), // 🔥 this is the Google token
  //       },
  //     );

  //     setLoading(false);

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message || "Google login failed");

  //     // Save JWT and user data
  //     localStorage.setItem("token", data.token);
  //     localStorage.setItem("userId", data.user._id);

  //     alert("Login successful!");
  //     navigate("/home");
  //   } catch (err) {
  //     console.error("Google login error:", err);
  //     alert("Google login failed");
  //   }
  // };

  // --------------------------- RENDER CONTENT FROM HERE DOWN -----------------------------------------------\
  return (
    <Box
      display="grid"
      gridTemplateColumns="50% 50%"
      width="100%"
      height="100%"
      id="login-grid"
    >
      {/* Left Side */}
      <Box
        sx={{
          backgroundColor: "#ffffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: "Black",
            fontFamily: "Michroma, sans-serif",
            fontSize: "80px",
          }}
        >
          SquadUP
        </Typography>
      </Box>

      {/* Right Side */}
      <Box
        sx={{
          backgroundColor: "#000000ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            width: "80%",
            maxWidth: 400,
            backgroundColor: "#ffffffff",
            color: "white",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "#000000ff",
              fontFamily: "Michroma, sans-serif",
            }}
          >
            Login
          </Typography>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            sx={{
              backgroundColor: "white",
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
            label="Password"
            fullWidth
            type={showPassword ? "text" : "password"}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="filled"
            sx={{
              backgroundColor: "white",
              "& .MuiFilledInput-root": {
                "&:after": {
                  borderBottomColor: "#000000ff  ", // your focus color here
                },
              },
              "& label.Mui-focused": {
                color: "#000000ff  ", // label color on focus
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "Black",
              color: "#ffffffff",
              fontFamily: "Michroma, sans-serif",
              "&:hover": { backgroundColor: "#000000ff" },
            }}
            onClick={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Box my={2}>
            <hr />
          </Box>{" "}
          {/* Line between login and google button 
          <GoogleOAuthProvider clientId={clientId} locale="en">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Google Login Failed");
                alert("Google sign-in failed.");
              }}
              logo_alignment="center"
              text="signin_with"
            />
          </GoogleOAuthProvider>
          */}
          <Typography
            variant="body2"
            align="center"
            sx={{
              mt: 2,
              color: "#000000ff",
              fontFamily: "Michroma, sans-serif",
            }}
          >
            Don't have an account?
            <a href="/signup" style={{ color: "#006fcaff" }}>
              {" "}
              Sign up
            </a>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;
