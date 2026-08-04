import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, User } from 'lucide-react';
import './Profile.css';

const COUNTRIES = [
  "Worldwide", "India", "USA", "Europe", "UK", "Australia", "Southeast Asia"
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, fetchProfile, signOut } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [dob, setDob] = useState(profile?.dob || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [gender, setGender] = useState(profile?.gender || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [message, setMessage] = useState('');

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

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const age = calculateAge(dob);
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          dob: dob,
          age: age,
          country: country,
          gender: gender,
          bio: bio,
        })
        .eq('id', user.id);

      if (error) throw error;
      
      await fetchProfile(user.id);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="screen-container profile-screen">
      <div className="profile-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} color="var(--primary-teal)" />
        </button>
        <h2>My Profile</h2>
        <div style={{ width: 24 }}></div> {/* Spacer for flex balance */}
      </div>

      <motion.div 
        className="profile-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="avatar-section">
          <div className="profile-avatar">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" />
            ) : (
              <User size={40} color="var(--primary-teal)" />
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="profile-input"
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="profile-input"
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select 
              value={gender} 
              onChange={(e) => setGender(e.target.value)} 
              required 
              className="profile-input"
            >
              <option value="" disabled>Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label>Region</label>
            <select 
              value={country} 
              onChange={(e) => setCountry(e.target.value)} 
              required 
              className="profile-input"
            >
              <option value="" disabled>Select Region</option>
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              placeholder="Tell others a bit about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="profile-input"
              style={{ resize: 'none', height: '80px' }}
            />
          </div>

          {message && (
            <div className={`status-message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="save-btn">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
