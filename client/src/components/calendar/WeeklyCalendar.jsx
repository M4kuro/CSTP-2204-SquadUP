import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];

const WeeklyCalendar = ({ bookingsByDate = {}, onSelectDay }) => {
  const [referenceDate, setReferenceDate] = useState(new Date());

  // Get Monday of the current week
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when Sunday
    return new Date(d.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(referenceDate);

  const handlePrevWeek = () => {
    const prev = new Date(referenceDate);
    prev.setDate(prev.getDate() - 7);
    setReferenceDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(referenceDate);
    next.setDate(next.getDate() + 7);
    setReferenceDate(next);
  };

  // Generate current week's date labels (Mon to Fri)
  const weekDates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const formattedRange = `${weekDates[0].toLocaleDateString()} - ${weekDates[4].toLocaleDateString()}`;

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
        <Button onClick={handlePrevWeek}>⬅ Prev</Button>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          🗓 Weekly Calendar View <br /> ({formattedRange})
        </Typography>
        <Button onClick={handleNextWeek}>Next ➡</Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '100px repeat(5, 1fr)',
          gap: 1,
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'visible',
          paddingBottom: 1,
        }}
      >
        {/* Header row with dates */}
        <Box /> {/* Empty corner cell */}
        {weekDates.map((date, idx) => (
          <Typography key={idx} align="center" fontWeight="bold">
            {weekdays[idx]} <br />
            {date.getMonth() + 1}/{date.getDate()}
          </Typography>
        ))}

        {/* Time slots */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <Typography align="right" pr={1} sx={{ fontWeight: 500 }}>
              {hour}
            </Typography>
            {weekDates.map((dateObj, idx) => {
              const dateKey = dateObj.toISOString().split('T')[0];
              const booking = bookingsByDate[dateKey]?.[hour];

              return (
                <Paper
                  key={`${hour}-${idx}`}
                  onClick={() => booking && onSelectDay && onSelectDay(dateObj)}
                  sx={{
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: booking ? 'flex-start' : 'center',
                    backgroundColor: booking ? '#ffcc80' : '#e0e0e0',
                    fontSize: '0.8rem',
                    borderRadius: 1,
                    px: booking ? 1 : 0,
                    gap: 1,
                    cursor: booking ? 'pointer' : 'default',
                  }}
                  elevation={1}
                >
                  {booking ? (
                    <>
                      <img
                        src={
                          booking.image
                            ? `${import.meta.env.VITE_API_URL}/uploads/${booking.image}`
                            : '/default-avatar.png'
                        }
                        alt="client"
                        style={{ width: 20, height: 20, borderRadius: '50%' }}
                      />
                      <span>{booking.username}</span>
                    </>
                  ) : (
                    'Available'
                  )}
                </Paper>
              );
            })}

          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default WeeklyCalendar;
