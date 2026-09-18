import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, X, Heart, Wind, Globe2, Share, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { COUNTRIES } from '../utils/countries';
import './Weather.css';

const MOOD_OPTIONS = [
  "Lonely", "Missing parental warmth", "Feeling neglected", "Overwhelmed", 
  "Feeling lost", "Need someone to listen", "Calm & here to support", 
  "Anxious", "Missing home", "Angry at life"
];

// Helper to map our seed data sentences to actual mood categories
const extractMoodCategory = (str) => {
  if (MOOD_OPTIONS.includes(str)) return str;
  const s = str.toLowerCase();
  if (s.includes("quiet house") || s.includes("unseen")) return "Lonely";
  if (s.includes("guide me")) return "Missing parental warmth";
  if (s.includes("deadlines")) return "Overwhelmed";
  if (s.includes("porch") || s.includes("peace") || s.includes("ready to listen")) return "Calm & here to support";
  if (s.includes("mom's cooking")) return "Missing home";
  if (s.includes("exams")) return "Anxious";
  if (s.includes("path leads")) return "Feeling lost";
  if (s.includes("silent hug")) return "Need someone to listen";
  if (s.includes("unfair")) return "Angry at life";
  // fallback for any other sentence
  return "Feeling lost";
};

const Weather = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState('Worldwide');
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    fetchCheckIns();

    const channel = supabase
      .channel('public:weather_check_ins')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'weather_check_ins' }, (payload) => {
        setCheckIns(prev => {
          const newItem = {
            ...payload.new,
            top: `${Math.random() * 60 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            delay: 0
          };
          return [newItem, ...prev];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchCheckIns() {
    try {
      const { data, error } = await supabase
        .from('weather_check_ins')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      
      const mapped = data.map((item, index) => ({
        ...item,
        top: `${(index % 4) * 15 + 10}%`,
        left: `${(index % 2 === 0 ? 10 : 40) + Math.random() * 10}%`,
        delay: index * 1.5
      }));
      setCheckIns(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareAnonymously = async () => {
    if (selectedMood) {
      setIsModalOpen(false);
      try {
        await supabase.from('weather_check_ins').insert([
          { 
            user_id: user?.id, 
            text: selectedMood, 
            country: profile?.country || 'Unknown' 
          }
        ]);
        setSelectedMood('');
      } catch (err) {
        console.error('Failed to insert check-in:', err);
      }
    }
  };

  const handleFindMatch = () => {
    if (selectedMood) {
      navigate('/discover', { state: { mood: selectedMood } });
    }
  };

  const filteredCheckIns = useMemo(() => {
    if (activeRegion === 'Worldwide') return checkIns;
    return checkIns.filter(c => c.country === activeRegion);
  }, [checkIns, activeRegion]);

  // Calculate Most Felt Emotion using the mapped categories
  const topEmotion = useMemo(() => {
    if (filteredCheckIns.length === 0) return { mood: "Searching...", percentage: 0 };
    
    const counts = {};
    filteredCheckIns.forEach(c => {
      const moodCategory = extractMoodCategory(c.text);
      counts[moodCategory] = (counts[moodCategory] || 0) + 1;
    });
    
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top = sorted[0];
    
    return {
      mood: top[0],
      percentage: Math.round((top[1] / filteredCheckIns.length) * 100)
    };
  }, [filteredCheckIns]);

  return (
    <div className="screen-container weather-screen">
      
      {/* Background - User Uploaded World Map */}
      <div className="weather-bg-art">
      </div>

      <div className="weather-content-wrapper">
        <div className="weather-header">
          <h2>Emotional Weather</h2>
          <p className="subtitle-italic">You are not alone in how you feel</p>
        </div>

        {/* Region Filter */}
        <div className="region-filter-container" style={{ padding: '0 20px', margin: '10px 0' }}>
          <select 
            value={activeRegion}
            onChange={(e) => setActiveRegion(e.target.value)}
            style={{ 
              width: '100%', 
              backgroundColor: 'rgba(255,255,255,0.9)', 
              border: '1px solid rgba(0,0,0,0.1)', 
              padding: '10px 15px', 
              borderRadius: '20px',
              fontFamily: 'inherit',
              color: 'var(--text-dark)',
              outline: 'none'
            }}
          >
            <option value="Worldwide">🌐 Worldwide</option>
            {COUNTRIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Floating Check-ins Area (Takes up middle space) */}
        <div className="floating-checkins-area">
          <AnimatePresence>
            {!loading && filteredCheckIns.slice(0, 3).map((item) => (
              <motion.div
                key={item.id}
                className="floating-bubble"
                style={{ top: item.top, left: item.left }}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9], y: [10, 0, -10, -20] }}
                transition={{ 
                  duration: 8, 
                  delay: item.delay,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                "{item.text}"
                {activeRegion === 'Worldwide' && item.country && (
                  <span className="bubble-country">{item.country}</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Area: Stats + Button */}
        <div className="weather-bottom-area">
          <AnimatePresence>
            {activeRegion !== 'Worldwide' && topEmotion && (
              <motion.div 
                className="compact-stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="stat-label">Most Felt in {activeRegion}</div>
                <div className="stat-data">
                  <span className="stat-percentage">{topEmotion.percentage}%</span>
                  <span className="stat-mood-text">{topEmotion.mood}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button className="add-checkin-btn" onClick={() => setIsModalOpen(true)}>
            <CloudRain size={16} />
            Add your anonymous check-in
          </button>
        </div>
      </div>

      {/* Mood Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="mood-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <button className="close-sheet-btn" onClick={() => { setIsModalOpen(false); setSelectedMood(''); }}>
                <X size={24} />
              </button>
              
              <h3 className="sheet-title">How are you feeling right now?</h3>
              <p className="sheet-subtitle">Type your feelings anonymously or select a tag.</p>
              
              <textarea 
                className="onboarding-input"
                placeholder="I am feeling..."
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                maxLength={100}
                style={{ width: '100%', minHeight: '80px', marginBottom: '15px', resize: 'none' }}
              />

              <div className="mood-tags-container">
                {MOOD_OPTIONS.map((mood) => (
                  <button 
                    key={mood}
                    className={`mood-tag ${selectedMood === mood ? 'selected' : ''}`}
                    onClick={() => setSelectedMood(mood)}
                  >
                    {mood}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {selectedMood && (
                  <motion.div 
                    className="action-options"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <button className="action-btn share-btn" onClick={handleShareAnonymously}>
                      <Wind size={18} />
                      Share anonymously in Weather
                    </button>
                    
                    <button className="action-btn find-btn" onClick={handleFindMatch}>
                      <Heart size={18} />
                      Find someone who matches this
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Weather;
