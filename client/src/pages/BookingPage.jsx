import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import BookingMonthlyCalendar from "../components/calendar/BookingMonthlyCalendar";
import BookingDayCalendar from "../components/calendar/BookingDayCalendar";

const BookingPage = () => {
  const { proId } = useParams();
  const location = useLocation();
  const [proUser, setProUser] = useState(null);

  const isDayView = location.pathname.split("/").length === 5;

  useEffect(() => {
    const fetchProUser = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${proId}`,
      );
      const data = await res.json();
      setProUser(data);
    };

    fetchProUser();
  }, [proId]);

  return (
    <Box
  sx={{
    display: "flex",
    width: "100vw", 
    overflow: "hidden",
    
  }}
>
  {/* Shifted right for sidebar */}
  <Box
    sx={{
      ml: "260px", // sidebar offset
      flexGrow: 1,
      p: 5,
      
      Width: "960px",
      mx: "auto",
    }}
  >
    {/* Consistent Header */}
    <Typography
      variant="h4"
      sx={{
        textAlign: "center",
        
        p: 2,
        borderRadius: 2,
        
      }}
    >
      Booking with {proUser?.username || "..."}
    </Typography>

    {/* Conditional View */}
    {isDayView ? (
      <BookingDayCalendar />
    ) : (
      <BookingMonthlyCalendar proId={proId} />
    )}
  </Box>
</Box>
  );
};

export default BookingPage;
