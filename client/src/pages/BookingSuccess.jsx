import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Typography, Box, CircularProgress } from "@mui/material";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proId = searchParams.get("proId");
  const yearMonth = searchParams.get("yearMonth");
  const day = searchParams.get("day");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("📦 Token in localStorage:", token);

    console.log("📅 proId:", proId);
    console.log("📅 yearMonth:", yearMonth);
    console.log("📅 day:", day);

    if (!token) {
      console.warn("⛔ No token found. Redirecting to login...");
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      if (proId && yearMonth && day) {
        navigate(`/booking/${proId}/${yearMonth}/${day}`);
      } else {
        console.warn("⛔ Missing booking info. Redirecting to login...");
        navigate("/");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, proId, yearMonth, day]);

  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h5" color="success.main">
        Your Payment was Successful!
      </Typography>
      <Typography mt={2}>
        Redirecting you to your confirmed booking...
      </Typography>
      <CircularProgress sx={{ mt: 4 }} />
    </Box>
  );
};

export default BookingSuccess;
