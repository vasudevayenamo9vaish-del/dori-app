import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Chats from './pages/Chats';
import Weather from './pages/Weather';
import BottomNav from './components/BottomNav';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import { useAuth } from './contexts/AuthContext';
import ThreadIcon from './components/ThreadIcon';

// A simple layout wrapper to show bottom nav
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNav = location.pathname.includes('/chat/'); // Hide on individual chat screen
  
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

  if (!user) {
    return <Auth />;
  }

  if (!profile) {
    return <Onboarding />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
