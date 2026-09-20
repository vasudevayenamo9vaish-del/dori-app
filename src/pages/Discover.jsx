import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, SlidersHorizontal, X, Check, User, Search, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ThreadIcon from '../components/ThreadIcon';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import './Discover.css';

const COUNTRIES = [
  "Worldwide", "India", "USA", "Europe", "UK", "Australia", "Southeast Asia"
];

const Discover = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const selectedMood = location.state?.mood;
  const { user } = useAuth();
  const [toast, setToast] = useState(null);

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [filterGender, setFilterGender] = useState('Any');
  const [filterMinAge, setFilterMinAge] = useState(18);
  const [filterMaxAge, setFilterMaxAge] = useState(100);
  const [filterRegion, setFilterRegion] = useState('Any');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchProfiles();
    }, 500);
    return () => clearTimeout(timer);
  }, [filterGender, filterMinAge, filterMaxAge, filterRegion, searchQuery]);

  async function fetchProfiles() {
    setLoading(true);
    try {
      // Fetch ALL profiles except current user
      let query = supabase.from('profiles').select('*').neq('id', user.id);

      // Do NOT filter in Supabase. We will do it in JavaScript to guarantee it works regardless of RLS or PostgREST quirks.
      const { data, error } = await query;
      if (error) throw error;
      
      const { data: matches } = await supabase
        .from('matches')
        .select('receiver_id, requester_id, status')
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);
        
      const activeMatches = matches?.filter(m => m.status === 'pending' || m.status === 'accepted') || [];
      const matchedIds = activeMatches.flatMap(m => [m.receiver_id, m.requester_id]);
      
      const { data: currentUserProfile } = await supabase
        .from('profiles').select('blocked_users').eq('id', user.id).single();
        
      const blockedUsers = currentUserProfile?.blocked_users || [];
      
      let availableProfiles = data.filter(p => !blockedUsers.includes(p.id));
      
      // APPLY SEARCH FILTER IN JAVASCRIPT
      if (searchQuery.trim() !== '') {
        const lowerQuery = searchQuery.trim().toLowerCase();
        availableProfiles = availableProfiles.filter(p => 
          p.first_name && p.first_name.toLowerCase().includes(lowerQuery)
        );
      } else {
        // APPLY NORMAL FILTERS
        availableProfiles = availableProfiles.filter(p => !matchedIds.includes(p.id));
        
        if (filterGender !== 'Any') {
          availableProfiles = availableProfiles.filter(p => p.gender === filterGender);
        }
        if (filterRegion !== 'Any') {
          availableProfiles = availableProfiles.filter(p => p.country === filterRegion);
        }
        availableProfiles = availableProfiles.filter(p => p.age >= filterMinAge && p.age <= filterMaxAge);
      }
      
      setProfiles(availableProfiles);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleConnect = async (id) => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
    
    // Remove from UI immediately for snappy feel
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    
    try {
      // Use native Postgres UPSERT to absolutely guarantee no duplicate key errors
      const { error } = await supabase.from('matches').upsert(
        { requester_id: user.id, receiver_id: id, status: 'pending' },
        { onConflict: 'requester_id,receiver_id' }
      );
      
      if (error) throw error;
      setToast('Connection request sent!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Failed to send match request:', err);
      alert('Error sending request: ' + (err.message || JSON.stringify(err)));
      // Re-fetch profiles so the user reappears if it failed
      fetchProfiles();
    }
  };

  const applyFilters = () => {
    setShowFilters(false);
    // fetchProfiles is triggered by useEffect dependencies
  };

  return (
    <div className="screen-container discover-screen">
      <div className="discover-header">
        <div className="discover-header-top">
          <h2>Discover Connections</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={async () => {
                const btn = document.getElementById('discover-refresh-btn');
                if (btn) btn.style.transform = 'rotate(180deg)';
                await fetchProfiles();
                if (btn) btn.style.transform = 'rotate(0deg)';
              }} 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary-teal)' }}
            >
              <RefreshCw id="discover-refresh-btn" size={20} style={{ transition: 'transform 0.3s ease' }} />
            </button>
            <button className="filter-btn" onClick={() => setShowFilters(true)}>
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>
        
        <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', padding: '8px 12px', marginTop: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <Search size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: '0.95rem' }}
          />
        </div>

        {selectedMood && !searchQuery ? (
          <p className="filtered-mood" style={{ marginTop: '10px' }}>Matching you based on: <span>"{selectedMood}"</span></p>
        ) : !searchQuery && (
          <p style={{ marginTop: '10px' }}>People near your emotional frequency.</p>
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
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.first_name} className="card-image" />
                    ) : (
                      <div className="avatar-placeholder" style={{ width: '100%', height: '100%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={60} color="#FFF" />
                      </div>
                    )}
                  </div>
                  
                  <div className="card-info">
                    <h3 className="card-name">{profile.first_name}, {profile.age}</h3>
                    <p className="card-demographics">
                      {profile.gender && `${profile.gender} • `}{profile.country && profile.country}
                    </p>
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
                <span className="rest-message">Try expanding your filters.</span>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className="filter-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="filter-modal"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="filter-modal-header">
                <h3>Filter Connections</h3>
                <button onClick={() => setShowFilters(false)} className="close-filter-btn">
                  <X size={24} />
                </button>
              </div>

              <div className="filter-section">
                <label>Gender Preference</label>
                <div className="filter-options">
                  {['Any', 'Female', 'Male', 'Non-binary'].map(g => (
                    <button 
                      key={g} 
                      className={`filter-pill ${filterGender === g ? 'active' : ''}`}
                      onClick={() => setFilterGender(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <label>Age Range</label>
                <div className="age-inputs">
                  <div className="age-input-group">
                    <span>Min</span>
                    <input 
                      type="number" 
                      value={filterMinAge} 
                      onChange={(e) => setFilterMinAge(Number(e.target.value))}
                      min={18} max={100}
                    />
                  </div>
                  <div className="age-input-divider">-</div>
                  <div className="age-input-group">
                    <span>Max</span>
                    <input 
                      type="number" 
                      value={filterMaxAge} 
                      onChange={(e) => setFilterMaxAge(Number(e.target.value))}
                      min={18} max={100}
                    />
                  </div>
                </div>
              </div>

              <div className="filter-section">
                <label>Region</label>
                <select 
                  value={filterRegion} 
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="filter-select"
                >
                  <option value="Any">Any Region</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button className="apply-filter-btn" onClick={applyFilters}>
                Show Connections
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="dori-toast"
          >
            <Check size={16} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discover;
