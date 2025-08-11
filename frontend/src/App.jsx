
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import UserDashboard from './pages/user/UserDashboard';
import VenuesPage from './pages/user/VenuesPage';

// Minimal UserLogin component with redirect on login
function UserLogin() {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    // Here you would handle authentication logic
    navigate('/dashboard');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
      <h2>User Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 240 }}>
        <input type="text" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<UserLogin />} />
  <Route path="/dashboard" element={<UserDashboard />} />
  <Route path="/venues" element={<VenuesPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
