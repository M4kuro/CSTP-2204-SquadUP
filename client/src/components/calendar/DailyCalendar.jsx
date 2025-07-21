import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];

// setting the calendar so that the date will show "todays date" when you click on day
const DailyCalendar = ({ bookingsByDate = {}, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate));
    }
  }, [selectedDate]);

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
  const dateKey = currentDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  const dayBookings = bookingsByDate[dateKey] || {};

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
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2, 
      }}>
        <Button
          onClick={handlePrevDay}
          sx={{
            fontFamily: 'Michroma, sans-serif',
            color: '#000000ff',
            borderColor: '#ffffff',
            '&:hover': { backgroundColor: '#585858ff' },
          }}
        >
          ⬅ Prev
        
        </Button>

        <Typography variant="h6" sx={{ textAlign: 'center', fontFamily: 'Michroma, sans-serif', fontSize: '18px' }}>
          🕒 Daily Calendar View <br /> {formattedDate}
        </Typography>

        <Button
          onClick={handleNextDay}
          sx={{
            fontFamily: 'Michroma, sans-serif',
            color: '#000000ff',
            borderColor: '#ffffff',
            '&:hover': { backgroundColor: '#585858ff' },
          }}
        >
          Next ➡
        
        </Button>
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
        {hours.map((hour) => {
          const isBooked = dayBookings[hour];

          return (
            <React.Fragment key={hour}>
              <Typography align="right" pr={1} fontWeight={500}>
                {hour}
              </Typography>

              <Paper
                sx={{
                  height: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isBooked ? 'flex-start' : 'center',
                  backgroundColor: isBooked ? '#ffcc80' : '#e0e0e0',
                  fontSize: '16px',
                  fontFamily: 'Michroma, sans-serif',
                  borderRadius: 1,
                  px: isBooked ? 1 : 0,
                  gap: 1,
                }}
                elevation={1}
              >
                {isBooked ? (
                  <>
                    <img
                      src={
                        isBooked.image
                          ? `${import.meta.env.VITE_API_URL}/uploads/${isBooked.image}`
                          : '/default-avatar.png'
                      }
                      alt="client"
                      style={{ width: 24, height: 24, borderRadius: '50%' }}
                    />
                    <span>
                      {isBooked.username} &nbsp; <strong>Email:</strong> {isBooked.email}
                    </span>
                  </>
                ) : (
                  'Available'
                )}
              </Paper>
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

export default DailyCalendar;
