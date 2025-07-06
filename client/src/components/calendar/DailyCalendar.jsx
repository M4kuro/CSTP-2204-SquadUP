import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];

// setting the calendar so that the date will show "todays date" when you click on day
const DailyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const formattedDate = currentDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Box
      sx={{
        width: '80%',
        maxWidth: '860px',
        margin: '0 auto',
        mt: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
      }}
    >
      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button onClick={handlePrevDay}>⬅ Prev</Button>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          🕒 Daily Calendar View <br /> {formattedDate}
        </Typography>
        <Button onClick={handleNextDay}>Next ➡</Button>
      </Box>

      {/* Hour blocks */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr', // Time + slot
          gap: 1,
          alignItems: 'center',
          width: '95%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <Typography align="right" pr={1} fontWeight={500}>
              {hour}
            </Typography>
            <Paper
              sx={{
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e0e0e0',
                fontSize: '0.85rem',
                borderRadius: 1,
              }}
              elevation={1}
            >
              Available
            </Paper>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default DailyCalendar;
