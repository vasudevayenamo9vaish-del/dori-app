import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreadIcon from '../components/ThreadIcon';
import './Home.css';
import ThreadBackground from '../components/ThreadBackground';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="screen-container home-screen">
      <ThreadBackground />
      
      <motion.div 
        className="home-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <h1 className="home-title">What are you feeling right now?</h1>
        <p className="home-subtitle">Connect with someone who understands.</p>
        
        <div className="emotion-selector">
          <input type="text" placeholder="e.g. Missing guidance today..." className="emotion-input" />
        </div>

        <div className="button-group">
          <motion.button 
            className="connect-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/discover')}
          >
            <ThreadIcon size={24} className="btn-icon" />
            <span>Find My Thread</span>
          </motion.button>
          
          <p className="home-tagline">One thread can change how you feel.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
