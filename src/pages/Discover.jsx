import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ThreadIcon from '../components/ThreadIcon';
import './Discover.css';

const MOCK_PROFILES = [
  {
    id: 1,
    name: 'Eleanor',
    age: 62,
    emotion: 'Calm and here to listen',
    bio: 'I have raised three children and have a lot of quiet evenings. Happy to offer a warm, listening ear if you need one.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Julian',
    age: 28,
    emotion: 'Missing parental warmth today',
    bio: 'Moved to a new city recently. Feeling a bit adrift and would love some simple, grounding advice.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Maya',
    age: 24,
    emotion: 'Feeling left out',
    bio: 'Just looking for someone who understands what it feels like to be on the outside looking in.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  }
];

const Discover = () => {
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const location = useLocation();
  const selectedMood = location.state?.mood;

  const handleConnect = (id) => {
    // Simulate connection by removing the card
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="screen-container discover-screen">
      <div className="discover-header">
        <h2>Discover Connections</h2>
        {selectedMood ? (
          <p className="filtered-mood">Matching you based on: <span>"{selectedMood}"</span></p>
        ) : (
          <p>People near your emotional frequency.</p>
        )}
      </div>

      <div className="cards-container">
        <AnimatePresence>
          {profiles.length > 0 ? (
            profiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                className="profile-card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="card-emotion-header">
                  <Sparkles size={14} className="sparkle-icon" />
                  <span>{profile.emotion}</span>
                </div>
                
                <div className="card-image-wrapper">
                  <img src={profile.image} alt={profile.name} className="card-image" />
                </div>
                
                <div className="card-info">
                  <h3 className="card-name">{profile.name}, {profile.age}</h3>
                  <p className="card-bio">{profile.bio}</p>
                  
                  <button 
                    className="connect-gently-btn"
                    onClick={() => handleConnect(profile.id)}
                  >
                    <ThreadIcon size={18} />
                    <span>Connect Gently</span>
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="no-profiles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>You've seen all connections for now.</p>
              <span className="rest-message">Rest your mind.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Discover;
