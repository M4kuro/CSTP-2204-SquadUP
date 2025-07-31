import React, { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Tooltip,
  Typography,
} from "@mui/material";
import { baseUrl } from "../constant";

export const UserCard = (props) => {
  const { user, type, onRemove, refreshRequests, updateRequestCount, onViewUser, onStartChat, } = props;
  const { fetchUsers, fetchCurrentUser } = useContext(AppContext);
  const [sentRequests, setSentRequests] = useState([]);
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  // updating the handleAccept

  const handleAccept = async (requestingUserId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${requestingUserId}/squadup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentUserId }), // not actually used server-side now, but ok to leave
        },
      );

      const data = await res.json();

      if (res.ok) {
        // Always a match if this user is accepting a request
        if (data.matched) {
          alert("🎉 It’s a match! You both SquadUP’d!");
        } else {
          // This should technically never happen in 'requests' tab
          alert("🤔 S+UP request sent. Waiting for a match.");
        }

        // removes the user from local request view after clicking accept.
        onRemove?.(requestingUserId);

        // refreshes the views
        await fetchCurrentUser();
        await fetchUsers();
        refreshRequests?.();
        updateRequestCount?.();
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Accept Error:", err);
      alert("Failed to accept request.");
    }
  };

  // updating the decline as well

  const handleDecline = async (requesterId) => {
    try {
      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("userId");

      const res = await fetch(`${baseUrl}/${currentUserId}/decline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requesterId }),
      });

      console.log("🔍 Full decline response:", res);
      if (!res.ok) {
        const errorText = await res.text(); // fallback if not JSON
        throw new Error(errorText || "Decline failed");
      }

      console.log("✅ Declined request from:", requesterId);

      onRemove?.(requesterId);
      fetchUsers();
      updateRequestCount?.();
    } catch (err) {
      console.error("Decline error:", err?.message || err);
      alert(`Error declining request: ${err?.message || "Unknown error"}`);
    }
  };

  // Unsquad Button logic
  const handleUnsquad = async (targetUserId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/${targetUserId}/unsquad`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Unsquaded successfully.");
        await fetchCurrentUser(); // to update your match list
        await fetchUsers(); // to re-render grid
      } else {
        alert(data.message || "Failed to unsquad.");
      }
    } catch (err) {
      console.error("Unsquad error:", err);
      alert("Something went wrong.");
    }
  };

  // S+UP Button logic
  const handleSquadUp = async (targetUserId) => {
    try {
      const res = await fetch(`${baseUrl}/${targetUserId}/squadup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentUserId }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.matched) {
          alert("🎉 It’s a match! You both SquadUP’d!");
        } else {
          alert("✅ S+UP request sent. Waiting for a match!");
          setSentRequests((prev) => [...prev, targetUserId]);
        }

        const requestsRes = await fetch(
          `${baseUrl}/requests/${currentUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (requestsRes.ok) {
          const updated = await requestsRes.json();
          // setIncomingRequests(updated);
        }
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("S+UP Error:", err);
      alert("S+UP failed.");
    }
  };

  const requestCardFooter = () => {
    return (
      <>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleAccept(user._id)}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDecline(user._id)}
        >
          Decline
        </Button>
      </>
    );
  };

  const matchesCardFooter = () => {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "30px",
              gap: 2,
              mb: 1,
            }}
          >
            <Button
              variant="outlined"
              sx={{
                color: "#000000ff",
                "&:hover": { backgroundColor: "#585858ff" },
                borderColor: "#000000ff",
                fontFamily: "Michroma, sans-serif",
                fontSize: "12px",
              }}
              onClick={() => onStartChat?.(user._id)}
            >
              Chat
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#000000ff",
                color: "white",
                "&:hover": { backgroundColor: "#585858ff" },
                fontFamily: "Michroma, sans-serif",
                fontSize: "12px",
                width: "100px",
              }}
              onClick={() => onViewUser?.(user._id)}
            >
              More
            </Button>
          </Box>

          <Button
            variant="contained"
            color="error"
            sx={{
              backgroundColor: "#de0000ff",
              color: "white",
              "&:hover": { backgroundColor: "#930000ff" },
              fontFamily: "Michroma, sans-serif",
              fontSize: "10px",
            }}
            onClick={() => handleUnsquad(user._id)}
          >
            Unsquad
          </Button>
        </Box>
      </>
    );
  };

  const discoverCardFooter = () => {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            width: "80%",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#000000ff",
              color: "white",
              "&:hover": { backgroundColor: "#585858ff" },
              fontFamily: "Michroma, sans-serif",
              fontSize: "12px",
            }}
            disabled={sentRequests.includes(user._id)}
            onClick={() => handleSquadUp(user._id)}
            fullWidth
          >
            {sentRequests.includes(user._id) ? "Requested" : "S+UP"}
          </Button>

          <Button
            variant="Outlined"
            sx={{
              backgroundColor: "#e4e4e4ff",
              color: "Black",
              borderColor: "#000000ff",
              "&:hover": { backgroundColor: "#585858ff" },
              fontFamily: "Michroma, sans-serif",
              fontSize: "12px",
            }}
            onClick={() => onViewUser?.(user._id)}
            fullWidth
          >
            More
          </Button>
        </Box>
      </>
    );
  };

  const renderCardFooter = (type) => {
    switch (type) {
      case "request":
        return requestCardFooter();
      case "matches":
        return matchesCardFooter();
      default:
        return discoverCardFooter();
    }
  };

  return (
    <Card
      sx={{
        height: 450,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative" }}>
        {/* <CardMedia
          component="div"
          sx={{ height: 300 }}
          image={
            user.profileImageUrl
              ? `${import.meta.env.VITE_API_URL}/uploads/${user.profileImageUrl
              }`
              : "/placeholder-profile.png"
          }
        /> */}
        {/* adding this to handle showing the profileimage on usercards from cloudinaryURLS */}
        <CardMedia
          component="div"
          sx={{ height: 300 }}
          image={user.profileImageUrl || "/placeholder-profile.png"}
        />
        {user.isPro && (
          <Box
            sx={{
              position: "absolute",
              top: 7,
              right: 8,
              backgroundColor: "#ffbf00",
              color: "#000000ff",
              padding: "2px 10px",
              fontWeight: "bold",
              fontSize: "11px",
              fontFamily: "Michroma, sans-serif",
              boxShadow: 2,
            }}
          >
            PRO
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Tooltip title={user.username}>
          <Typography
            sx={{
              fontFamily: "Michroma, sans-serif",
              fontSize: "23px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            {user.username}
          </Typography>
        </Tooltip>
      </CardContent>

      <Box sx={{ display: "flex", justifyContent: "space-evenly", mb: 1 }}>
        {renderCardFooter(type)}
      </Box>
    </Card>
  );
};
