import { Tabs, Tab } from '@mui/material';

const TabControl = ({
  tabValue,
  setTabValue,
  setView,
  setCurrentUser,
  setIncomingRequests,
  setUsers,
  baseUrl,
}) => {
  const handleTabClick = async (index) => {
    if (tabValue === index) {
      await refreshTabData(index);
    } else {
      setTabValue(index);
      if (index === 0) setView('nearby');
      if (index === 1) setView('discover');
      if (index === 2) setView('matches');
    }
  };

  const refreshTabData = async (tabIndex) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${baseUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCurrentUser(data);

      const requestsRes = await fetch(`${baseUrl}/requests/${data._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const requestsData = await requestsRes.json();
      const filtered = requestsData.filter(u => !data.matches?.includes(u._id));
      setIncomingRequests(filtered);

      let endpoint = '';
      if (tabIndex === 0) {
        endpoint = `${baseUrl}/requests/${data._id}`;
      } else if (tabIndex === 2) {
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
      console.error('Tab refresh error:', err);
    }
  };

  return (
    <Tabs
      value={tabValue}
      onChange={() => {}}
      centered
      sx={{
        mt: 2,
        '& .MuiTab-root': { color: '#000000ff' },
        '& .Mui-selected': { color: '#000000ff !important', fontWeight: 'bold' },
        '& .MuiTabs-indicator': { backgroundColor: '#000000ff !important' },
      }}
    >
      <Tab label="Nearby" sx={{fontFamily: 'Michroma, sans-serif'}} onClick={() => handleTabClick(0)} />
      <Tab label="Discover" sx={{fontFamily: 'Michroma, sans-serif'}} onClick={() => handleTabClick(1)} />
      <Tab label="Matches" sx={{fontFamily: 'Michroma, sans-serif'}} onClick={() => handleTabClick(2)} />
    </Tabs>
  );
};

export default TabControl;
