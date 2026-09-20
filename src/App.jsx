import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Chats from './pages/Chats';
import Weather from './pages/Weather';
import BottomNav from './components/BottomNav';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import { useAuth } from './contexts/AuthContext';
import ThreadIcon from './components/ThreadIcon';
import GlobalHooks from './components/GlobalHooks';

import ResetPassword from './pages/ResetPassword';

// A simple layout wrapper to show bottom nav
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNav = location.pathname.includes('/chat/') || location.pathname === '/reset-password'; // Hide on individual chat screen
  
  return (
    <>
      {children}
      {!hideNav && <BottomNav />}
    </>
  );
};

const App = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-cream)' }}>
        <ThreadIcon size={40} className="loading-spinner" />
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <Layout>
          <GlobalHooks />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
};

export default App;
