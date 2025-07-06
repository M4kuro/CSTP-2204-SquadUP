import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import BookingMonthlyCalendar from '../components/calendar/BookingMonthlyCalendar';
import BookingDayCalendar from '../components/calendar/BookingDayCalendar';

const BookingPage = () => {
  const { proId } = useParams();
  const location = useLocation();
  const [proUser, setProUser] = useState(null);

  const isDayView = location.pathname.split('/').length === 5;

  useEffect(() => {
    const fetchProUser = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${proId}`);
      const data = await res.json();
      setProUser(data);
    };

    fetchProUser();
  }, [proId]);

  return (
    <Box sx={{ width: '100%', p: 4 }}>
      {/* Consistent Header */}
      <Box sx={{ width: '100%', maxWidth: '960px', mx: 'auto', mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            textAlign: 'center',
            backgroundColor: '#f0f4f8',
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          Booking with {proUser?.username || '...'}
        </Typography>
      </Box>

      {/* Conditional View */}
      {isDayView ? (
        <BookingDayCalendar />
      ) : (
        <BookingMonthlyCalendar proId={proId} />
      )}
    </Box>
  );
};

export default BookingPage;
