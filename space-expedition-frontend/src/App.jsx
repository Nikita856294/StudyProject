import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    saveToken(token);
  }, [token]);

  const saveToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <AuthForm setToken={setToken} isLogin={true} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <AuthForm setToken={setToken} isLogin={false} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;