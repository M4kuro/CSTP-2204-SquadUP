import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'
import UserProfile from './pages/UserProfile';
import BookingPage from './pages/BookingPage';
import BookingDayCalendar from './components/calendar/BookingDayCalendar';
import MessagesPage from './pages/MessagesPage';
import ChatRoomPage from './pages/ChatRoomPage';
import BookingSuccess from './pages/BookingSuccess';

function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* messages and chat routes all handled in MessagesPage */}
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:threadId" element={<ChatRoomPage />} />

          {/* Booking routes all handled in BookingPage */}
          <Route path="/booking/:proId" element={<BookingPage />} />
          <Route path="/booking/:proId/:yearMonth/:day" element={<BookingPage />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
