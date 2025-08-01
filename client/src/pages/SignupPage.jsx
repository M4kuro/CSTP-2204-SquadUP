import { useState } from "react";
import { Box, Paper } from "@mui/material";

import Typography from "@mui/material/Typography";

import Step1WelcomeUser from "../components/signupFlow/Step1WelcomeUser";
import Step2GetLocation from "../components/signupFlow/Step2GetLocation";
import Step3Interests from "../components/signupFlow/Step3Interests";
import Step4InfoAndSignup from "../components/signupFlow/Step4InfoAndSignup";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    location: "",
    interests: [],
    email: "",
    password: "",
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  // --------------------------- RENDER CONTENT FROM HERE DOWN -----------------------------------------------\

  return (
    <>
      <Box
      display="grid"
      gridTemplateColumns="50% 50%"
      width="100%"
      height="100%"
      id="Signup-grid">


      {/* Left Side - Interactive form area */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            width: "80%",
            maxWidth: 400,
            backgroundColor: "#000000ff",
            color: "white",
          }}
        >
          {step === 1 && (
            <Step1WelcomeUser
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <Step2GetLocation
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 3 && (
            <Step3Interests
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 4 ? (
            <Step4InfoAndSignup
              formData={formData}
              setFormData={setFormData}
              onBack={handleBack}
            />
          ) : null}
        </Paper>
      </Box>

      {/* Right Side */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#000000ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <Typography
          gutterBottom
          sx={{
            color: "#ffffffff",
            fontFamily: "Michroma, sans-serif",
            textAlign: "center",
            fontSize: "80px",
          }}
        >
          SquadUP
        </Typography>
      </Box>
      </Box>

    </>
  );
};

export default SignupPage;
