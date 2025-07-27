import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { UserCard } from "../components/UserCard";

const RequestsPage = () => {
  const { fetchUsers, fetchCurrentUser, fetchRequestCount } = useContext(AppContext);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const userId = localStorage.getItem("userId");


  const loadRequestsData = async () => {
      try {
        const token = localStorage.getItem("token");

        // im basically having to use JWT here to make this work.. im sure you already know what im doing.
        // sorry im not sure how to make this work otherwise :(

        // need to fetch **ALL** users from /discover (ignore tabValue) couldnt get this to work otherwise!
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/discover`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await userRes.json();
        setAllUsers(usersData);

        // and then fetch the current user
        const currentRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUserData = await currentRes.json();
        setCurrentUser(currentUserData);
      } catch (err) {
        console.error("❌ Failed to load request data:", err);
      }
    };

  useEffect(() => {
    loadRequestsData();
  }, []);

  // adding a small bit of code to help with auto removing users from requests page on decline (otherwise you have to manually refresh)
  const handleRemoveUserFromRequests = (userIdToRemove) => {
  setAllUsers((prevUsers) =>
    prevUsers.filter((user) => user._id !== userIdToRemove)
  );
};



  if (!currentUser) {
    return (
      <Box
        sx={{
          ml: "260px",
          flexGrow: 1,
          p: 4,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Loading your SquadUP requests...
        </Typography>
      </Box>
    );
  }

  const incomingRequestUsers = allUsers.filter((user) =>
    currentUser?.squadRequests?.includes(user._id)
  );

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Content area with sidebar offset */}
      <Box
        sx={{
          ml: "260px", // Sidebar offset
          flexGrow: 1,
          p: 4,
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Incoming Requests
        </Typography>

        {/* 🔥 Responsive Grid */}

        {currentUser?.squadRequests?.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 4, textAlign: "center" }}>
            No incoming SquadUP requests... yet 👀
          </Typography>
        ) : (
          <Box
            sx={{
              mt: 8, // moving the grid down or up (Trying to line it up with the discover on homepage)
              ml: 11, // moving the grid to the right (Trying to line it up with the discover on homepage)
              display: "grid",
              gridTemplateColumns: "repeat(5, 260px)",
              gap: 3,
              width: "max-content",
            }}
          >
            {incomingRequestUsers.map((user) => (
              <UserCard key={user._id} user={user} type="request" onRemove={handleRemoveUserFromRequests} refreshRequests={loadRequestsData} updateRequestCount={fetchRequestCount}/>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RequestsPage;
