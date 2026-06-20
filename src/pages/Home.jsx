import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThreadBackground from '../components/ThreadBackground';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const MOODS = [
  "Lonely", 
  "Missing parental warmth", 
  "Feeling neglected", 
  "Overwhelmed", 
  "Feeling lost", 
  "Need someone to listen", 
  "Calm & here to support", 
  "Anxious", 
  "Missing home", 
  "Angry at life"
];

const INTENTIONS = [
  "Someone who feels the same", 
  "Someone to listen", 
  "Someone I can support"
];

const Home = () => {
  const navigate = useNavigate();
  const { user, fetchProfile } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedIntention, setSelectedIntention] = useState('');
  const [saving, setSaving] = useState(false);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setTimeout(() => setStep(2), 300); // Small delay to show selection
  };

  const handleIntentionSelect = async (intention) => {
    setSelectedIntention(intention);
    setSaving(true);
    
    // Update profile in supabase
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          current_mood: selectedMood, 
          looking_for: intention 
        })
        .eq('id', user.id);
        
      if (!error) {
        await fetchProfile(user.id); // Refresh local context
        navigate('/discover');
      } else {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="screen-container home-screen">
      <ThreadBackground />
      
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            className="home-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="home-title">How are you feeling right now?</h1>
            
            <div className="pill-grid">
              {MOODS.map(mood => (
                <button 
                  key={mood}
                  className={`mood-pill ${selectedMood === mood ? 'selected' : ''}`}
                  onClick={() => handleMoodSelect(mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            className="home-content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="home-title">What are you looking for?</h1>
            
            <div className="intention-stack">
              {INTENTIONS.map(intention => (
                <button 
                  key={intention}
                  disabled={saving}
                  className={`intention-btn ${selectedIntention === intention ? 'selected' : ''}`}
                  onClick={() => handleIntentionSelect(intention)}
                >
                  {saving && selectedIntention === intention ? 'Finding threads...' : intention}
                </button>
              ))}
            </div>
            
            <button className="back-link" onClick={() => setStep(1)}>
              ← Back to feelings
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
