import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
// commenting out the following because they were not being utilized.
// Do we still need these?

// import SettingsIcon from '@mui/icons-material/Settings';
// import HelpIcon from '@mui/icons-material/Help';
// import LogoutIcon from '@mui/icons-material/Logout';
// import axios from 'axios';  // this is for chat and messages feature
import { useNavigate } from "react-router-dom";
import UserProfileCard from "../components/UserProfileCard";
import UserSidebar from "../components/UserMainSideBarControl";
import TabControl from "../components/TabControl";
import api from "../api";
import { useSearchParams } from "react-router-dom"; // this is to help with the URL showing the tab states.
import { Tooltip } from "@mui/material"; // this is to add the ellipsis and tooltips to the usernames when they're truncated.
import AppContext from "../context/AppContext";
import { UserCard } from "../components/UserCard";
import { baseUrl } from "../constant";

// will need to refactor code later
// this is getting a bit much on the homepage.
// so im thinking about creating more components.
// will run this past Leo first but i just want this functional for now
// cleanliness and easier to read will come later.
// I'm just trying to connect the dots to make things work.
// once they work i will catagorize and make things smaller and easier.

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get("view") || "discover";
  // const [view, setView] = useState(initialView);

  // const initialTab = initialView === 'matches' ? 2 : initialView === 'requests' ? null : 1;

  const { tabValue, fetchUsers, users } = useContext(AppContext);

  const userId = localStorage.getItem("userId");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("userId");

  // Chat Button logic
  const handleStartChat = async (recipientId) => {
    try {
      const res = await api.post("/chat/get-or-create-thread", {
        senderId: currentUserId,
        recipientId,
      });

      navigate(`/messages/${res.data.threadId}`);
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  };

  const handleViewUser = (userId) => {
    const userToShow = users.find((u) => u._id === userId);
    if (userToShow) setSelectedUser(userToShow);
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch current user");
      const data = await res.json();
      setCurrentUser(data);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  // updating the useffects and taking out the functions

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [tabValue]);

  // useEffect(() => {
  //   if (currentUser?._id) fetchRequests();
  // }, [currentUser]);

  // use effect to help URL maintain the tabview info
  useEffect(() => {
    if (tabValue) {
      navigate(`/home?tabValue=${tabValue}`, { replace: true });
    }
  }, [tabValue]);

  const renderDiscoverUsers = () => {
    // return (
    //  {selectedUser ? (
    //       <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
    //         <UserProfileCard user={selectedUser} onBack={() => setSelectedUser(null)} />
    //       </Box>
    //     ) : (

    // )

    return (
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
          },
          gap: 2,
          justifyContent: "center",
          mx: "auto",
          ml: 45,
        }}
      >
        {users.map((user) => (
          <UserCard user={user} type="discover" />
        ))}
      </Box>
    );
  };

  const renderMatchesUsers = () => {
    return (
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
          },
          gap: 2,
          justifyContent: "center",
          mx: "auto",
          ml: 45,
        }}
      >
        {users.map((user) => (
          <UserCard user={user} type="matches" />
        ))}
      </Box>
    );
  };

  const renderNearbyUsers = () => {
    return (
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
          },
          gap: 2,
          justifyContent: "center",
          mx: "auto",
          ml: 45,
        }}
      >
        {users.map((user) => (
          <UserCard user={user} type="nearby" />
        ))}
      </Box>
    );
  };

  console.log(tabValue, "tabValue");

  const renderTabUsers = (type) => {
    switch (type) {
      // Discover
      case 1:
        return renderDiscoverUsers();
      // Matches
      case 2:
        return renderMatchesUsers();
      default:
        return renderNearbyUsers();
    }
  };

  // --------------------------------- MAIN CONTENTENT  ----------------------------------------------
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {" "}
      {/* Main Container / Whole screen content Container ===========================\  */}
      {/* Header ============================================================================ */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Logo + Tabs (always centered) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Michroma, sans-serif",
              color: "#000000ff",
              textAlign: "center",
              fontSize: "25px",
            }}
          >
            SquadUP
          </Typography>

          <TabControl
            setCurrentUser={setCurrentUser}
            setIncomingRequests={setIncomingRequests}
          />
        </Box>
        {/* Header ================================================================================================= */}

        {/* User GRID ============================================================================================== */}

        {renderTabUsers(tabValue)}
      </Box>
    </Box> // Main Container End =========================================================================================================================//
  );
};

export default HomePage;
