import React from "react";
import { Box, Typography } from "@mui/material";

const HelpPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        maxWidth: "1500px",
        mt: 4,
        ml: 10,
        wordWrap: "break-word",
      }}
    >
      {/* Right-side content area, shifted right by sidebar width */}
      <Box
        sx={{
          ml: "260px", // Sidebar offset
          flexGrow: 1,
          p: 5,
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontFamily: "Michroma, sans-serif", color: "#000000ff" }}
        >
          Help Center
        </Typography>

        <Typography
          variant="body1"
          gutterBottom
          sx={{ fontFamily: "Michroma, sans-serif" }}
        >
          Welcome to the SquadUP Help Center! Below are answers to common
          questions to help you get started.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: "Michroma, sans-serif" }}>
            💬 How do I chat with someone?
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Michroma, sans-serif" }}>
            To chat with someone, you must both be matched or on your squad.
            Once matched and squaded, you'll see a Chat button under their card
            in the Matches tab or Squad view.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: "Michroma, sans-serif" }}>
            🤝 How do I S+UP with someone?
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Michroma, sans-serif" }}>
            Browse through Nearby or Discover users. Click “S+UP” to send a
            request. If they click accept on your request, it’s a match!
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: "Michroma, sans-serif" }}>
            📅 How do bookings work?
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Michroma, sans-serif" }}>
            If a user is a Pro, you can book a time slot on their calendar by
            clicking “Book Now” on their profile. Once confirmed, you'll receive
            a notification.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: "Michroma, sans-serif" }}>
            👤 How can I edit my profile?
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Michroma, sans-serif" }}>
            Go to “My Profile” from the sidebar. There you can update your info,
            profile pictures, interests, and social links.
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 6, fontFamily: "Michroma, sans-serif", color: "#777" }}
        >
          Still need help? Email us at{" "}
          <a href="mailto:support@squadup.app" style={{ color: "#007BFF" }}>
            support@squadup.app
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default HelpPage;