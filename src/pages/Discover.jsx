import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ThreadIcon from '../components/ThreadIcon';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './Discover.css';

const Discover = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const selectedMood = location.state?.mood;
  const { user } = useAuth();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // Fetch all profiles except current user
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);
        
      if (selectedMood) {
        // Optional: filter by mood, but for MVP we just prioritize or show all
        // query = query.eq('current_mood', selectedMood);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filter out profiles we already sent matches to
      const { data: matches } = await supabase
        .from('matches')
        .select('receiver_id')
        .eq('requester_id', user.id);
        
      const matchedIds = matches?.map(m => m.receiver_id) || [];
      const availableProfiles = data.filter(p => !matchedIds.includes(p.id));
      
      setProfiles(availableProfiles);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (id) => {
    // Remove from UI immediately for snappy feel
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    
    try {
      await supabase.from('matches').insert([
        { requester_id: user.id, receiver_id: id, status: 'pending' }
      ]);
    } catch (err) {
      console.error('Failed to send match request:', err);
    }
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
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>
            <ThreadIcon size={30} className="loading-spinner" />
          </div>
        ) : (
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
                    <span>{profile.current_mood || 'Looking for connection'}</span>
                  </div>
                  
                  <div className="card-image-wrapper">
                    <img src={profile.avatar_url} alt={profile.first_name} className="card-image" />
                  </div>
                  
                  <div className="card-info">
                    <h3 className="card-name">{profile.first_name}, {profile.age}</h3>
                    {profile.country && <p className="card-country">{profile.country}</p>}
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
        )}
      </div>
    </div>
  );
};

export default Discover;
