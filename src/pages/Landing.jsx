import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowRight, ShieldCheck, Lock, Globe, Heart, MapPin, Search, Play } from 'lucide-react';
import ThreadIcon from '../components/ThreadIcon';
import Auth from '../components/Auth';
import MockPhone from '../components/landing/MockPhone';
import HowItWorks from '../components/landing/HowItWorks';
import { 
  MockHero, MockLogin, MockFeeling, MockDiscover, MockConnect, MockChat1, MockChat2, MockWeather 
} from '../components/landing/MockScreens';
import './Landing.css';

const Landing = () => {
  useEffect(() => {
    document.getElementById('root').classList.add('landing-root-override');
    document.body.classList.add('landing-body-override');
    return () => {
      document.getElementById('root').classList.remove('landing-root-override');
      document.body.classList.remove('landing-body-override');
    };
  }, []);

  return (
    <div className="landing-container">
      {/* Mobile-Only Navigation */}
      <nav className="landing-nav-mobile">
        <div className="nav-logo">
          <ThreadIcon size={28} color="var(--accent-terracotta)" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>Dori</span>
          </div>
        </div>
        <button className="nav-login-btn" onClick={() => window.location.href = '/login'}>Log In</button>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            You matter.<br/>
            <span>You are understood.</span>
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Find people who truly understand what you're feeling.<br/>A safe place to connect through shared emotions.
          </motion.p>
          <motion.div 
            className="hero-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button className="hero-cta solid" onClick={() => {
              document.querySelector('.video-section').scrollIntoView({ behavior: 'smooth' });
            }}>
              <Play size={16} fill="white" /> Watch Demo
            </button>
            <a href="#how-dori-works" className="hero-cta outline" style={{ textDecoration: 'none' }}>
              See How It Works
            </a>
          </motion.div>

          {/* Restored Badges from Wireframe */}
          <motion.div 
            className="hero-badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="hero-badge">
              <Lock size={16} color="var(--accent-terracotta)" />
              <div>
                <strong>Private & Safe</strong>
                <p>Your identity stays completely private.</p>
              </div>
            </div>
            <div className="hero-badge">
              <ShieldCheck size={16} color="var(--accent-terracotta)" />
              <div>
                <strong>Verified Safety</strong>
                <p>Conversations are monitored for safety.</p>
              </div>
            </div>
            <div className="hero-badge">
              <Globe size={16} color="var(--accent-terracotta)" />
              <div>
                <strong>Global Community</strong>
                <p>Connect with kindred souls worldwide.</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="hero-visual">
          <motion.div 
            className="hero-phone-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Restored Floating Elements from Wireframe */}
            <div className="floating-avatar a1"><img src="https://i.pravatar.cc/150?img=5" alt="user" /></div>
            <div className="floating-avatar a2"><img src="https://i.pravatar.cc/150?img=11" alt="user" /></div>
            <div className="floating-avatar a3"><img src="https://i.pravatar.cc/150?img=4" alt="user" /></div>
            <div className="floating-stats-pill">
              <strong>A growing community</strong> around the world feeling a little less alone.
            </div>

            <div className="hero-phone-container">
              <MockPhone>
                <MockFeeling />
              </MockPhone>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Restored Video Section from Wireframe */}
      <section className="video-section">
        <div className="video-container">
          <div className="video-text">
            <span className="section-label">SEE DORI IN <span style={{ color: 'var(--accent-terracotta)' }}>ACTION</span></span>
            <h2>Connect. Share.<br/>Feel understood.</h2>
            <p>
              Watch how Dori helps you find meaningful emotional connections in a safe and supportive space.
            </p>
          </div>
          <div className="video-player-wrapper">
            <video 
              className="promo-video" 
              controls
              src="/promo.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Why Dori / Values Section (Restored 4-item grid from Wireframe) */}
      <section className="values-section">
        <div className="values-container">
          <div className="values-left">
            <h2>A space built on <span style={{ color: 'var(--accent-terracotta)' }}>care, empathy</span> and <span style={{ color: 'var(--accent-terracotta)' }}>respect.</span></h2>
          </div>
          <div className="values-right">
            <div className="value-item">
              <div className="value-icon"><MapPin size={24} color="var(--text-dark)" strokeWidth={1.5} /></div>
              <h4>Anonymous by design</h4>
              <p>Your identity is private. Share freely, without fear of judgment.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"><ShieldCheck size={24} color="var(--text-dark)" strokeWidth={1.5} /></div>
              <h4>Safety first</h4>
              <p>Conversations are protected with proactive safety measures.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"><Heart size={24} color="var(--text-dark)" strokeWidth={1.5} /></div>
              <h4>Human connections</h4>
              <p>Real people. Real feelings. Real support that makes a difference.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"><Globe size={24} color="var(--text-dark)" strokeWidth={1.5} /></div>
              <h4>Worldwide community</h4>
              <p>You're never alone. Kindred souls are closer than you think.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bottom-cta">
        <h2>Every feeling deserves<br/>to be heard.</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Dori connects you with people who truly get you.</p>
        <div className="bottom-buttons">
          <button className="hero-cta solid" onClick={() => {
              document.querySelector('.video-section').scrollIntoView({ behavior: 'smooth' });
          }}>
             <Play size={16} fill="white" /> Watch Demo
          </button>
          <button className="hero-cta outline" onClick={() => window.location.href = '/login'}>
            Join the Community
          </button>
        </div>
      </section>

      {/* Pre-Login Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-links">
          <a href="/privacy" className="footer-link">Privacy Policy</a>
          <a href="/guidelines" className="footer-link">Community Guidelines</a>
          <a href="/age-requirements" className="footer-link">Age Requirements</a>
          <a href="/crisis-support" className="footer-link">Crisis Resources & Support</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
