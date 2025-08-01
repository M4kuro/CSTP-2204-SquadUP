import { Tabs, Tab } from "@mui/material";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import { baseUrl, TabValue } from "../constant";

const TabControl = ({ setCurrentUser, setIncomingRequests }) => {
  const { tabValue, setTabValue } = useContext(AppContext);

  const handleTabClick = async (tab) => {
    setTabValue(tab);
  };

  const refreshTabData = async (tabIndex) => {
    const token = localStorage.getItem("token");
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
      const filtered = requestsData.filter(
        (u) => !data.matches?.includes(u._id),
      );
      setIncomingRequests(filtered);

      let endpoint = "Discover";
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
      console.error("Tab refresh error:", err);
    }
  };

  return (
    <Tabs
      value={tabValue}
      onChange={() => {}}
      centered
      sx={{
        mt: 2,
        "& .MuiTab-root": { color: "#000000ff" },
        "& .Mui-selected": {
          color: "#000000ff !important",
          fontWeight: "bold",
        },
        "& .MuiTabs-indicator": { backgroundColor: "#000000ff !important" },
      }}
    >
      <Tab
        label=""
        sx={{ fontFamily: "Michroma, sans-serif" }}
        //onClick={() => handleTabClick(TabValue.Nearby)}
      /> 
      <Tab
        label="Discover"
        sx={{ fontFamily: "Michroma, sans-serif" }}
        onClick={() => handleTabClick(TabValue.Discover)}
      />
      <Tab
        label="Matches"
        sx={{ fontFamily: "Michroma, sans-serif" }}
        onClick={() => handleTabClick(TabValue.Matches)}
      />
    </Tabs>
  );
};

export default TabControl;
