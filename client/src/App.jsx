import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'
import UserProfile from './pages/UserProfile';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          
          
          
        </Routes>
      </Router>
     
    </>
  )
}

export default App
