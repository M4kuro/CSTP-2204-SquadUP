import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
//import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          
          
        </Routes>
      </Router>
     
    </>
  )
}

export default App
