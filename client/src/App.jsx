import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";
import BookingPage from "./pages/BookingPage";
import BookingDayCalendar from "./components/calendar/BookingDayCalendar";
import MessagesPage from "./pages/MessagesPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import BookingSuccess from "./pages/BookingSuccess";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import UserSidebar from "./components/UserMainSideBarControl";
import { Box } from "@mui/material";
import AppContext from "./context/AppContext";
import { useEffect, useState } from "react";
import { baseUrl, TabValue } from "./constant";
import { RequestsPage } from "./pages/RequestsPage";

function App() {
  const [tabValue, setTabValue] = useState(TabValue.Discover);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(userId);
  }, []);

  const fetchUsers = async () => {
    try {
      let endpoint = "";
      if (tabValue === TabValue.Nearby) {
        endpoint = `${baseUrl}/requests/${isLoggedIn}`;
      } else if (tabValue === TabValue.Matches) {
        endpoint = `${baseUrl}/matches/${isLoggedIn}`;
      } else {
        endpoint = `${baseUrl}/discover`;
      }

      const token = localStorage.getItem("token");
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
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

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const AppContextValues = {
    tabValue,
    users,
    setTabValue,
    fetchUsers,
    fetchCurrentUser,
    currentUser,
    isLoggedIn,
  };

  console.log(currentUser);
  return (
    <Box width="100%">
      <AppContext.Provider value={AppContextValues}>
        <Router>
          <Box
            display="grid"
            gridTemplateColumns={isLoggedIn ? "25% 75%" : "100%"}
            height="100%"
            width="100%"
            justifyContent="center"
            alignItems="center"
          >
            {/* <Box id="left"> */}
            {isLoggedIn && <UserSidebar />}
            {/* </Box> */}

            {/* <Box id="right"> */}
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/requests" element={<RequestsPage />} />

              {/* messages and chat routes all handled in MessagesPage */}
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/messages/:threadId" element={<ChatRoomPage />} />

              {/* Booking routes all handled in BookingPage */}
              <Route path="/booking/:proId" element={<BookingPage />} />
              <Route
                path="/booking/:proId/:yearMonth/:day"
                element={<BookingPage />}
              />
              <Route path="/booking-success" element={<BookingSuccess />} />

              {/* Help and Settings  */}

              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
            </Routes>
          </Box>
          {/* </Box> */}
        </Router>
      </AppContext.Provider>
    </Box>
  );
}

export default App;
