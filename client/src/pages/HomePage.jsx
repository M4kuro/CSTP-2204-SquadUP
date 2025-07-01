import { useEffect, useState } from 'react';
import {
  Box, Typography, Avatar, Tabs, Tab,
  Card, CardContent, CardMedia, Button,
  Grid
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import UserProfileCard from '../components/UserProfileCard';


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
  const [tabValue, setTabValue] = useState(1); // default to "Discover" when a user hits the homepage
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('discover'); // this tracks the current section
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const navigate = useNavigate();

  //! TODO: EVENT NOT DEFINED HERE
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) setView('nearby');
    if (newValue === 1) setView('discover');
    if (newValue === 2) setView('matches');
  };

  // this section is for the S+UP Button.  
  const handleSquadUp = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token');
      const currentUserId = localStorage.getItem('userId');

      console.log('Sending S+UP request to:', targetUserId);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${targetUserId}/squadup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        if (data.matched) {
          alert('🎉 It’s a match! You both SquadUP’d!');
        } else {
          alert('✅ S+UP request sent. Waiting for a match!');
        }

        const requestsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/requests/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (requestsRes.ok) {
          const updatedRequests = await requestsRes.json();
          setIncomingRequests(updatedRequests);
        }
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('S+UP Error:', err);
      alert('S+UP failed.');
    }
  };

  // this is corrently working just fine on local.  The logic for this should be sound. 
  // you're wanting when clicking "more" to only display the card for the selected user.
  const handleViewUser = (userId) => {
    const userToShow = users.find((u) => u._id === userId);
    if (userToShow) {
      setSelectedUser(userToShow);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Fetch logged user =====================================\
  useEffect(() => {
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

    fetchCurrentUser();
  }, []);

  // Fetch visible users =====================================\
  useEffect(() => {
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

    fetchUsers();
  }, [tabValue, view]);

  // this is to handle the squadup fectching the requests:
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/requests/${currentUser?._id}`, {
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

    if (currentUser?._id) fetchRequests();
  }, [currentUser]);

  // --------------------------- RENDER CONTENT FROM HERE DOWN -----------------------------------------------\
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* User Sidebar ================================================================= */}
      <Box
        sx={{
          width: '300px',
          backgroundColor: '#9B331C',
          borderRadius: '20px',
          m: 5,
          boxShadow: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 'calc(100vh - 40px)',
        }}
      >
        <Box>
          {/* Avatar + Username */}
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
            <Typography
              variant="h4"
              sx={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%',
                textAlign: 'center',
                px: 2,
              }}
            >
              {currentUser?.username || 'Unknown'}
            </Typography>
          </Box>

          {/* Main Buttons */}
          <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button variant="contained" color="warning" onClick={() => navigate(`/profile`)}>
              My Profile
            </Button>
            <Button variant="contained" color="warning" onClick={() => setView('requests')}>
              Requests {incomingRequests.length > 0 && `(${incomingRequests.length})`}
            </Button>
            <Button variant="contained" color="warning" onClick={() => setTabValue(2)}>
              Squad
            </Button>
          </Box>
        </Box>

        {/* Bottom Buttons */}
        <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
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

      {/* Main Content Area ================================================================ */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Logo + Tabs */}
        <Box sx={{ textAlign: 'center' }}>
          <img src="SquadUP.png" alt="" style={{ width: '150px', height: 'auto' }} />
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{
              '& .MuiTab-root': { color: '#fff' },
              '& .Mui-selected': { color: '#FF5722 !important', fontWeight: 'bold' },
              '& .MuiTabs-indicator': { backgroundColor: '#FF5722 !important' },
            }}
          >
            <Tab label="Nearby" />
            <Tab label="Discover" />
            <Tab label="Matches" />
          </Tabs>
        </Box>

        {/* Either Selected User View or All Users Grid */}
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
                  <Card
                    sx={{
                      height: 450,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: 3,
                      boxShadow: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="div"
                        sx={{ height: 200 }}
                        image={
                          user.profileImageUrl
                            ? `${import.meta.env.VITE_API_URL}/uploads/${user.profileImageUrl}`
                            : '/placeholder-profile.png'
                        }
                        alt={`${user.username}'s profile`}
                      />
                      {user.isPro && (
                        <Box
                          sx={{
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
                          }}
                        >
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
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleSquadUp(user._id)}
                      >
                        S+UP
                      </Button>
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => handleViewUser(user._id)}
                      >
                        More
                      </Button>
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
