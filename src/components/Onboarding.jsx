import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Camera, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { COUNTRIES } from '../utils/countries';
import { motion } from 'framer-motion';
import { getDefaultAvatar } from '../utils/avatarCatalog';
import AvatarSelector from './AvatarSelector';
import ThreadIcon from './ThreadIcon';
import './Auth.css'; // Reuse auth styles


const Onboarding = () => {
  const { user, fetchProfile } = useAuth();
  
  // Extract SSO metadata (Google name & picture)
  const ssoMeta = user?.user_metadata || {};
  const ssoName = ssoMeta.given_name || ssoMeta.first_name || (ssoMeta.full_name || ssoMeta.name ? (ssoMeta.full_name || ssoMeta.name).trim().split(' ')[0] : '');
  const ssoAvatar = ssoMeta.avatar_url || ssoMeta.picture || '';

  const [loading, setLoading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [firstName, setFirstName] = useState(ssoName || '');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(() => {
    if (ssoAvatar) return ssoAvatar;
    return getDefaultAvatar({ gender: 'Non-binary' }).url;
  });
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (ssoName && !firstName) {
      setFirstName(ssoName);
    }
  }, [user]);

  const handleGenderChange = (newGender) => {
    setGender(newGender);
    if (!avatarUrl || avatarUrl.includes('api.dicebear.com')) {
      const match = getDefaultAvatar({ gender: newGender, dob });
      if (match) setAvatarUrl(match.url);
    }
  };

  const handleDobChange = (newDob) => {
    setDob(newDob);
    if ((!avatarUrl || avatarUrl.includes('api.dicebear.com')) && gender) {
      const match = getDefaultAvatar({ gender, dob: newDob });
      if (match) setAvatarUrl(match.url);
    }
  };

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
          avatar_url: avatarUrl || ssoAvatar || getDefaultAvatar({ gender, dob }).url
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

        {/* Pre-built Avatar Preview & Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <div 
            style={{ 
              width: '88px', 
              height: '88px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              background: '#fff', 
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              border: '3px solid white',
              cursor: 'pointer'
            }}
            onClick={() => setShowAvatarModal(true)}
            title="Tap to choose avatar"
          >
            <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <button
            type="button"
            onClick={() => setShowAvatarModal(true)}
            style={{
              marginTop: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(200, 109, 81, 0.3)',
              background: 'rgba(200, 109, 81, 0.08)',
              color: 'var(--terracotta-accent, #c86d51)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Sparkles size={13} /> Choose Avatar
          </button>
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
          {ssoName && firstName !== ssoName && (
            <button
              type="button"
              onClick={() => setFirstName(ssoName)}
              style={{
                alignSelf: 'flex-start',
                marginTop: '-8px',
                marginBottom: '10px',
                marginLeft: '4px',
                padding: '4px 10px',
                borderRadius: '16px',
                border: '1px solid rgba(217,119,106,0.3)',
                background: 'rgba(217,119,106,0.1)',
                color: 'var(--primary-teal)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              ✨ Use Google name: <strong>{ssoName}</strong>
            </button>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', marginLeft: '12px' }}>Date of Birth *</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => handleDobChange(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <select 
            value={gender} 
            onChange={(e) => handleGenderChange(e.target.value)} 
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

      <AvatarSelector
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatarUrl={avatarUrl}
        onSelectAvatar={(newUrl) => setAvatarUrl(newUrl)}
        userGender={gender}
        userDob={dob}
      />
    </div>
  );
};

export default Onboarding;
