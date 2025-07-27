import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
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
        mt: 10,
        ml: 40,
        p: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100vw',
        overflowY: 'auto',
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontFamily: "Michroma, sans-serif", mb: 3 }}
      >
        Account Settings
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          width: "100%",
          maxWidth: "1000px",
          flexWrap: "wrap", // for mobile responsiveness
          justifyContent: "space-between",
        }}
      >
        {/* adding a comment to force a change to push to github */}
        {/* Personal Info */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography fontFamily={"Michroma, sans-serif"} variant="h6">Update Personal Information</Typography>
          <TextField fullWidth label="Username" margin="normal" />
          <TextField fullWidth label="Email" type="email" margin="normal" />
          <Button  variant="contained" sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </Box>

        {/* Danger Zone */}
        <Box
          sx={{
            minWidth: 220,
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            height: "fit-content",
            backgroundColor: "#f9f9f9",
            mt: -2
          }}
        >
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

      <Divider sx={{ my: 4 }} />

      {/* Password Change */}
      <Box sx={{ maxWidth: 700 }}>
        <Typography variant="h6" sx={{ fontFamily: "Michroma, sans-serif" }}>
          Change Password
        </Typography>
        <TextField
          fullWidth
          label="Current Password"
          type="password"
          margin="normal"
        />
        <TextField
          fullWidth
          label="New Password"
          type="password"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Confirm New Password"
          type="password"
          margin="normal"
        />
        <Button variant="contained" color="warning" sx={{ mt: 2 }}>
          Update Password
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Blocked Users */}
      <Typography
        variant="h6"
        sx={{ fontFamily: "Michroma, sans-serif", mb: 1 }}
      >
        Blocked Users
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 800 }}>

        <Box
          sx={{
            maxHeight: 300,
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: 2,
            p: 1,
            backgroundColor: '#f9f9f9',
          }}
        >
          <List>
            {[
              "User123",
              "Player99",
              "ToxicTim",
              "SaltySarah",
              "AFKAndy",
              "SpammySam",
            ].map((user, idx) => (
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
            ))}
          </List>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

     
    </Box>

  );
};

export default SettingsPage;
