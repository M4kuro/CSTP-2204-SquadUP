import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";
import BookingPage from "./pages/BookingPage";
import BookingSuccess from "./pages/BookingSuccess";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import UserSidebar from "./components/UserMainSideBarControl";
import { Box } from "@mui/material";
import AppContext from "./context/AppContext";
import { useEffect, useState } from "react";
import { baseUrl, TabValue } from "./constant";
import RequestsPage from './pages/RequestsPage';
import ChatPage from "./pages/ChatPage";

// 👇 Create an inner component where it's safe to use useLocation
const InnerApp = ({ isLoggedIn, tabValue, users, setTabValue, fetchUsers, fetchCurrentUser, currentUser, setCurrentUser, requestCount, fetchRequestCount, setRequestCount }) => {
  const location = useLocation();
  const hideSidebarRoutes = ["/", "/login", "/signup"];
  const shouldShowSidebar = isLoggedIn && !hideSidebarRoutes.includes(location.pathname);

  const AppContextValues = {
    tabValue,
    users,
    setTabValue,
    fetchUsers,
    fetchCurrentUser,
    currentUser,
    setCurrentUser,
    isLoggedIn,
    requestCount,         // needed for requests counter
    setRequestCount,      // also needed for requests counter
    fetchRequestCount     // also needed for requests counter 
  };

  return (
    <AppContext.Provider value={AppContextValues}>
      <Box
        display="grid"
        gridTemplateColumns={shouldShowSidebar ? "25% 75%" : "100%"}
        height="100%"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        {shouldShowSidebar && <UserSidebar />}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/messages" element={<ChatPage />} />
          <Route path="/booking/:proId" element={<BookingPage />} />
          <Route path="/booking/:proId/:yearMonth/:day" element={<BookingPage />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </Box>
    </AppContext.Provider>
  );
};

function App() {
  const [tabValue, setTabValue] = useState(TabValue.Discover);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [requestCount, setRequestCount] = useState(0); // this is to pass down counters for the requests

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(userId);
  }, []);

  const fetchUsers = async () => {
    setUsers([]); // clear previous users to prevent duplicates


    try {
      let endpoint = "";
      // if (tabValue === TabValue.Nearby) {
      //   endpoint = `${baseUrl}/requests/${isLoggedIn}`;

      if (tabValue === TabValue.Matches) {
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
  // adding the fetch request counter here.
  const fetchRequestCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch current user");
      const data = await res.json();
      if (data?.squadRequests) {
        setRequestCount(data.squadRequests.length);
      }
    } catch (err) {
      console.error("❌ Failed to get request count:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers();
      fetchCurrentUser();
      fetchRequestCount(); // requests counter
    }
  }, [isLoggedIn, tabValue]); // we want to ensure that any time tabValue changes, the right users get fetched.

  return (
    <Router>
      <InnerApp
        isLoggedIn={isLoggedIn}
        tabValue={tabValue}
        users={users}
        setTabValue={setTabValue}
        fetchUsers={fetchUsers}
        fetchCurrentUser={fetchCurrentUser}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        requestCount={requestCount}
        setRequestCount={setRequestCount}
        fetchRequestCount={fetchRequestCount}
      />
    </Router>
  );
}

export default App;
