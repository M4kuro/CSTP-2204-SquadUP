import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import { UserCard } from "../components/UserCard";
import { Box, Grid } from "@mui/material";

export const RequestsPage = () => {
  const { users, currentUser } = useContext(AppContext);
  return (
    <Box display="flex">
      <Box
        display="grid"
        gridTemplateColumns="25% 25% 25% 25%"
        gap={4}
        id="requestsPage"
        margin={20}
      >
        {users
          .filter((user) => {
            if (user._id === currentUser?._id) return false;
            if (currentUser?.matches?.includes(user._id)) return false;
            return true;
          })
          .map((user) => (
            <UserCard user={user} type="request" />
          ))}
      </Box>
    </Box>
  );
};
