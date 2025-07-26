import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import { UserCard } from "../components/UserCard";

const RequestsPage = () => {
  const { users } = useContext(AppContext);
  const userId = localStorage.getItem("userId");
  const currentUser = users.find((u) => u._id === userId);

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
            {users
              .filter((user) => currentUser?.squadRequests?.includes(user._id))
              .map((user) => (
                <UserCard key={user._id} user={user} type="request" />
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RequestsPage;
