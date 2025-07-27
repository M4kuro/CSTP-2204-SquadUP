import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import UserSidebar from "../components/UserMainSideBarControl";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          mt: 10,
          ml: 40,
          flexGrow: 1,
          p: 5,
          overflowY: "auto",
          maxWidth: "1000px",
          whiteSpace: "normal",
          wordWrap: "break-word",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontFamily: "Michroma, sans-serif", mb: 3 }}
        >
          Account Settings
        </Typography>

        {/* Personal Info */}
        <Typography variant="h6" sx={{ fontFamily: "Michroma, sans-serif" }}>
          Personal Information
        </Typography>
        <TextField fullWidth label="Username" margin="normal" />
        <TextField fullWidth label="Email" type="email" margin="normal" />
        <Button variant="contained" sx={{ mt: 2 }}>
          Save Changes
        </Button>

        <Divider sx={{ my: 4 }} />

        {/* Password */}
        <Typography variant="h6" sx={{ fontFamily: "Michroma, sans-serif" }}>
          Change Password
        </Typography>
        <TextField fullWidth label="Current Password" type="password" margin="normal" />
        <TextField fullWidth label="New Password" type="password" margin="normal" />
        <TextField fullWidth label="Confirm New Password" type="password" margin="normal" />
        <Button variant="contained" color="warning" sx={{ mt: 2 }}>
          Update Password
        </Button>

        <Divider sx={{ my: 4 }} />

        {/* Blocked Users */}
        <Typography
          variant="h6"
          sx={{ fontFamily: "Michroma, sans-serif", mb: 1 }}
        >
          Blocked Users
        </Typography>
        <Box
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 1,
            backgroundColor: "#f9f9f9",
          }}
        >
          <List>
            {["User123", "Player99", "ToxicTim", "SaltySarah", "AFKAndy", "SpammySam"].map(
              (user, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <Button color="error" variant="outlined" size="small">
                      Unblock
                    </Button>
                  }
                >
                  <ListItemText primary={user} />
                </ListItem>
              )
            )}
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Delete Account */}
        <Typography
          variant="h6"
          sx={{ fontFamily: "Michroma, sans-serif", color: "red" }}
        >
          Danger Zone
        </Typography>
        <Button variant="outlined" color="error" sx={{ mt: 2 }}>
          Delete My Account
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
