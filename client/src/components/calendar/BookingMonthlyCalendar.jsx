import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Generate all days in a month
const generateMonthDays = (year, month) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
};

const BookingMonthlyCalendar = ({ proId }) => {
  const navigate = useNavigate();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = generateMonthDays(year, month);
  const firstDayOfWeek = daysInMonth[0].getDay();
  const paddedDays = Array(firstDayOfWeek).fill(null).concat(daysInMonth);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        mt: 4,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "960px",
          p: 3,
          backgroundColor: "#f0f4f8",
          borderRadius: 4,
          boxShadow: 4,
        }}
      >
        <Typography variant="h6" sx={{ textAlign: "center", mb: 3 }}>
          📅 Select a Day to Book with Pro
        </Typography>

        {/* Weekday headers */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            mb: 1.5,
            gap: 1,
          }}
        >
          {dayNames.map((day) => (
            <Typography
              key={day}
              align="center"
              fontWeight="bold"
              sx={{ fontSize: "1rem" }}
            >
              {day}
            </Typography>
          ))}
        </Box>

        {/* Calendar grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(120px, 1fr))",
            gap: 2,
          }}
        >
          {paddedDays.map((day, idx) => {
            const dayOfWeek = day?.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            return (
              <Box
                key={idx}
                sx={{
                  border: "1px solid #ccc",
                  minHeight: 100,
                  backgroundColor: day
                    ? isWeekend
                      ? "#f8d7da" // light red for weekend
                      : "#e0f7fa"
                    : "transparent",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  p: 1.5,
                  cursor: day && !isWeekend ? "pointer" : "not-allowed",
                  "&:hover": {
                    backgroundColor: day && !isWeekend ? "#b2ebf2" : undefined,
                  },
                  opacity: isWeekend ? 0.5 : 1,
                }}
                onClick={() => {
                  if (!day || isWeekend) return;
                  const selectedDay = day.getDate().toString().padStart(2, "0");
                  const selectedMonth = (day.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                  const selectedYear = day.getFullYear();
                  console.log(
                    "Navigating to",
                    `/booking/${proId}/${selectedYear}-${selectedMonth}/${selectedDay}`,
                  );
                  navigate(
                    `/booking/${proId}/${selectedYear}-${selectedMonth}/${selectedDay}`,
                  );
                }}
              >
                <Typography variant="body2">
                  {day ? day.getDate() : ""}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default BookingMonthlyCalendar;
