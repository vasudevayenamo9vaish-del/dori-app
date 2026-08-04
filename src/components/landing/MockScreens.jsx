import React from 'react';
import ThreadIcon from '../ThreadIcon';
import { Home, Compass, MessageCircle, CloudSun, Settings, MapPin, Search } from 'lucide-react';
import './MockStyles.css';

const BottomNav = ({ active }) => (
  <div className="mock-bottom-nav">
    <Home size={20} className={active === 'home' ? 'mock-nav-icon active' : 'mock-nav-icon'} color={active === 'home' ? 'var(--accent-terracotta)' : 'var(--text-muted)'} />
    <Compass size={20} className={active === 'discover' ? 'mock-nav-icon active' : 'mock-nav-icon'} color={active === 'discover' ? 'var(--accent-terracotta)' : 'var(--text-muted)'} />
    <MessageCircle size={20} className={active === 'chat' ? 'mock-nav-icon active' : 'mock-nav-icon'} color={active === 'chat' ? 'var(--accent-terracotta)' : 'var(--text-muted)'} />
    <CloudSun size={20} className={active === 'weather' ? 'mock-nav-icon active' : 'mock-nav-icon'} color={active === 'weather' ? 'var(--accent-terracotta)' : 'var(--text-muted)'} />
  </div>
);

export const MockHero = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
    <ThreadIcon size={56} color="var(--accent-terracotta)" />
    <h2 style={{ color: 'var(--primary-teal)', marginTop: '12px', marginBottom: '4px', fontSize: '1.8rem' }}>Dori</h2>
    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '40px' }}>Emotional Thread Connections</p>
    
    <div style={{ width: '100%' }}>
      <div className="mock-btn-primary solid" style={{ padding: '14px', marginBottom: '16px' }}>I'm feeling something</div>
      <div className="mock-btn-primary" style={{ border: '1px solid var(--accent-terracotta)', color: 'var(--accent-terracotta)', background: 'transparent', padding: '14px' }}>Find someone who understands</div>
    </div>
    
    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '40px' }}>A safe space to be you</p>
  </div>
);

export const MockLogin = () => (
  <>
    <div className="mock-header" style={{ marginTop: '40px' }}>
      <ThreadIcon size={48} color="var(--accent-terracotta)" />
      <h2 style={{ color: 'var(--primary-teal)', marginTop: '8px', marginBottom: '4px' }}>Dori</h2>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Emotional Thread Connections</p>
    </div>
    
    <div style={{ marginTop: '20px' }}>
      <div className="mock-input">Your email</div>
      <div className="mock-input">Your password</div>
      
      <div className="mock-btn-primary" style={{ marginTop: '20px', background: 'var(--bg-cream)' }}>Sign In</div>
      
      <div className="mock-divider">or</div>
      
      <div className="mock-btn-primary" style={{ background: 'white' }}>
        <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </div>
    </div>
    
    <div className="mock-text-link" style={{ marginTop: 'auto', marginBottom: '20px' }}>
      Don't have an account? <span style={{ color: 'var(--primary-teal)' }}>Sign up</span>
    </div>
  </>
);

export const MockFeeling = () => (
  <>
    <div className="mock-header-row">
      <div style={{ width: 24 }}></div>
      <Settings size={20} color="var(--text-muted)" />
    </div>
    <div className="mock-title">How are you feeling<br/>right now?</div>
    
    <div className="mock-pill-grid">
      <div className="mock-pill">Lonely</div>
      <div className="mock-pill active">Missing parental warmth</div>
      <div className="mock-pill">Feeling neglected</div>
      <div className="mock-pill">Overwhelmed</div>
      <div className="mock-pill" style={{ width: '100%', textAlign: 'center' }}>Feeling lost</div>
      <div className="mock-pill">Need someone to listen</div>
      <div className="mock-pill">Calm & here to support</div>
      <div className="mock-pill">Anxious</div>
      <div className="mock-pill">Missing home</div>
      <div className="mock-pill">Angry at life</div>
    </div>
    <BottomNav active="home" />
  </>
);

export const MockDiscover = () => (
  <>
    <div className="mock-header-row">
      <h3 style={{ color: 'var(--primary-teal)', fontWeight: 600 }}>Discover</h3>
      <Search size={20} color="var(--text-muted)" />
    </div>
    
    <div className="mock-card">
      <div className="mock-card-title">User 01, 25</div>
      <div className="mock-card-subtitle">MALE • INDIA</div>
      <div className="mock-connect-btn">Connect Gently</div>
    </div>
    
    <div className="mock-card" style={{ background: 'transparent', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '10px' }}>Calm & here to support</div>
      <div className="mock-illustration">
        <svg viewBox="0 0 100 100" width="80" height="80">
          <circle cx="50" cy="40" r="15" fill="none" stroke="var(--primary-teal)" strokeWidth="2" />
          <path d="M25 90 C 25 60, 75 60, 75 90" fill="none" stroke="var(--primary-teal)" strokeWidth="2" />
        </svg>
      </div>
    </div>
    
    <div className="mock-card">
      <div className="mock-card-title">User 02, 22</div>
      <div className="mock-card-subtitle">MALE • INDIA</div>
      <div className="mock-connect-btn">Connect Gently</div>
    </div>
    
    <BottomNav active="discover" />
  </>
);

export const MockConnect = () => (
  <>
    <div className="mock-header-row" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px', marginBottom: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--text-muted)' }}>&lt;</span>
        <div style={{ width: 30, height: 30, background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src="https://i.pravatar.cc/100?img=1" alt="avatar" style={{ width: '100%', height: '100%' }}/>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>User 01</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--accent-terracotta)' }}>Missing parental warmth</div>
        </div>
      </div>
    </div>
    
    <div className="mock-warning-banner">
      <MapPin size={12} style={{ flexShrink: 0, marginTop: 2 }} color="var(--primary-teal)" />
      <div>For your safety, we recommend keeping conversations inside Dori 🌿</div>
    </div>
    
    <div style={{ flex: 1 }}></div>
    
    <div className="mock-connect-btn solid" style={{ marginBottom: '60px', padding: '14px' }}>Connect Gently</div>
    <BottomNav active="chat" />
  </>
);

export const MockChat1 = () => (
  <>
    <div className="mock-header-row" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px', marginBottom: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--text-muted)' }}>&lt;</span>
        <div style={{ width: 30, height: 30, background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src="https://i.pravatar.cc/100?img=1" alt="avatar" style={{ width: '100%', height: '100%' }}/>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>User 01</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--accent-terracotta)' }}>Missing parental warmth</div>
        </div>
      </div>
    </div>
    
    <div className="mock-warning-banner">
      <MapPin size={12} style={{ flexShrink: 0, marginTop: 2 }} color="var(--primary-teal)" />
      <div>For your safety, we recommend keeping conversations inside Dori 🌿</div>
    </div>
    
    <div style={{ flex: 1, marginTop: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '70px' }}>
      <div className="mock-chat-row left">
        <div className="mock-bubble left">Hey, I saw you were also feeling a bit anxious today.</div>
      </div>
      
      <div className="mock-chat-row right">
        <div className="mock-bubble right">Yeah, it's been a tough week.</div>
      </div>
      
      <div className="mock-chat-row left">
        <div className="mock-bubble left">I completely understand.</div>
      </div>
      
      <div className="mock-chat-row right">
        <div className="mock-bubble right">Thank you so much.</div>
      </div>
    </div>
    
    <div className="mock-chat-input">
      <input type="text" placeholder="Type gently..." readOnly />
      <div className="mock-chat-send">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </div>
    </div>
    
    <BottomNav active="chat" />
  </>
);

export const MockChat2 = () => (
  <>
    <div className="mock-header-row" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px', marginBottom: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--text-muted)' }}>&lt;</span>
        <div style={{ width: 30, height: 30, background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src="https://i.pravatar.cc/100?img=1" alt="avatar" style={{ width: '100%', height: '100%' }}/>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>User 01</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--accent-terracotta)' }}>Missing parental warmth</div>
        </div>
      </div>
    </div>
    
    <div className="mock-warning-banner">
      <MapPin size={12} style={{ flexShrink: 0, marginTop: 2 }} color="var(--primary-teal)" />
      <div>For your safety, we recommend keeping conversations inside Dori 🌿</div>
    </div>
    
    <div style={{ flex: 1, marginTop: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '120px' }}>
      <div className="mock-chat-row left">
        <div className="mock-bubble left">If you ever want to talk, I'm here.</div>
      </div>
      
      <div className="mock-chat-row right">
        <div className="mock-bubble right">That means a lot.</div>
      </div>
      
      <div className="mock-chat-row left">
        <div className="mock-bubble left">We're in this together.</div>
      </div>
    </div>
    
    <div className="mock-chat-input">
      <input type="text" placeholder="Type gently..." readOnly />
      <div className="mock-chat-send">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </div>
    </div>
    
    <BottomNav active="chat" />
  </>
);

export const MockWeather = () => (
  <>
    <div className="mock-title" style={{ marginTop: '20px' }}>Emotional Weather</div>
    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-15px', marginBottom: '20px' }}>You are not alone in how you feel</p>
    
    <div className="mock-map-tabs">
      <div className="mock-map-tab active">Worldwide</div>
      <div className="mock-map-tab">India</div>
      <div className="mock-map-tab">USA</div>
      <div className="mock-map-tab">Europe</div>
    </div>
    
    <div className="mock-map-graphic"></div>
    
    <div className="mock-checkin-btn">Add your anonymous check-in</div>
    
    <BottomNav active="weather" />
  </>
);
