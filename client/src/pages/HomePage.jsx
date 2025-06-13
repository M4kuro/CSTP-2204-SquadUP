import React, { useEffect, useState } from 'react';
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

const drawerWidth = 170;



const HomePage = () => {
  const [tabValue, setTabValue] = useState(1); // Default to "Discover"
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();



  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/discover');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the JWT
    navigate('/'); // Redirect to login
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
          {/* Hamburger icon + label */}
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

        {/* Footer */}
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
            <ListItem button onClick={ handleLogout }>
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

          <img src="/SquadUP.png" alt=""
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 170 }} />
            
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
                color: '#D5501E',
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
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Card>
                  {/* Optional: check for profile image later */}
                  <CardMedia
                    component="div"
                    sx={{
                      height: 160,
                      backgroundColor: '#444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}
                  >
                    SquadUP Member
                  </CardMedia>
                  <CardContent>
                    <Typography variant="h6">{user.username}</Typography>
                    <Typography variant="body2">Interests:</Typography>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {user.interests.map((interest, i) => (
                        <li key={i}>
                          <Typography variant="body2">{interest}</Typography>
                        </li>
                      ))}
                    </ul>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
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
