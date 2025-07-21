import { Box, Avatar, Typography, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';


const UserSidebar = ({ currentUser, incomingRequests = [], setView, setTabValue, handleLogout, navigate }) => {
  return (
    <Box
      sx={{
        maxWidth: '400px',
        backgroundColor: '#000000ff',
        borderRadius: '20px',
        m: 3,
        boxShadow: 10,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,

      }}
    >
      {/* Top Avatar Section */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          src={
            currentUser?.profileImageUrl
              ? `${import.meta.env.VITE_API_URL}/uploads/${currentUser.profileImageUrl}`
              : '/placeholder-profile.png'
          }
          alt={currentUser?.username || 'User'}
          sx={{ width: 200, height: 200, mx: 'auto' }}
        />
        <Typography variant="h4">
          {currentUser?.username || 'Unknown'}
        </Typography>
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 3 }}>
        <Button variant="outlined" sx={buttonStyle} onClick={() => {navigate('/home');}}>Home Page</Button>
        <Button variant="outlined" sx={buttonStyle} onClick={() => navigate('/profile')}>My Profile</Button>
        <Button variant="outlined" sx={buttonStyle} onClick={() => setView?.('requests')}>
          Requests {incomingRequests.length > 0 && `(${incomingRequests.length})`}
        </Button>
        <Button variant="outlined" sx={buttonStyle} onClick={() => setTabValue?.(2)}>Squad</Button>
        <Button variant="outlined" sx={buttonStyle} onClick={() => navigate('/messages')}>Messages</Button>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 10, p: 3 }}>
        <Button variant="outlined" startIcon={<SettingsIcon />} sx={{ ...buttonStyle, justifyContent: 'flex-start' }} fullWidth>
          Settings
        </Button>
        <Button variant="outlined" startIcon={<HelpIcon />} sx={{ ...buttonStyle, justifyContent: 'flex-start' }} fullWidth>
          Help
        </Button>
        <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ ...buttonStyle, justifyContent: 'flex-start' }} fullWidth>
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

const buttonStyle = {
  color: 'white',
  '&:hover': { backgroundColor: '#585858ff' },
  borderColor: 'white',
  textTransform: 'none',
  fontFamily: 'Michroma, sans-serif',
};

export default UserSidebar;
