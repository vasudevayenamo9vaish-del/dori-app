import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Chats from './pages/Chats';
import Weather from './pages/Weather';
import BottomNav from './components/BottomNav';
import { AnimatePresence } from 'framer-motion';

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
