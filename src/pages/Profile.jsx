import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, User, Camera } from 'lucide-react';
import { COUNTRIES } from '../utils/countries';
import './Profile.css';


const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, fetchProfile, signOut } = useAuth();
  
  // Extract SSO metadata (Google name & picture)
  const ssoMeta = user?.user_metadata || {};
  const ssoName = ssoMeta.given_name || ssoMeta.first_name || (ssoMeta.full_name || ssoMeta.name ? (ssoMeta.full_name || ssoMeta.name).trim().split(' ')[0] : '');
  const ssoAvatar = ssoMeta.avatar_url || ssoMeta.picture || '';

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(() => {
    if (profile?.first_name && profile.first_name !== 'Dori User') return profile.first_name;
    return ssoName || profile?.first_name || '';
  });
  const [dob, setDob] = useState(profile?.dob || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [gender, setGender] = useState(profile?.gender || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(() => {
    if (profile?.avatar_url && !profile.avatar_url.includes('seed=DoriUser')) return profile.avatar_url;
    return ssoAvatar || profile?.avatar_url || '';
  });
  const [message, setMessage] = useState('');
  const [blockedUsers, setBlockedUsers] = useState([]);

  // Synchronize form fields when profile or SSO user loads
  React.useEffect(() => {
    if (profile) {
      if (profile.first_name && profile.first_name !== 'Dori User') {
        setFirstName(profile.first_name);
      } else if (ssoName) {
        setFirstName(ssoName);
      }
      if (profile.dob) setDob(profile.dob);
      if (profile.country) setCountry(profile.country);
      if (profile.gender) setGender(profile.gender);
      if (profile.bio) setBio(profile.bio);
      if (profile.avatar_url && !profile.avatar_url.includes('seed=DoriUser')) {
        setAvatarUrl(profile.avatar_url);
      } else if (ssoAvatar) {
        setAvatarUrl(ssoAvatar);
      }
    } else if (ssoName) {
      setFirstName(ssoName);
      if (ssoAvatar) setAvatarUrl(ssoAvatar);
    }
  }, [profile, user]);

  React.useEffect(() => {
    async function fetchBlockedUsers() {
      if (profile?.blocked_users && profile.blocked_users.length > 0) {
        const { data } = await supabase
          .from('profiles')
          .select('id, first_name')
          .in('id', profile.blocked_users);
        if (data) setBlockedUsers(data);
      } else {
        setBlockedUsers([]);
      }
    }
    fetchBlockedUsers();
  }, [profile?.blocked_users]);

  const handleUnblock = async (blockedId) => {
    if (!profile?.blocked_users) return;
    const newBlocks = profile.blocked_users.filter(id => id !== blockedId);
    
    await supabase.from('profiles').update({ blocked_users: newBlocks }).eq('id', user.id);
    
    // Update local state so it disappears instantly
    setBlockedUsers(prev => prev.filter(u => u.id !== blockedId));
    // Fetch profile globally so the context knows about the update
    fetchProfile();
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(async (blob) => {
          if (!blob) {
            setLoading(false);
            return;
          }
          
          const fileName = `${user.id}-${Date.now()}.jpeg`;

          try {
            const { error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(fileName, blob, {
                contentType: 'image/jpeg',
                upsert: true
              });

            if (uploadError) {
              console.error('Upload error:', uploadError);
              alert('Failed to upload image. Please ensure the Supabase SQL setup script was run.');
              setLoading(false);
              return;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
            setAvatarUrl(data.publicUrl);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        }, 'image/jpeg', 0.8);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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
          avatar_url: avatarUrl,
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

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently erased.")) {
      setLoading(true);
      try {
        // We will instruct the user to create this RPC function in their Supabase dashboard
        const { error } = await supabase.rpc('delete_user');
        if (error) throw error;
        await signOut();
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again or contact support.');
      } finally {
        setLoading(false);
      }
    }
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
          <div className="profile-avatar" style={{ position: 'relative' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" />
            ) : (
              <User size={40} color="var(--primary-teal)" />
            )}
            <label className="avatar-upload-btn" style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: 'var(--primary-teal)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
              <Camera size={16} color="white" />
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
          {ssoAvatar && avatarUrl !== ssoAvatar && (
            <button
              type="button"
              onClick={() => setAvatarUrl(ssoAvatar)}
              style={{
                marginTop: '10px',
                padding: '4px 12px',
                borderRadius: '16px',
                border: '1px solid rgba(217,119,106,0.25)',
                background: 'rgba(255,255,255,0.85)',
                color: 'var(--primary-teal, #2d4f48)',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Use Google Photo
            </button>
          )}
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
            {ssoName && firstName !== ssoName && (
              <button
                type="button"
                onClick={() => setFirstName(ssoName)}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid rgba(217,119,106,0.3)',
                  background: 'rgba(217,119,106,0.08)',
                  color: 'var(--primary-teal, #2d4f48)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: 'fit-content'
                }}
              >
                ✨ Tap to use Google name: <strong>{ssoName}</strong>
              </button>
            )}
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
            <label>Country / Region</label>
            <select 
              value={country} 
              onChange={(e) => setCountry(e.target.value)} 
              required 
              className="profile-input"
            >
              <option value="" disabled>Select your country</option>
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

          <div className="profile-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" className="signout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          <div className="legal-links" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', fontSize: '0.8rem' }}>
            <a href="https://dori.app/privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
            <a href="https://dori.app/terms" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
          </div>
        </form>

        {blockedUsers.length > 0 && (
          <div className="blocked-users-section">
            <h3>Blocked Users</h3>
            <div className="blocked-users-list">
              {blockedUsers.map(u => (
                <div key={u.id} className="blocked-user-item">
                  <span>{u.first_name}</span>
                  <button onClick={() => handleUnblock(u.id)} className="unblock-btn">Unblock</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="logout-btn" onClick={handleLogout} style={{ marginBottom: '15px' }}>
          <LogOut size={18} />
          Sign Out
        </button>

        <button 
          className="delete-account-btn" 
          onClick={handleDeleteAccount}
          style={{
            background: 'transparent',
            border: '1px solid #FF4D4D',
            color: '#FF4D4D',
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px',
            marginBottom: '40px'
          }}
        >
          Delete Account
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
