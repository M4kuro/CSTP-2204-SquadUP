import React from 'react';
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

const users = [
    {
        name: "J. Doe",
        age: 45,
        interests: ["Pickleball", "Tennis", "Checkers"],
        rating: 4,
        image: "https://i.pravatar.cc/150?img=5",
    },
    {
        name: "Taylor Swiftball",
        age: 33,
        interests: ["Pickleball", "Gym", "Monopoly"],
        rating: 5,
        image: "https://i.pravatar.cc/150?img=6",
    },
    {
        name: "Gamer Chad",
        age: 28,
        interests: ["Pickleball", "Fortnite", "Chess"],
        rating: 3,
        image: "https://i.pravatar.cc/150?img=7",
    },
];

const drawerWidth = 200;

const HomePage = () => {
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            {/* Sidebar */}
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
                    {/* Hamburger icon + label at top of sidebar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                        <IconButton color="inherit">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ ml: 1 }}>
                            Menu
                        </Typography>
                    </Box>

                    {/* Main nav buttons */}
                    <List>
                        <ListItem button>
                            <SportsTennisIcon />
                            <ListItemText primary="Pickleball" sx={{ ml: 1 }} />
                        </ListItem>
                        <ListItem button>
                            <GroupAddIcon />
                            <ListItemText primary="SquadUP Requests" sx={{ ml: 1 }} />
                        </ListItem>
                        <ListItem button>
                            <VisibilityIcon />
                            <ListItemText primary="Who Viewed Me" sx={{ ml: 1 }} />
                        </ListItem>
                    </List>
                </Box>

                {/* Footer buttons */}
                <Box>
                    <List>
                        <ListItem button>
                            <SettingsIcon />
                            <ListItemText primary="Settings" sx={{ ml: 1 }} />
                        </ListItem>
                        <ListItem button>
                            <HelpIcon />
                            <ListItemText primary="Help" sx={{ ml: 1 }} />
                        </ListItem>
                        <ListItem button>
                            <LogoutIcon />
                            <ListItemText primary="Logout" sx={{ ml: 1 }} />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>


            {/* Main content area */}
            <Box
                sx={{
                    flexGrow: 1,
                    backgroundColor: '#1E1E1E',
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
                    }}
                >
                    <Toolbar sx={{ position: 'relative' }}>
                        {/* Centered SQUAD UP */}
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                letterSpacing: 1,
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        >
                            SQUAD <span style={{ color: '#FF5722' }}>UP</span>
                        </Typography>

                        {/* Right-aligned Avatar */}
                        <Box sx={{ marginLeft: 'auto' }}>
                            <Avatar sx={{ bgcolor: '#FF5722' }}>U</Avatar>
                        </Box>
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
                                color: '#FF5722',
                                fontWeight: 'bold',
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#FF5722',
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
                    <Grid container spacing={3}>
                        {users.map((user, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={user.image}
                                        alt={`${user.name}'s profile`}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{user.name}</Typography>
                                        <Typography variant="body2">Age: {user.age}</Typography>
                                        <Typography variant="body2">Interests:</Typography>
                                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                                            {user.interests.map((interest, i) => (
                                                <li key={i}>
                                                    <Typography variant="body2">{interest}</Typography>
                                                </li>
                                            ))}
                                        </ul>
                                        <Typography variant="body2">Rating: {'⭐'.repeat(user.rating)}</Typography>
                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                            <Button variant="contained" color="warning">S+UP</Button>
                                            <Button variant="outlined" color="warning">More</Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;
