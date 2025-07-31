import { Box, Avatar, Typography, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
// importing these next 4 for help with logic on "New messages"
import { useContext, useEffect, useState } from "react";
import api from "../api";
import { getUserIdFromToken } from "../utils/auth";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

const UserSidebar = ({ incomingRequests = [] }) => {
  const navigate = useNavigate();
  const { setTabValue, currentUser } = useContext(AppContext);


  console.log(currentUser, "currentUser");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
    window.location.reload();
  };

  //  adding this for unreadcount for messages:
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get(`/chat/unread/${userId}`);
        setUnreadCount(res.data.unreadCount || 0);
      } catch (err) {
        console.error("❌ Failed to get unread count:", err);
      }
    };

    fetchUnread();


    // 💬 Listen for incoming messages
    socket.on("receiveMessage", (msg) => {
      if (msg.sender !== userId) {
        fetchUnread();
      }
    });

    // 🧹 Cleanup on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // adding this useEffect for unread requests:
  const { requestCount, fetchRequestCount, setRequestCount } = useContext(AppContext);

  useEffect(() => {
    fetchRequestCount();
  }, []);


  console.log(currentUser, "cur");

  return (
    <Box
      sx={{
        backgroundColor: "#000000ff",
        borderRadius: "20px",
        boxShadow: 10,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 10,
      }}
      id="sidebar"
    >
      {/* Top Avatar Section */}
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Avatar
          src={
            currentUser?.profileImageUrl
              ? `${import.meta.env.VITE_API_URL}/uploads/${currentUser.profileImageUrl}`
              : "/placeholder-profile.png"
          }
          alt={currentUser?.username || "User"}
          sx={{ width: 200, height: 200, mx: "auto" }}
        />
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 3 }}>
        <Typography
          sx={{
            color: "white",
            textAlign: "center",
            fontFamily: "Michroma, sans-serif",
            fontSize: "20px",
          }}
        >
          {currentUser?.username || "Unknown"}
        </Typography>
        <Typography
          sx={{
            color: "white",
            textAlign: "center",
            fontFamily: "Michroma, sans-serif",
            fontSize: "15px",
          }}
        >
          {currentUser?.email || ""}
        </Typography>

        {/* Homepage Button */}
        <Button
          variant="outlined"
          sx={buttonStyle}
          onClick={() => {
            setTabValue(1); // Sets the Discover tab programmatically
            navigate("/home?tabValue=1"); // Keeps the URL in sync for shareability or refresh
          }}
        >
          Home Page
        </Button>

        {/* MyProfile Button */}
        <Button
          variant="outlined"
          sx={buttonStyle}
          onClick={() => navigate("/profile")}
        >
          My Profile
        </Button>

        {/* Requests Button */}
        <Button
          variant="outlined"
          sx={buttonStyle}
          onClick={() => navigate("/requests")}
        >
          Requests {requestCount > 0 && `(${requestCount})`}
        </Button>

        {/* Squad Button */}
        <Button
          variant="outlined"
          sx={buttonStyle}
          onClick={() => {
            // setView?.('matches');  // trying to ensure homepage fetches matches
            setTabValue?.(2); // and also ensure the matches tab is highlighted
            navigate("/home?view=matches"); // trying to keep the URL updated with what prabh wanted
          }}
        >
          Squad
        </Button>

        {/* Messages Button */}
        <Button
          variant="outlined"
          sx={buttonStyle}
          onClick={async () => {
            try {
              await api.post(`/chat/mark-all-read/${userId}`);
              setUnreadCount(0); // locally clear the badge
            } catch (err) {
              console.error("❌ Failed to mark messages as read:", err);
            }
            navigate("/messages");
          }}
        >
          Messages {unreadCount > 0 && `(${unreadCount})`}
        </Button>
      </Box>

      {/* Bottom Section */}

      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 10, p: 3 }}
      >
        {/* Settings Button 
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          sx={{ ...buttonStyle, justifyContent: "flex-start" }}
          fullWidth
          onClick={() => navigate("/settings")}
        >
          Settings
        </Button>
        */}

        {/* Help Button */}
        <Button
          variant="outlined"
          startIcon={<HelpIcon />}
          sx={{ ...buttonStyle, justifyContent: "flex-start" }}
          fullWidth
          onClick={() => navigate("/help")}
        >
          Help
        </Button>

        {/* SignOut Button */}
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ ...buttonStyle, justifyContent: "flex-start" }}
          fullWidth
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

const buttonStyle = {
  color: "white",
  "&:hover": { backgroundColor: "#585858ff" },
  borderColor: "white",
  textTransform: "none",
  fontFamily: "Michroma, sans-serif",
};

export default UserSidebar;
