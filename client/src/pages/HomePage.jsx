import { useEffect, useState } from 'react';
import {
  Box, Typography, Avatar, Tabs, Tab,
  Card, CardContent, CardMedia, Button,
  Grid, ListItem, ListItemButton, ListItemText
} from '@mui/material';
// commenting out the following because they were not being utilized.
// Do we still need these?

// import SettingsIcon from '@mui/icons-material/Settings';
// import HelpIcon from '@mui/icons-material/Help';
// import LogoutIcon from '@mui/icons-material/Logout';
// import axios from 'axios';  // this is for chat and messages feature
import { useNavigate } from 'react-router-dom';
import UserProfileCard from '../components/UserProfileCard';
import UserSidebar from '../components/UserMainSideBarControl';
import TabControl from '../components/TabControl';
import api from '../api';
import { useSearchParams } from 'react-router-dom';  // this is to help with the URL showing the tab states.
import { Tooltip } from '@mui/material'; // this is to add the ellipsis and tooltips to the usernames when they're truncated.

// will need to refactor code later
// this is getting a bit much on the homepage.
// so im thinking about creating more components.
// will run this past Leo first but i just want this functional for now
// cleanliness and easier to read will come later.  
// I'm just trying to connect the dots to make things work.
// once they work i will catagorize and make things smaller and easier.

const baseUrl = `${import.meta.env.VITE_API_URL}/api/users`;

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('view') || 'discover';
  const [view, setView] = useState(initialView);

  const initialTab = initialView === 'matches' ? 2 : initialView === 'requests' ? null : 1;
  const [tabValue, setTabValue] = useState(initialTab);

  const userId = localStorage.getItem('userId');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const navigate = useNavigate();

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
      const res = await api.post('/chat/get-or-create-thread', {
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

  // updating the useffects and taking out the functions

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [tabValue, view]);

  useEffect(() => {
    if (currentUser?._id) fetchRequests();
  }, [currentUser]);

  // use effect to help URL maintain the tabview info
  useEffect(() => {
    if (view) {
      navigate(`/home?view=${view}`, { replace: true });
    }
  }, [view]);

 


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


  // --------------------------------- MAIN CONTENTENT  ----------------------------------------------
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', }}> {/* Main Container / Whole screen content Container ===========================\  */}

      <UserSidebar
        currentUser={currentUser}
        incomingRequests={incomingRequests}
        setView={setView}
        setTabValue={setTabValue}
        navigate={navigate}
      />


      {/* Header ============================================================================ */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Logo + Tabs (always centered) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Michroma, sans-serif',
              color: '#000000ff',
              textAlign: 'center',
              fontSize: '25px',
            }}
          >
            SquadUP
          </Typography>

          <TabControl
            tabValue={tabValue}
            setTabValue={setTabValue}
            setView={setView}
            setCurrentUser={setCurrentUser}
            setIncomingRequests={setIncomingRequests}
            setUsers={setUsers}
            baseUrl={baseUrl}
          />

        </Box>
        {/* Header ================================================================================================= */}

        {/* User GRID ============================================================================================== */}
        {selectedUser ? (
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <UserProfileCard user={selectedUser} onBack={() => setSelectedUser(null)} />
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
                xl: 'repeat(5, 1fr)',
              },
              gap: 2,
              justifyContent: 'center',
              mx: 'auto',
              ml: 45,

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
                        sx={{ height: 300 }}
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
                          right: 8,
                          backgroundColor: '#ffbf00',
                          color: '#000000ff',
                          padding: '2px 10px',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          fontFamily: 'Michroma, sans-serif',
                          boxShadow: 2,
                        }}>
                          PRO
                        </Box>
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Tooltip title={user.username}>
                        <Typography
                          sx={{
                            fontFamily: 'Michroma, sans-serif',
                            fontSize: '23px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                            
                          }}
                        >
                          {user.username}
                        </Typography>
                      </Tooltip>
                    </CardContent>

                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 1 }}>
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
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '30px',
                                gap: 2,
                                mb: 1,
                              }}>
                              <Button
                                variant="outlined"
                                sx={{
                                  color: '#000000ff',
                                  '&:hover': { backgroundColor: '#585858ff' },
                                  borderColor: '#000000ff',
                                  fontFamily: 'Michroma, sans-serif',
                                  fontSize: '12px',
                                }}
                                onClick={() => handleStartChat(user._id)}
                              >
                                Chat
                              </Button>
    
                              <Button
                                  variant="contained"
                                  
                                sx={{
                                  backgroundColor: '#000000ff',
                                  color: 'white',
                                  '&:hover': { backgroundColor: '#585858ff' },
                                  fontFamily: 'Michroma, sans-serif',
                                  fontSize: '12px',
                                  width: '100px',
                                }}
                                  onClick={() => handleViewUser(user._id)}
                                  
                              >
                                More
                              </Button>
                            </Box>

                            <Button variant="contained"
                              color="error"
                              sx={{
                                backgroundColor: '#de0000ff',
                                color: 'white',
                                '&:hover': { backgroundColor: '#930000ff' },
                                fontFamily: 'Michroma, sans-serif',
                                fontSize: '10px',
                              }}
                              onClick={() => handleUnsquad(user._id)}>
                              Unsquad
                              </Button>
                          </Box>

                        </>
                      ) : (
                            <>
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: '80%',}}>
                          <Button 
                            variant="contained"
                            sx={{
                              backgroundColor: '#000000ff',
                              color: 'white',
                              '&:hover': { backgroundColor: '#585858ff' },
                              fontFamily: 'Michroma, sans-serif',
                              fontSize: '12px',
                              
                            }}
                            disabled={sentRequests.includes(user._id)}
                            onClick={() => handleSquadUp(user._id)}
                            fullWidth
                          >
                            {sentRequests.includes(user._id) ? 'Requested' : 'S+UP'}
                          </Button>

                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: '#000000ff',
                              color: 'white',
                              '&:hover': { backgroundColor: '#585858ff' },
                              fontFamily: 'Michroma, sans-serif',
                              fontSize: '12px',
                            }}
                            onClick={() => handleViewUser(user._id)}
                            fullWidth
                                  
                          >
                            More
                          </Button>
                              </Box>
                        </>
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))}
          </Box>
        )}
      </Box>
    </Box> // Main Container End =========================================================================================================================//
  );
};

export default HomePage;
