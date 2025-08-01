import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

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

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthlyCalendar = ({ onSelectDay, bookingsByDate = [] }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = generateMonthDays(year, month);

  // Padding the start of the calendar grid
  const firstDayOfWeek = daysInMonth[0].getDay();
  const paddedDays = Array(firstDayOfWeek).fill(null).concat(daysInMonth);

  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const formattedMonthYear = currentDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  // collects all booked dates in this month (formatted like this "2025-07-31")
  // const bookedDatesSet = new Set(
  //   bookings
  //     .filter((b) => {
  //       const d = new Date(b.date);
  //       return d.getFullYear() === year && d.getMonth() === month;
  //     })
  //     .map((b) => new Date(b.date).toDateString())
  // );
  const rawBookingDates = Object.keys(bookingsByDate);
  console.log("📦 Raw booking dates:", rawBookingDates);

  const bookedDatesSet = new Set(
    rawBookingDates.filter((dateStr) => {
      const d = new Date(dateStr);
      return d.getFullYear() === year && d.getMonth() === month;
    }).map(dateStr => {
      const d = new Date(dateStr);
      return d.toISOString().split("T")[0]; // ✅ returns "YYYY-MM-DD"
    })
  );

  console.log("✅ Booking matches this month:", [...bookedDatesSet]);

  return (
    <Box>
      {/* Month Navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Button
          onClick={handlePrevMonth}
          variant="outlined"
          sx={{
            fontFamily: "Michroma, sans-serif",
            color: "#ffffffff",
            borderColor: "#ffffff",
            "&:hover": { backgroundColor: "#585858ff" },
          }}
        >
          ⬅ Prev
        </Button>
        <Typography
          sx={{
            textAlign: "center",
            fontFamily: "Michroma, sans-serif",
            fontSize: "18px",
            color: "#ffffffff",
          }}
        >
          {formattedMonthYear}
        </Typography>
        <Button
          onClick={handleNextMonth}
          variant="outlined"
          sx={{
            fontFamily: "Michroma, sans-serif",
            color: "#ffffffff",
            borderColor: "#ffffff",
            "&:hover": { backgroundColor: "#585858ff" },
          }}
        >
          Next ➡
        </Button>
      </Box>

      {/* Weekday headers */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {dayNames.map((day) => (
          <Typography
            key={day}
            variant="subtitle2"
            align="center"
            fontWeight="bold"
            sx={{ fontFamily: "Michroma, sans-serif", color: "#ffffffff" }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
        }}
      >
        {paddedDays.map((day, idx) => {
          const isWeekday = day && day.getDay() >= 1 && day.getDay() <= 5; // M–F
          const isClickable = Boolean(day);
          console.log("📆 Rendering calendar day:", day?.toDateString());

          return (
            <Box
              key={idx}
              onClick={() => {
                if (isClickable && onSelectDay) {
                  onSelectDay(day); // 🔥 Drill-down to day view
                }
              }}
              sx={{
                position: "relative",
                border: "1px solid #ccc",
                minHeight: 70,
                backgroundColor: isClickable
                  ? isWeekday
                    ? "#ffffffff"
                    : "#707070ff"
                  : "transparent",
                borderRadius: 1,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                p: 1,
                cursor: isClickable ? "pointer" : "default",
                "&:hover": {
                  backgroundColor: isClickable ? "#00c63fff" : "transparent",
                },
              }}
            >
              <Typography variant="caption">
                {day ? day.getDate() : ""}
              </Typography>
              {/* red dot if this day has bookings */}
              {day && bookedDatesSet.has(day.toISOString().split("T")[0]) && (

                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "red",
                    position: "absolute",
                    top: 6,
                    right: 6,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default MonthlyCalendar;
