import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

// Utility to get all days of the given month
const generateMonthDays = (year, month) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const days = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  return days;
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthlyCalendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = generateMonthDays(year, month);

  // Padding the start of the calendar grid
  const firstDayOfWeek = daysInMonth[0].getDay();
  const paddedDays = Array(firstDayOfWeek).fill(null).concat(daysInMonth);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const formattedMonthYear = currentDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Box>
      {/* Month Navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button onClick={handlePrevMonth}>⬅ Prev</Button>
        <Typography variant="h6">{formattedMonthYear}</Typography>
        <Button onClick={handleNextMonth}>Next ➡</Button>
      </Box>

      {/* Weekday headers */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
        {dayNames.map((day) => (
          <Typography key={day} variant="subtitle2" align="center" fontWeight="bold">
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
        }}
      >
        {paddedDays.map((day, idx) => {
          const isWeekday = day && day.getDay() >= 1 && day.getDay() <= 5; // M–F
          return (
            <Box
              key={idx}
              sx={{
                border: '1px solid #ccc',
                minHeight: 80,
                backgroundColor: day
                  ? isWeekday
                    ? '#c8f7c5'
                    : '#eee'
                  : 'transparent',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                p: 1,
              }}
            >
              <Typography variant="caption">
                {day ? day.getDate() : ''}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default MonthlyCalendar;
