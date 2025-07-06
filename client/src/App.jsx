import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'
import UserProfile from './pages/UserProfile';
import BookingPage from './pages/BookingPage';
import BookingDayCalendar from './components/calendar/BookingDayCalendar';

function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Booking routes all handled in BookingPage */}
          <Route path="/booking/:proId" element={<BookingPage />} />
          <Route path="/booking/:proId/:yearMonth/:day" element={<BookingPage />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
