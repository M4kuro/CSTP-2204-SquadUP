import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";

const hours = [
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
];

const BookingDayCalendar = () => {
  const { proId, day, yearMonth } = useParams();
  const navigate = useNavigate();
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookingStatus, setBookingStatus] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (!proId || !day || !yearMonth) return;

    const fullDate = `${yearMonth}-${day}`;
    console.log("📅 Fetching bookings for:", fullDate);

    const fetchBookedSlots = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/${proId}/${fullDate}`,
        );
        const data = await res.json();
        console.log("✅ Received booked hours from server:", data.bookedHours);
        setBookedSlots(data.bookedHours || []);
      } catch (err) {
        console.error("❌ Error fetching booked slots:", err);
      }
    };

    fetchBookedSlots();
  }, [proId, day, yearMonth, location.key]); // trying to get this to trigger when returning from success page.. but it's not WORKING!

  // updated handlebook to include the payments embedded code for stripe

  const handleBook = async (hour) => {
    const token = localStorage.getItem("token");
    setBookingStatus(`🔄 Processing payment for ${hour} on ${day}...`);
    console.log("🧾 Sending to backend:", {
      proId,
      day,
      hour,
      yearMonth,
    });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ proId, day, hour, yearMonth }),
        },
      );

      const { sessionId } = await res.json();

      if (res.ok && sessionId) {
        // This is temporary mark the slot as booked in local state.. I just found out that stripe can't access our local so we can't send data to mongodb after usccessfull booking.
        // will need to talk to prabh about this because now we have another hurdle.
        setBookedSlots((prev) => [...prev, hour]);

        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error("Stripe redirect error:", error);
          setBookingStatus(
            "!! Failed to redirect to Stripe. Please try again.",
          );
        }
      } else {
        setBookingStatus("!! Failed to initiate booking session.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setBookingStatus("!! Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "960px",
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 3,
        backgroundColor: "#f1faff",
        boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
        height: "fit-content",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">🕒 Book a Time Slot on {day}</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/booking/${proId}`)}
          sx={{
            backgroundColor: "#e0f7fa",
            borderRadius: 2,
            px: 2,
            py: 1,
            boxShadow: 1,
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#b2ebf2",
            },
          }}
        >
          ⬅️ Back to Monthly View
        </Button>
      </Box>

      {bookingStatus && (
        <Typography align="center" color="success.main" mb={2}>
          {bookingStatus}
        </Typography>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
        {hours.map((hour) => {
          console.log(
            "🔍 Comparing:",
            hour,
            "against booked slots:",
            bookedSlots,
          );
          const normalize = (h) => h.toLowerCase().replace(/\s/g, "");
          const isBooked = bookedSlots.some(
            (booked) => normalize(booked) === normalize(hour),
          );
          return (
            <Paper
              key={hour}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                backgroundColor: isBooked ? "#ddd" : "#e0f7fa",
                opacity: isBooked ? 0.5 : 1,
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <Typography>{hour}</Typography>
              <Button
                variant="contained"
                disabled={isBooked}
                onClick={() => handleBook(hour)}
              >
                {isBooked ? "Booked" : "Book"}
              </Button>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default BookingDayCalendar;
