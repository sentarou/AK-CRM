// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const theme = createTheme();

const isAuthenticated = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const expirationTime = localStorage.getItem('loginExpiration');
  
  if (isLoggedIn && expirationTime) {
    if (new Date().getTime() < parseInt(expirationTime)) {
      return true;
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginExpiration');
    }
  }
  return false;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;