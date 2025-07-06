import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];

const BookingDayCalendar = () => {
  const { proId, day } = useParams();
  const navigate = useNavigate();
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    const fetchBookedSlots = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${proId}/${day}`);
      const data = await res.json();
      setBookedSlots(data.bookedHours || []);
    };

    fetchBookedSlots();
  }, [proId, day]);

  const handleBook = async (hour) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ proId, day, hour }),
    });

    const result = await res.json();
    if (res.ok) {
      setBookedSlots([...bookedSlots, hour]);
      setBookingStatus(`✅ Booked ${hour} on ${day}`);
    } else {
      setBookingStatus(result.message || 'Booking failed');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '960px',
        mx: 'auto',
        mt: 4,
        p: 3,
        borderRadius: 3,
        backgroundColor: '#f1faff',
        boxShadow: '0 0 12px rgba(0, 0, 0, 0.1)',
        height: 'fit-content',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">
          🕒 Book a Time Slot on {day}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/booking/${proId}`)}
          sx={{
            backgroundColor: '#e0f7fa',
            borderRadius: 2,
            px: 2,
            py: 1,
            boxShadow: 1,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#b2ebf2',
            },
          }}
        >
          ⬅️ Back to Monthly View
        </Button>
      </Box>

      {bookingStatus && (
        <Typography align="center" color="success.main" mb={2}>
          {bookingStatus}
        </Typography>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
        {hours.map((hour) => {
          const isBooked = bookedSlots.includes(hour);
          return (
            <Paper
              key={hour}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                backgroundColor: isBooked ? '#ddd' : '#e0f7fa',
                opacity: isBooked ? 0.5 : 1,
                borderRadius: 2,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <Typography>{hour}</Typography>
              <Button
                variant="contained"
                disabled={isBooked}
                onClick={() => handleBook(hour)}
              >
                {isBooked ? 'Booked' : 'Book'}
              </Button>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default BookingDayCalendar;
