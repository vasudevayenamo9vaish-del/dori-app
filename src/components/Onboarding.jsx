import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import ThreadIcon from './ThreadIcon';
import './Auth.css'; // Reuse auth styles

const COUNTRIES = [
  "Worldwide",
  "India",
  "USA",
  "Europe",
  "UK",
  "Australia",
  "Southeast Asia"
];

const Onboarding = () => {
  const { user, fetchProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  const calculateAge = (dobString) => {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!firstName || !dob || !country || !gender) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const age = calculateAge(dob);
      
      const { error: insertError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          first_name: firstName,
          age: age,
          dob: dob,
          country: country,
          gender: gender,
          bio: bio,
          // Placeholder for optional photo later
          avatar_url: `https://api.dicebear.com/7.x/notionists/svg?seed=${firstName}&backgroundColor=F8F4ED`
        }
      ]);

      if (insertError) throw insertError;
      
      // Update global context
      await fetchProfile(user.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container screen-container" style={{ overflowY: 'auto' }}>
      <motion.div 
        className="auth-box"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ margin: '40px 0' }}
      >
        <div className="auth-header">
          <ThreadIcon size={40} className="auth-logo" />
          <h2>Welcome to Dori</h2>
          <p>Let's create your emotional sanctuary.</p>
        </div>

        <div className="community-guidelines" style={{ marginBottom: '20px', padding: '16px', background: 'rgba(217,119,106,0.1)', borderRadius: '16px', textAlign: 'left', fontSize: '13px', color: 'var(--primary-teal)' }}>
          <strong>🌿 Community Guidelines</strong>
          <p style={{ marginTop: '6px' }}>Dori is a safe space. Be kind. Be real. Protect each other. We suggest keeping all conversations within Dori and never sharing personal details.</p>
        </div>

        <form onSubmit={handleSaveProfile} className="auth-form">
          <input
            type="text"
            placeholder="First Name *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="auth-input"
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', marginLeft: '12px' }}>Date of Birth *</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <select 
            value={gender} 
            onChange={(e) => setGender(e.target.value)} 
            required 
            className="auth-input"
          >
            <option value="" disabled>Gender *</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>

          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            required 
            className="auth-input"
          >
            <option value="" disabled>Select Region *</option>
            {COUNTRIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <textarea
            placeholder="A short bio (Optional)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="auth-input"
            style={{ resize: 'none', height: '60px' }}
          />
          
          {error && <p className="auth-message">{error}</p>}
          
          <button type="submit" disabled={loading} className="auth-btn connect-btn">
            {loading ? 'Saving...' : 'Enter Dori'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Onboarding;
