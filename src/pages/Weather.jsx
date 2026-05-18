import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, X, Heart, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Weather.css';

const CHECK_INS = [
  { id: 1, text: "Missing guidance today", color: "var(--accent-terracotta)", top: "20%", left: "10%", delay: 0 },
  { id: 2, text: "Feeling a bit lost", color: "var(--primary-teal)", top: "45%", left: "55%", delay: 1.5 },
  { id: 3, text: "Calm and listening", color: "var(--accent-gold)", top: "70%", left: "20%", delay: 3 },
  { id: 4, text: "Need someone to talk to", color: "var(--text-muted)", top: "30%", left: "60%", delay: 4.5 }
];

const MOOD_OPTIONS = [
  "Missing parental warmth / guidance",
  "Feeling left out or lonely",
  "Need someone to talk to",
  "Feeling calm and want to listen",
  "Feeling anxious / overwhelmed",
  "Want gentle company"
];

const Weather = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  const [checkIns, setCheckIns] = useState(CHECK_INS);
  const navigate = useNavigate();

  const handleShareAnonymously = () => {
    if (selectedMood) {
      // Add a new floating check-in to the background (simple MVP approach)
      setCheckIns([...checkIns, {
        id: Date.now(),
        text: selectedMood,
        color: "var(--text-dark)",
        top: `${Math.random() * 60 + 20}%`,
        left: `${Math.random() * 60 + 10}%`,
        delay: 0
      }]);
      setIsModalOpen(false);
      setSelectedMood('');
    }
  };

  const handleFindMatch = () => {
    if (selectedMood) {
      navigate('/discover', { state: { mood: selectedMood } });
    }
  };

  return (
    <div className="screen-container weather-screen">
      <div className="weather-header">
        <h2>Emotional Weather</h2>
        <p>You are not alone in how you feel.</p>
      </div>

      <div className="weather-visualization">
        <div className="particle-container">
           <div className="glow-orb orb-1"></div>
           <div className="glow-orb orb-2"></div>
           <div className="glow-orb orb-3"></div>
        </div>

        <div className="check-ins-container">
          {checkIns.map((item) => (
            <motion.div
              key={item.id}
              className="floating-checkin"
              style={{ top: item.top, left: item.left, color: item.color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
              transition={{ 
                duration: 8, 
                delay: item.delay,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              "{item.text}"
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="weather-footer">
        <button className="add-checkin-btn" onClick={() => setIsModalOpen(true)}>
          <CloudRain size={16} />
          Add your anonymous check-in
        </button>
      </div>

      {/* Mood Selection Modal / Bottom Sheet */}
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
              <p className="sheet-subtitle">Select a feeling to express yourself.</p>
              
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
