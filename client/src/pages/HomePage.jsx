import { useEffect, useState } from 'react';
import {
    Box, Typography, Avatar, Tabs, Tab,
    Card, CardContent, CardMedia, Button,
    List, ListItem, ListItemText,
    Grid
} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import UserProfileCard from '../components/UserProfileCard';
import { ListItemButton } from '@mui/material';
// TODO: import { useLocation } from 'react-router-dom';

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
    const navigate = useNavigate();




    //! TODO: EVENT NOT DEFINED HERE
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 0) setView('nearby');
        if (newValue === 1) setView('discover');
        if (newValue === 2) setView('matches');
    };

    // this is corrently working just fine on local.  The logic for this should be sound. 
    // you're wanting when clicking "more" to only display the card for the selected user.
    const handleViewUser = (userId) => {
        const userToShow = users.find((u) => u._id === userId);
        if (userToShow) {
            setSelectedUser(userToShow);
        } else {
            console.warn('User not found for ID:', userId);
        }
    };

    // this section is for the S+UP Button.  
    const handleSquadUp = async (targetUserId) => {
        try {
            const token = localStorage.getItem('token');

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
            } else {
                alert(data.message || 'Something went wrong.');
            }
        } catch (err) {
            console.error('S+UP Error:', err);
            alert('S+UP failed.');
        }
    };


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

                console.log(`Fetching from: ${endpoint}`); // debug log

                const token = localStorage.getItem('token');   // we're now doing this because of the AuthentcateToken in the user Routes.
                const res = await fetch(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        fetchUsers();
    }, [tabValue, view]);

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
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch current user');
                }

                const data = await res.json();
                setCurrentUser(data);
            } catch (err) {
                console.error('Error fetching current user:', err);
            }
        };

        fetchCurrentUser();
    }, []);




    // --------------------------- RENDER CONTENT FROM HERE DOWN -----------------------------------------------\
    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>

            {/* User card Information and Control ================================================================= */}
            <Box sx={{
                width: '300px',
                backgroundColor: '#9B331C',
                borderRadius: ' 20px',
                m: 5,
                boxShadow: '10',
                flexDirection: 'column',

            }}>
                {/* Avatar */}
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Avatar
                        src={
                            currentUser?.profileImageUrl
                                ? `${import.meta.env.VITE_API_URL}/uploads/${currentUser.profileImageUrl}`
                                : '/placeholder-profile.png'
                        }
                        alt={currentUser?.username || 'User'}
                        sx={{
                            width: 200,
                            height: 200,
                            mx: 'auto',
                            mb: 2

                        }}
                    />
                    <Typography
                        variant="h4">
                        {currentUser?.username || 'Unknown'}
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}>
                    <Button variant="contained" color="warning" onClick={() => navigate(`/profile`)}>
                        My Profile
                    </Button>
                    <Button variant="contained" color="warning" onClick={() => setView('requests')}>
                        Requests
                    </Button>
                    <Button variant="contained" color="warning" onClick={() => setTabValue(2)}>
                        Squad
                    </Button>
                </Box>


                <Box sx={{
                    display: 'flex',
                    mt: 75,
                    p: 3,
                    justifyContent: 'center',
                    gap: 3

                }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <SettingsIcon />
                            <ListItemText primary="" sx={{ ml: 1, alignContent: 'center' }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <HelpIcon />
                            <ListItemText primary="" sx={{ ml: 1 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <LogoutIcon />
                            <ListItemText primary="" sx={{ ml: 1 }} />
                        </ListItemButton>
                    </ListItem>
                </Box>
            </Box>
            {/* =========================================================================== */}


            {/* Main content area */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >

                {/* Tabs =================================================================================== */}
                <Box sx={{ textAlign: 'center', }}>
                    <img src="SquadUP.png" alt="" style={{
                        width: '150px',
                        height: 'auto',

                    }} />
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        centered
                        sx={{
                            '& .MuiTab-root': {
                                color: '#fff',
                            },
                            '& .Mui-selected': {
                                color: '#FF5722 !important',  // the color for orange here is #FF5722 if it gets changed again
                                fontWeight: 'bold',
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#FF5722 !important', // the color for orange here is #FF5722 if it gets changed again.
                            },
                        }}
                    >
                        <Tab label="Nearby" />
                        <Tab label="Discover" />
                        <Tab label="Matches" />
                    </Tabs>
                </Box>
                {/* =================================================================================== */}

                {/* Main Grid or ProfileCard Display ================================================== */}
                {selectedUser ? (
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            p: 3,
                            display: 'flex',
                            justifyContent: 'flex-start', // aligns to the left like the grid
                        }}
                    >
                        <UserProfileCard
                            user={selectedUser}
                            onBack={() => setSelectedUser(null)}
                        />
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
                            .filter((user) => user._id !== currentUser?._id)
                            .map((user) => (
                                <Grid xs={12} sm={6} md={4} key={user._id}>
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
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ justifyContent: 'space-evenly' }}>
                                                <Typography variant="h5">{user.username}</Typography>
                                                <Typography variant="body2">Interests:</Typography>
                                                <ul style={{ margin: 10 }}>
                                                    {user.interests?.map((interest, i) => (
                                                        <li key={i}>
                                                            <Typography variant="body2">{interest}</Typography>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Box>
                                        </CardContent>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-evenly',
                                                mb: 2,
                                            }}
                                        >
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
