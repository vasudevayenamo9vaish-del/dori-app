import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Shuffle, Camera, Sparkles } from 'lucide-react';
import { AVATAR_CATALOG, getAgeGroup, calculateAgeFromDob } from '../utils/avatarCatalog';
import './AvatarSelector.css';

const AvatarSelector = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSelectAvatar,
  userGender,
  userDob,
  userAge,
  onUploadClick
}) => {
  // Determine initial gender tab from user's profile
  const getInitialGenderTab = () => {
    if (userGender === 'Female') return 'Female';
    if (userGender === 'Male') return 'Male';
    return 'Non-binary';
  };

  // Determine initial age filter from user's age or dob
  const getInitialAgeFilter = () => {
    const age = userAge || (userDob ? calculateAgeFromDob(userDob) : null);
    if (!age) return 'all';
    return getAgeGroup(age);
  };

  const [activeGender, setActiveGender] = useState(getInitialGenderTab);
  const [activeAgeFilter, setActiveAgeFilter] = useState(getInitialAgeFilter);
  const [selectedUrl, setSelectedUrl] = useState(currentAvatarUrl);

  // Sync when modal opens or user profile changes
  useEffect(() => {
    if (isOpen) {
      setActiveGender(getInitialGenderTab());
      setActiveAgeFilter(getInitialAgeFilter());
      setSelectedUrl(currentAvatarUrl);
    }
  }, [isOpen, userGender, userDob, userAge, currentAvatarUrl]);

  if (!isOpen) return null;

  // Filter avatars based on gender tab and age filter
  const filteredAvatars = AVATAR_CATALOG.filter((item) => {
    if (activeGender === 'Non-binary') {
      return item.gender === 'Non-binary';
    }
    const matchesGender = item.gender === activeGender;
    if (!matchesGender) return false;
    if (activeAgeFilter === 'all') return true;
    return item.ageGroup === activeAgeFilter;
  });

  const handleSelect = (url) => {
    setSelectedUrl(url);
    onSelectAvatar(url);
  };

  const handleShuffle = () => {
    if (filteredAvatars.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredAvatars.length);
    const chosen = filteredAvatars[randomIndex];
    handleSelect(chosen.url);
  };

  return (
    <AnimatePresence>
      <div className="avatar-modal-overlay" onClick={onClose}>
        <motion.div
          className="avatar-modal-sheet"
          onClick={(e) => e.stopPropagation()}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        >
          {/* Header */}
          <div className="avatar-modal-header">
            <div>
              <div className="avatar-modal-title">
                <Sparkles size={18} color="var(--terracotta-accent, #c86d51)" />
                <h3>Choose Your Avatar</h3>
              </div>
              <p className="avatar-modal-subtitle">
                Select an illustrated persona or upload your own photo
              </p>
            </div>
            <button className="avatar-modal-close" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Gender Tabs */}
          <div className="avatar-gender-tabs">
            <button
              type="button"
              className={`gender-tab ${activeGender === 'Male' ? 'active' : ''}`}
              onClick={() => setActiveGender('Male')}
            >
              👦 Male
            </button>
            <button
              type="button"
              className={`gender-tab ${activeGender === 'Female' ? 'active' : ''}`}
              onClick={() => setActiveGender('Female')}
            >
              👧 Female
            </button>
            <button
              type="button"
              className={`gender-tab ${activeGender === 'Non-binary' ? 'active' : ''}`}
              onClick={() => setActiveGender('Non-binary')}
            >
              ✨ Neutral
            </button>
          </div>

          {/* Age Filters (only shown for Male & Female) */}
          {activeGender !== 'Non-binary' && (
            <div className="avatar-age-filters">
              <button
                type="button"
                className={`age-pill ${activeAgeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveAgeFilter('all')}
              >
                All Ages
              </button>
              <button
                type="button"
                className={`age-pill ${activeAgeFilter === 'young' ? 'active' : ''}`}
                onClick={() => setActiveAgeFilter('young')}
              >
                18 - 28
              </button>
              <button
                type="button"
                className={`age-pill ${activeAgeFilter === 'mid' ? 'active' : ''}`}
                onClick={() => setActiveAgeFilter('mid')}
              >
                29 - 42
              </button>
              <button
                type="button"
                className={`age-pill ${activeAgeFilter === 'mature' ? 'active' : ''}`}
                onClick={() => setActiveAgeFilter('mature')}
              >
                43+
              </button>
            </div>
          )}

          {/* Avatar Grid */}
          <div className="avatar-grid-scroll">
            <div className="avatar-grid">
              {filteredAvatars.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <motion.div
                    key={item.id}
                    className={`avatar-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(item.url)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="avatar-card-img-wrapper">
                      <img src={item.url} alt={item.label} loading="lazy" />
                      {isSelected && (
                        <div className="avatar-selected-badge">
                          <Check size={14} color="#fff" />
                        </div>
                      )}
                    </div>
                    <span className="avatar-card-name">{item.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="avatar-modal-footer">
            <div className="avatar-footer-left">
              <button type="button" className="avatar-shuffle-btn" onClick={handleShuffle}>
                <Shuffle size={16} /> Shuffle
              </button>
              {onUploadClick && (
                <button type="button" className="avatar-upload-option-btn" onClick={onUploadClick}>
                  <Camera size={16} /> Upload Photo
                </button>
              )}
            </div>
            <button type="button" className="avatar-done-btn" onClick={onClose}>
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AvatarSelector;
