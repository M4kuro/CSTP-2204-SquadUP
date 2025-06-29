import { useEffect, useState } from 'react';
import {
    Box, AppBar, Toolbar, Typography, Avatar, Tabs, Tab,
    Grid, Card, CardContent, CardMedia, Button, Drawer,
    IconButton, List, ListItem, ListItemText
} from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
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

const drawerWidth = 170;

const baseUrl = `${import.meta.env.VITE_API_URL}/api/users`;

const HomePage = () => {
    // const location = useLocation(); //! if not used, deleted or mark as Wishlist
    // const isViewingOwnProfilePage = location.pathname.startsWith('/profile/'); //! if not used, deleted or mark as Wishlist
    // const isOnUserProfile = location.pathname.startsWith('/profile/'); //! if not used, deleted or mark as Wishlist



    const userId = localStorage.getItem('userId');
    const [tabValue, setTabValue] = useState(1); // default to "Discover" when a user hits the homepage
    const [users, setUsers] = useState([]);
    const [view, setView] = useState('discover'); // this tracks the current section
    const [selectedUser, setSelectedUser] = useState(null);
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

                const res = await fetch(endpoint);
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




    // --------------------------- RENDER CONTENT FROM HERE DOWN -----------------------------------------------\
    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            {/* Sidebar styling */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        backgroundColor: '#8B2F1C',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    },
                }}
            >
                <Box>
                    {/* Hamburger icon + label */}
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                        <IconButton color="inherit">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ ml: 1 }}>
                            Menu
                        </Typography>
                    </Box>

                    {/* SIDE BAR buttons */}
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setView('discover')}>
                                <SportsTennisIcon />
                                <ListItemText primary="Pickleball" sx={{ ml: 1 }} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => {
                                setTabValue(null);
                                setView('requests');
                            }}>
                                <GroupAddIcon />
                                <ListItemText primary="SquadUP Requests" sx={{ ml: 1 }} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setView('matches')}>
                                <VisibilityIcon />
                                <ListItemText primary="Matches" sx={{ ml: 1 }} />
                            </ListItemButton>
                        </ListItem>
                    </List>

                </Box>

                {/* Footer */}
                <Box>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <SettingsIcon />
                                <ListItemText primary="Settings" sx={{ ml: 1 }} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton>
                                <HelpIcon />
                                <ListItemText primary="Help" sx={{ ml: 1 }} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout}>
                                <LogoutIcon />
                                <ListItemText primary="Logout" sx={{ ml: 1 }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>

            </Drawer>

            {/* Main content area */}
            <Box
                sx={{
                    flexGrow: 1,
                    backgroundColor: '#2D3932',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Top AppBar */}
                <AppBar
                    position="static"
                    sx={{
                        backgroundColor: '#1E1E1E',
                        width: '100%',
                        height: 70,
                    }}
                >
                    <Toolbar sx={{ position: 'relative' }}>
                        <img
                            src="/SquadUP.png"
                            alt=""
                            style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 170,
                            }}
                        />
                        {!selectedUser && (
                            <Box sx={{ marginLeft: 'auto' }}>
                                <Avatar
                                    sx={{ bgcolor: '#FF5722', cursor: 'pointer' }}
                                    onClick={() => navigate(`/profile`)}  // updated this because we're on longer using params or userID.. this is just decoding via JWT
                                >
                                    U
                                </Avatar>
                            </Box>
                        )}

                    </Toolbar>
                </AppBar>

                {/* Tabs */}
                <Box sx={{ textAlign: 'center', mt: 2 }}>
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

                {/* User Grid */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
                    {selectedUser ? (
                        <UserProfileCard
                            user={selectedUser}
                            onBack={() => setSelectedUser(null)}
                        />
                    ) : (
                        <Grid container spacing={3}>
                            {users.map((user) => (
                                <Grid item xs={12} sm={6} md={4} key={user.user}>
                                    <Card>
                                        {/* 🖼️ Add main profile image here */}
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={
                                                user.profileImageUrl
                                                    ? `${import.meta.env.VITE_API_URL}/uploads/${user.profileImageUrl}`
                                                    : '/placeholder-profile.png' // optional fallback
                                            }
                                            alt={`${user.username}'s profile`}
                                            sx={{ objectFit: 'cover' }}
                                        />

                                        <CardContent>
                                            <Typography variant="h6">{user.username}</Typography>
                                            <Typography variant="body2">Interests:</Typography>
                                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                                                {user.interests?.map((interest, i) => (
                                                    <li key={i}>
                                                        <Typography variant="body2">{interest}</Typography>
                                                    </li>
                                                ))}
                                            </ul>

                                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>

                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={() => handleSquadUp(user._id)
                                                        
                                                    }
                                                    
                                                >
                                                    S+UP
                                                </Button>

                                                <Button
                                                    variant="outlined"
                                                    color="warning"
                                                    onClick={() => handleViewUser(user._id)} //! DONT CHANGE THIS { user._id }
                                                >
                                                    More
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;
