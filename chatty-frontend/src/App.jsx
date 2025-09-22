import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import React from 'react'

function App() {
  return (
    <Router>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected chat routes */}
          <Route 
            path="/chats" 
            element={
              <ProtectedRoute>
                <Navigate to="/chats/new" replace />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/chats/:chatId" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect old home route to new chats route for backward compatibility */}
          <Route 
            path="/home/:chatId?" 
            element={
              <ProtectedRoute>
                <Navigate to={`/chats/${window.location.pathname.split('/').pop() || 'new'}`} replace />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all - redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
