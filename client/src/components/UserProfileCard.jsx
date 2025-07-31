import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  TextField,
  Rating,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProfileCard = ({ user, onBack }) => {
  const navigate = useNavigate();
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const currentUserId = localStorage.getItem("userId"); // or decode from JWT later

  const handleSubmitRating = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stars: newRating,
            comment: newComment,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert("Rating submitted!");
        // You could optionally trigger a reload here
      } else {
        alert(data.message || "Error submitting rating.");
      }
    } catch (err) {
      console.error("Rating error:", err);
      alert("Something went wrong.");
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birth = new Date(dob);
    const ageDiffMs = Date.now() - birth.getTime();
    return Math.floor(ageDiffMs / (1000 * 60 * 60 * 24 * 365.25));
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "72%",
        flexDirection: "column",
        alignItems: "center",
        ml: 50,
        mt: 2,
        mb: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          backgroundColor: "#b0b0b0",
          color: "#000",
          padding: 4,
          width: "100%",
          maxWidth: "1500px", // or try '1000px' or remove it for full stretch
          flexGrow: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          {/* <Avatar
            src={
              user.profileImageUrl
                ? `${import.meta.env.VITE_API_URL}/uploads/${user.profileImageUrl}`
                : undefined
            }
            alt={user.username}
            sx={{ width: 120, height: 120 }}
          >
            {!user.profileImageUrl && user.username[0]?.toUpperCase()}
          </Avatar> */}
          {/* commeing out the above old image profile code inplace of the cloudinary code: */}
          <Avatar
            src={
              user.profileImageUrl?.startsWith("http")
                ? user.profileImageUrl
                : user.profileImageUrl
                  ? `${import.meta.env.VITE_API_URL}/uploads/${user.profileImageUrl}`
                  : undefined
            }
            alt={user.username}
            sx={{ width: 120, height: 120 }}
          >
            {!user.profileImageUrl && user.username[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontFamily: "Michroma, sans-serif",
                fontSize: "30px",
              }}

            >{user.username}</Typography>

            <Typography sx={{
              fontFamily: "Michroma, sans-serif",
              fontSize: "20px",
            }}>
              Age: {calculateAge(user.birthdate)}
            </Typography>
          </Box>
        </Box>

        <Typography sx={{
          mt: 3,
          fontFamily: "Michroma, sans-serif",
          fontSize: "20px"

        }}>
          About Me
        </Typography>
        <Typography sx={{
          mb: 2,
          fontFamily: "Michroma, sans-serif",
          fontSize: "13px"

        }}>
          {user.bio || "No bio provided."}
        </Typography>

        {/* Pro section */}
        {user.isPro && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              border: "3px solid #ffbf00",
              borderRadius: 2
            }}
          >
            <Typography sx={{
              color: "#000000ff",
              fontFamily: "Michroma, sans-serif",
              fontSize: "20px"

            }}>
              <strong>Pro Coach Available!</strong>
            </Typography>

            <Typography
              sx={{
                color: "#000000ff",
                fontFamily: "Michroma, sans-serif",
                fontSize: "15px"
              }}
            >
              <strong>Hourly Rate:</strong> ${user.hourlyRate}/hr
            </Typography>

            <Typography
              sx={{
                color: "#000000ff",
                fontFamily: "Michroma, sans-serif",
                fontSize: "15px"
              }}
            >
              <strong>What I'm Offering:</strong>{" "}
              {user.proDescription || "No description provided."}
            </Typography>

            {user.ratings?.length > 0 ? (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <Rating
                  value={
                    user.ratings.reduce((sum, r) => sum + r.stars, 0) /
                    user.ratings.length
                  }
                  precision={0.5}
                  readOnly
                />

                <Typography sx={{
                  fontFamily: "Michroma, sans-serif", fontSize: "15px"
                }}>
                  ({user.ratings.length} rating
                  {user.ratings.length > 1 ? "s" : ""})
                </Typography>
              </Box>
            ) : (
              <Typography>No ratings yet</Typography>
            )}
          </Box>
        )}

        {/* Leave a rating */}
        {user.isPro &&
          !user.ratings?.some((r) => r.userId === currentUserId) && (
            <Box sx={{ mt: 2, mb: 2 }}>

              <Typography
                sx={{
                  color: "#000000ff",
                  fontFamily: "Michroma, sans-serif",
                  fontSize: "20px",
                }}>
                Rate (1 - 5)
              </Typography>

              <TextField
                type="number"
                inputProps={{ min: 1, max: 5 }}
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Comment (optional)"
                fullWidth
                multiline
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                sx={{
                  color: "#ffffffff",
                  backgroundColor: "#000000ff",
                  fontFamily: "Michroma"
                }}
                onClick={handleSubmitRating}
              >
                Submit Rating
              </Button>
            </Box>
          )}

        <Typography sx={{
          fontFamily: "Michroma, sans-serif",
          fontSize: "20px"
        }}>
          Interests</Typography>

        <Typography sx={{
          mb: 2,
          fontFamily: "Michroma, sans-serif",
          fontSize: "15px"
        }}
        >
          {user.interests?.length > 0
            ? user.interests.join(", ")
            : "No interests listed."}
        </Typography>

        <Typography sx={{
          fontFamily: "Michroma, sans-serif",
          fontSize: "20px"
        }}
        >
          Location

        </Typography>
        <Typography sx={{
          fontFamily: "Michroma, sans-serif",
          fontSize: "15px"
        }}>{user.location?.city || "N/A"}</Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" sx={{
            color: "#ffffffff",
            backgroundColor: "#000000ff",
            fontFamily: "Michroma"
          }} onClick={onBack}>
            Back to Grid
          </Button>

          {user.isPro && (
            <Button
              variant="contained"
              sx={{
                color: "#000000ff",
                backgroundColor: "#ffbf00",
                fontFamily: "Michroma, sans-serif",
                fontSize: "15px"
              }}
              onClick={() => navigate(`/booking/${user._id}`)}
            >
              Book with Pro
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfileCard;
