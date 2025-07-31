import { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import UserSidebar from "../components/UserMainSideBarControl"; // Importing the sidebar component
import { useNavigate } from "react-router-dom"; // REMOVED PARAMS BECAUSE WERE NOT USING IT ANYMORE DUE TO JWT DECODING
import MonthlyCalendar from "../components/calendar/MonthlyCalendar"; // importing the calendar components (this is for monthly)
import WeeklyCalendar from "../components/calendar/WeeklyCalendar"; // this is the weekly component import
import DailyCalendar from "../components/calendar/DailyCalendar"; // this is the daily component import

const baseUrl = `${import.meta.env.VITE_API_URL}/api/users`;

const UserProfile = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [otherImages, setOtherImages] = useState([null, null, null]);
  const [otherImageFiles, setOtherImageFiles] = useState([null, null, null]);
  const [showCalendar, setShowCalendar] = useState(false); // for the calendar
  const [calendarView, setCalendarView] = useState("month"); // for the calendar view.. or 'week', 'day'
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [bookingMap, setBookingMap] = useState({});

  // cloudinary code to upload images to cloudinary:
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "squadup"); // Optional: keeps assets organized

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${baseUrl}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUser(data);
        setFormData(data);

        if (data.profileImageUrl) {
          setMainImage(data.profileImageUrl);
        }

        if (data.otherImages && data.otherImages.length > 0) {
          const imageUrls = data.otherImages.map((url) => url || null);
          setOtherImages(imageUrls);
        }

        // !!!NEW: If user is a pro, fetch their bookings
        if (data.isPro) {
          try {
            const bookingsRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/bookings/pro/${data._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            const bookingsData = await bookingsRes.json();

            if (!Array.isArray(bookingsData)) {
              console.error("Unexpected bookings data:", bookingsData);
              return;
            }

            const map = {};
            bookingsData.forEach((booking) => {
              if (!map[booking.date]) map[booking.date] = {};
              map[booking.date][booking.hour] = {
                email: booking.clientEmail,
                username: booking.clientUsername,
                image: booking.clientProfilePic,
              };
            });

            setBookingMap(map);
          } catch (bookingErr) {
            console.error("Error fetching pro bookings:", bookingErr);
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setIsEditing(true);
      if (index === "main") {
        setMainImage(URL.createObjectURL(file));
        setMainImageFile(file);
      } else {
        const updated = [...otherImages];
        const updatedFiles = [...otherImageFiles];
        updated[index] = URL.createObjectURL(file);
        updatedFiles[index] = file;
        setOtherImages(updated);
        setOtherImageFiles(updatedFiles);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = () => {
    if (!isEditing) setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedFields = { ...formData };

      // 🔼 Upload main image to Cloudinary
      if (mainImageFile) {
        const url = await uploadToCloudinary(mainImageFile);
        updatedFields.profileImageUrl = url;
        setMainImage(url); // Update preview
      }

      // 🔼 Upload other images to Cloudinary
      const uploadedOther = [];
      for (let i = 0; i < otherImageFiles.length; i++) {
        if (otherImageFiles[i]) {
          const url = await uploadToCloudinary(otherImageFiles[i]);
          uploadedOther[i] = url;
        } else {
          uploadedOther[i] = otherImages[i]; // Keep existing image if not changed
        }
      }
      updatedFields.otherImages = uploadedOther;

      // 📤 Send updated profile to backend
      const res = await fetch(`${baseUrl}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to update profile.");
    }
  };


  const sectionStyle = {
    backgroundColor: "#b0b0b0",
    color: "#000",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    width: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  if (!user) {
    return (
      <Typography sx={{ color: "#fff", p: 4 }}>Loading profile...</Typography>
    );
  }

  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const interestOptions = ["Sports", "Board Games", "Video Games"];

  const handleDrillToDay = (date) => {
    setSelectedDate(new Date(date)); // updates which day DailyCalendar shows
    setCalendarView("day"); // switches to Daily view
  };

  // ================================ MAIN RETURN/CONTENT START FROM HERE ================================

  return (
    <Box // Main Box =============================================
      sx={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#ffffffff",
        minWidth: "100vw",
        padding: 1,
        gap: 1,
        justifyContent: "center",
      }}
    >
      {/* IMAGES BOX ============================================================================================*/}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
          gap: 2,
          mt: 5,
          ml: 30,
        }}
      >
        <Paper elevation={4} sx={{ padding: 2, backgroundColor: "#000000ff" }}>
          <Avatar src={mainImage} sx={{ width: 340, height: 340 }}>
            {!mainImage && user?.username?.[0]?.toUpperCase()}
          </Avatar>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              mt: 1,
              color: "#ffffffff",
              "&:hover": { backgroundColor: "#585858ff" },
              borderColor: "#ffffffff",
              fontFamily: "Michroma, sans-serif",
              fontSize: "12px",
            }}
          >
            Upload Main
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleImageChange("main", e)}
            />
          </Button>
        </Paper>

        {/* Extra images Upload Box ===========================================================================*/}
        <Box sx={{ display: "flex", gap: 3 }}>
          {otherImages.map((img, idx) => (
            <Paper
              key={idx}
              elevation={4}
              sx={{
                backgroundColor: "#000000ff",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 2,
              }}
            >
              <Avatar src={img} sx={{ width: 160, height: 160 }} />
              <Button
                variant="outlined"
                component="label"
                sx={{
                  mt: 2,
                  fontSize: "20px",
                  color: "white",
                  "&:hover": { backgroundColor: "#585858ff" },
                  borderColor: "white",
                }}
              >
                +
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageChange(idx, e)}
                />
              </Button>
            </Paper>
          ))}
        </Box>
        {/*=============================================================================================================*/}

        {/* Calendar for Pro Users ====================================================================================== */}
        {showCalendar && (
          <Box
            sx={{
              mt: 4,
              backgroundColor: "#000000ff",
              p: 2,
              borderRadius: 2,
              maxWidth: "860px", // 👈 Match width of your 3-image layout
              width: "95%",
              margin: "0 auto", // 👈 Center it horizontally
            }}
          >
            <Box
              sx={{ display: "flex", gap: 2, mb: 2, justifyContent: "center" }}
            >
              <Button
                variant={calendarView === "month" ? "outlined" : ""}
                sx={{
                  fontFamily: "Michroma, sans-serif",
                  color: "#ffffff",
                  borderColor: "#ffffff",
                }}
                onClick={() => setCalendarView("month")}
              >
                Monthly
              </Button>
              <Button
                variant={calendarView === "week" ? "outlined" : ""}
                sx={{
                  fontFamily: "Michroma, sans-serif",
                  color: "#ffffff",
                  borderColor: "#ffffff",
                }}
                onClick={() => setCalendarView("week")}
              >
                Weekly
              </Button>
              <Button
                variant={calendarView === "day" ? "outlined" : ""}
                sx={{
                  fontFamily: "Michroma, sans-serif",
                  color: "#ffffff",
                  borderColor: "#ffffff",
                }}
                onClick={() => setCalendarView("day")}
              >
                Daily
              </Button>
            </Box>

            {/* Stub views for when you click on month/week/day (we might replace these later) */}
            {calendarView === "month" && (
              <MonthlyCalendar
                bookingsByDate={bookingMap}
                onSelectDay={handleDrillToDay}
              />
            )}
            {calendarView === "week" && (
              <WeeklyCalendar
                bookingsByDate={bookingMap}
                onSelectDay={handleDrillToDay}
              />
            )}
            {calendarView === "day" && (
              <DailyCalendar
                bookingsByDate={bookingMap}
                selectedDate={selectedDate}
              />
            )}
          </Box>
        )}
      </Box>
      {/* ============================================================================================================*/}

      {/* PROFILE DETAILS ============================================================================================ */}

      <Box sx={{ width: "100%", maxWidth: 560, ml: 4, mt: 5 }}>
        {/* Personal info section */}
        <Paper elevation={4} sx={sectionStyle}>
          <Typography
            sx={{
              color: "black",
              fontFamily: "Michroma, sans-serif",
              fontSize: "18px",
            }}
          >
            Personal Info
          </Typography>

          <TextField
            label="Birthdate"
            name="birthdate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.birthdate ? formData.birthdate.split("T")[0] : ""}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{
              readOnly: !isEditing,
              sx: {
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#000000ff", // green border on focus
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#000000ff", // hover border
                },
              },
            }}
            // This is red but works, dont worry
            InputLabelProps={{
              sx: {
                color: "black",
                "&.Mui-focused": {
                  color: "#000000ff", // green label on focus
                },
              },
            }}
          />

          {/* BIO */}
          <Typography
            sx={{
              color: "black",
              fontFamily: "Michroma, sans-serif",
              fontSize: "18px",
            }}
          >
            About Me
          </Typography>
          <TextField
            fullWidth
            name="bio"
            label="Your Bio"
            multiline
            rows={3}
            value={formData.bio || ""}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />
          <Typography
            sx={{
              color: "black",
              fontFamily: "Michroma, sans-serif",
              fontSize: "18px",
            }}
            gutterBottom
          >
            Interests
          </Typography>

          {isEditing ? (
            interestOptions.map((interest) => (
              <FormControlLabel
                key={interest}
                control={
                  <Checkbox
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    sx={{
                      color: "#000",
                      "&.Mui-checked": {
                        color: "#000000ff",
                      },
                    }}
                  />
                }
                label={interest}
              />
            ))
          ) : (
            <Box sx={{ ml: 1 }}>
              {formData.interests.length ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {formData.interests.map((interest) => (
                    <Box
                      key={interest}
                      sx={{
                        px: 2,
                        py: 0.5,
                        backgroundColor: "#000000ff",
                        color: "white",
                        borderRadius: "16px",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        fontFamily: "Michroma, sans-serif",
                      }}
                    >
                      {interest}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No interests selected.
                </Typography>
              )}
            </Box>
          )}
        </Paper>

        {/* Interests section */}

        {/* Payment and rating section */}
        <Paper elevation={4} sx={sectionStyle}>
          <Typography
            sx={{
              color: "black",
              fontFamily: "Michroma, sans-serif",
              fontSize: "18px",
            }}
          >
            Pro Coaching
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isPro || false}
                onChange={(e) =>
                  setFormData({ ...formData, isPro: e.target.checked })
                }
                onFocus={handleFocus}
                sx={{
                  color: "#000",
                  "&.Mui-checked": {
                    color: "#000000ff",
                  },
                }}
              />
            }
            label="I'm a Pro who can teach or coach"
          />

          {formData.isPro && (
            <>
              <Button
                variant="outlined"
                onClick={() => setShowCalendar((prev) => !prev)}
                sx={{
                  color: "#000000ff",
                  "&:hover": { backgroundColor: "#585858ff" },
                  borderColor: "#000000ff",
                  fontFamily: "Michroma, sans-serif",
                  fontSize: "12px",
                }}
              >
                {showCalendar ? "Hide Calendar" : "My Calendar / Schedule"}
              </Button>
              <TextField
                label="Hourly Rate ($)"
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate || ""}
                onChange={handleChange}
                onFocus={handleFocus}
                InputProps={{ readOnly: !isEditing }}
                sx={{ mt: 2 }}
              />
              <Box
                sx={{
                  borderLeft: "4px solid #000000ff",
                  pl: 1.5,
                  mt: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: "black" }}>
                  What I'm Offering
                </Typography>
              </Box>

              <TextField
                label="Service Details"
                name="proDescription"
                multiline
                rows={3}
                value={formData.proDescription || ""}
                onChange={handleChange}
                onFocus={handleFocus}
                InputProps={{ readOnly: !isEditing }}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </Paper>

        {/* Socials section */}
        <Paper elevation={4} sx={sectionStyle}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Michroma",
              fontSize: "18px",
            }}
          >
            Social Links
          </Typography>

          <TextField
            name="instagram"
            label="Instagram"
            value={formData.instagram || ""}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />

          <TextField
            name="facebook"
            label="Facebook"
            value={formData.facebook || ""}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />

          <TextField
            name="x"
            label="X (Twitter)"
            value={formData.x || ""}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />

          <TextField
            name="bluesky"
            label="Bluesky"
            value={formData.bluesky || ""}
            onChange={handleChange}
            onFocus={handleFocus}
            InputProps={{ readOnly: !isEditing }}
          />
        </Paper>

        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            sx={{
              borderRadius: "12px",
              mb: 2,
              fontFamily: "Michroma, sans-serif",
              color: "#ffffff",
              backgroundColor: "#000000ff",
              "&:hover": { backgroundColor: "#585858ff" },
            }}
          >
            {isEditing ? "Save My Profile" : "Edit My Profile"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
