import { useEffect, useState } from 'react';
import {
  Box, Typography, Avatar, Tabs, Tab,
  Card, CardContent, CardMedia, Button,
  Grid, ListItem, ListItemButton, ListItemText
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import UserProfileCard from '../components/UserProfileCard';
import axios from 'axios';  // this is for chat and messages feature

// will need to refactor code later
// this is getting a bit much on the homepage.
// so im thinking about creating more components.
// will run this past Leo first but i just want this functional for now
// cleanliness and easier to read will come later.  
// I'm just trying to connect the dots to make things work.
// once they work i will catagorize and make things smaller and easier.

const baseUrl = `${import.meta.env.VITE_API_URL}/api/users`;

const HomePage = () => {
  const userId = localStorage.getItem('userId');
  const [tabValue, setTabValue] = useState(1); // default to "Discover"
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('discover');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const navigate = useNavigate();
  const [sentRequests, setSentRequests] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) setView('nearby');
    if (newValue === 1) setView('discover');
    if (newValue === 2) setView('matches');
  };

  const currentUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // S+UP Button logic
  const handleSquadUp = async (targetUserId) => {
    try {
      const res = await fetch(`${baseUrl}/${targetUserId}/squadup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentUserId }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.matched) {
          alert('🎉 It’s a match! You both SquadUP’d!');
        } else {
          alert('✅ S+UP request sent. Waiting for a match!');
          setSentRequests((prev) => [...prev, targetUserId]);
        }

        const requestsRes = await fetch(`${baseUrl}/requests/${currentUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (requestsRes.ok) {
          const updated = await requestsRes.json();
          setIncomingRequests(updated);
        }
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('S+UP Error:', err);
      alert('S+UP failed.');
    }
  };

  // Chat Button logic
  const handleStartChat = async (recipientId) => {
    try {
      const res = await axios.post('/api/chat/get-or-create-thread', {
        senderId: currentUserId,
        recipientId,
      });

      navigate(`/messages/${res.data.threadId}`);
    } catch (err) {
      console.error('Error starting chat:', err);
    }
  };

  // Unsquad Button logic
  const handleUnsquad = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${baseUrl}/${targetUserId}/unsquad`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Unsquaded successfully.");
        await fetchCurrentUser(); // to update your match list
        await fetchUsers();       // to re-render grid
      } else {
        alert(data.message || "Failed to unsquad.");
      }
    } catch (err) {
      console.error("Unsquad error:", err);
      alert("Something went wrong.");
    }
  };


  const handleViewUser = (userId) => {
    const userToShow = users.find((u) => u._id === userId);
    if (userToShow) setSelectedUser(userToShow);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // fetch the current user function

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch current user');
      const data = await res.json();
      setCurrentUser(data);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  // fetch users function

  const fetchUsers = async () => {
    try {
      const currentUserId = localStorage.getItem('userId');
      let endpoint = '';
      if (view === "requests") {
        endpoint = `${baseUrl}/requests/${currentUserId}`;
      } else if (tabValue === 2) {
        endpoint = `${baseUrl}/matches/${currentUserId}`;
      } else {
        endpoint = `${baseUrl}/discover`;
      }

      const token = localStorage.getItem('token');
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // fetch the squadup requests function

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/requests/${currentUser?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const filtered = data.filter(
          (u) => !currentUser?.matches?.includes(u._id)
        );
        setIncomingRequests(filtered);
      }
    } catch (err) {
      console.error('❌ Error fetching squad requests:', err);
    }
  };

  // updating the useeffects and taking out the functions

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [tabValue, view]);

  useEffect(() => {
    if (currentUser?._id) fetchRequests();
  }, [currentUser]);


  // updating the handleAccept 

  const handleAccept = async (requestingUserId) => {
    try {
      const token = localStorage.getItem('token');
      const currentUserId = localStorage.getItem('userId');

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${requestingUserId}/squadup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentUserId }), // not actually used server-side now, but ok to leave
      });

      const data = await res.json();

      if (res.ok) {
        // Always a match if this user is accepting a request
        if (data.matched) {
          alert("🎉 It’s a match! You both SquadUP’d!");
        } else {
          // This should technically never happen in 'requests' tab
          alert("🤔 S+UP request sent. Waiting for a match.");
        }

        // Refresh views
        await fetchCurrentUser();
        await fetchUsers();
        await fetchRequests();
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Accept Error:', err);
      alert('Failed to accept request.');
    }
  };



  // updating the decline as well 

  const handleDecline = async (requesterId) => {
    try {
      const token = localStorage.getItem('token');
      const currentUserId = localStorage.getItem('userId');

      const res = await fetch(`${baseUrl}/${currentUserId}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requesterId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Decline failed');

      console.log('✅ Declined request from:', requesterId);

      // 🔁 Refresh the UI to reflect the updated requests list
      fetchRequests();
      fetchUsers();
    } catch (err) {
      console.error('Decline error:', err);
      alert('Error declining request.');
    }
  };


  // --------------------------------- RENDER ----------------------------------------------
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box sx={{
        width: '300px',
        backgroundColor: '#9B331C',
        borderRadius: '20px',
        m: 5,
        boxShadow: 10,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            src={
              currentUser?.profileImageUrl
                ? `${import.meta.env.VITE_API_URL}/uploads/${currentUser.profileImageUrl}`
                : '/placeholder-profile.png'
            }
            alt={currentUser?.username || 'User'}
            sx={{ width: 200, height: 200, mx: 'auto', mb: 2 }}
          />
          <Typography variant="h4">
            {currentUser?.username || 'Unknown'}
          </Typography>
        </Box>

        {/* Sidebar Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 3 }}>
          <Button variant="contained" color="warning" onClick={() => navigate(`/profile`)}>
            My Profile
          </Button>
          <Button variant="contained" color="warning" onClick={() => setView('requests')}>
            Requests {incomingRequests.length > 0 && `(${incomingRequests.length})`}
          </Button>
          <Button variant="contained" color="warning" onClick={() => setTabValue(2)}>
            Squad
          </Button>
          <Button variant="contained" color="warning" onClick={() => navigate('/messages')}>
            Messages
          </Button>
        </Box>

        {/* Bottom Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 'auto', p: 3 }}>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            sx={{
              justifyContent: 'flex-start',
              color: 'white',
              borderColor: 'white',
              textTransform: 'none',
            }}
            fullWidth
          >
            Settings
          </Button>
          <Button
            variant="outlined"
            startIcon={<HelpIcon />}
            sx={{
              justifyContent: 'flex-start',
              color: 'white',
              borderColor: 'white',
              textTransform: 'none',
            }}
            fullWidth
          >
            Help
          </Button>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              justifyContent: 'flex-start',
              color: 'white',
              borderColor: 'white',
              textTransform: 'none',
            }}
            fullWidth
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Logo + Tabs (always centered) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 3,
          }}
        >
          <img src="SquadUP.png" alt="SquadUP Logo" style={{ width: '150px', height: 'auto' }} />
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{
              mt: 2,
              '& .MuiTab-root': { color: '#fff' },
              '& .Mui-selected': { color: '#FF5722 !important', fontWeight: 'bold' },
              '& .MuiTabs-indicator': { backgroundColor: '#FF5722 !important' },
            }}
          >
            <Tab label="Nearby" />
            <Tab label="Discover" />
            <Tab label="Matches" />
          </Tabs>

          {/* 🔄 DEV-ONLY REFRESH BUTTON */}

          <Button
            onClick={async () => {
              const token = localStorage.getItem('token');
              try {
                // 1. Get current user
                const res = await fetch(`${baseUrl}/me`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setCurrentUser(data); // Updates state

                // 2. Now that we have currentUser, fetch requests
                const requestsRes = await fetch(`${baseUrl}/requests/${data._id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const requestsData = await requestsRes.json();
                const filtered = requestsData.filter(
                  (u) => !data.matches?.includes(u._id)
                );
                setIncomingRequests(filtered);

                // 3. Fetch users based on view/tabValue
                let endpoint = '';
                if (view === 'requests') {
                  endpoint = `${baseUrl}/requests/${data._id}`;
                } else if (tabValue === 2) {
                  endpoint = `${baseUrl}/matches/${data._id}`;
                } else {
                  endpoint = `${baseUrl}/discover`;
                }
                const usersRes = await fetch(endpoint, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const usersData = await usersRes.json();
                setUsers(usersData);
              } catch (err) {
                console.error('Dev refresh error:', err);
              }
            }}
          >
            🔄 Dev Refresh
          </Button>

          {/* 🔄 DEV-ONLY REFRESH BUTTON */}


        </Box>

        {selectedUser ? (
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
            <UserProfileCard user={selectedUser} onBack={() => setSelectedUser(null)} />
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 3,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
                xl: 'repeat(5, 1fr)',
              },
              gap: 3,
            }}
          >
            {users
              .filter((user) => {
                if (user._id === currentUser?._id) return false;
                if (view === 'requests' && currentUser?.matches?.includes(user._id)) return false;
                return true;
              })
              .map((user) => (
                <Grid item key={user._id}>
                  <Card sx={{
                    height: 450,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: 3,
                    boxShadow: 3,
                    overflow: 'hidden',
                  }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="div"
                        sx={{ height: 200 }}
                        image={
                          user.profileImageUrl
                            ? `${import.meta.env.VITE_API_URL}/uploads/${user.profileImageUrl}`
                            : '/placeholder-profile.png'
                        }
                      />
                      {user.isPro && (
                        <Box sx={{
                          position: 'absolute',
                          top: 7,
                          right: -4,
                          backgroundColor: '#FF5722',
                          color: '#fff',
                          padding: '2px 10px',
                          transform: 'rotate(35deg)',
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                          zIndex: 2,
                          boxShadow: 2,
                        }}>
                          PRO
                        </Box>
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5">{user.username}</Typography>
                      <Typography variant="body2">Interests:</Typography>
                      <ul style={{ margin: 10 }}>
                        {user.interests?.map((interest, i) => (
                          <li key={i}>
                            <Typography variant="body2">{interest}</Typography>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 2 }}>
                      {view === 'requests' ? (
                        <>
                          <Button variant="contained" color="success" onClick={() => handleAccept(user._id)}>
                            Accept
                          </Button>
                          <Button variant="outlined" color="error" onClick={() => handleDecline(user._id)}>
                            Decline
                          </Button>
                        </>
                      ) : view === 'matches' ? (
                        <>
                          <Button variant="contained" color="error" onClick={() => handleUnsquad(user._id)}>
                            Unsquad
                          </Button>
                          <Button variant="outlined" color="warning" onClick={() => handleViewUser(user._id)}>
                            More
                          </Button>
                        </>
                      ) : (
                        <>
                          {/* S+UP Button */}
                          <Button
                            variant="contained"
                            color="warning"
                            disabled={sentRequests.includes(user._id)}
                            onClick={() => handleSquadUp(user._id)}
                          >
                            {sentRequests.includes(user._id) ? 'Requested' : 'S+UP'}
                          </Button>

                          {/* Chat Button */}
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleStartChat(user._id)} // 👈 pass in the other user's ID
                          >
                            Chat
                          </Button>

                          {/* More Button */}
                          <Button
                            variant="outlined"
                            color="warning"
                            onClick={() => handleViewUser(user._id)}
                          >
                            More
                          </Button>
                        </>
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
