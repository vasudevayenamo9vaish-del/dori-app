import React from 'react';
import './HowItWorks.css';
import ThreadIcon from '../ThreadIcon';

const HowItWorks = () => {
  return (
    <section id="how-dori-works" className="hdw-section">
      <div className="hdw-header">
        <span className="hdw-sub">A SAFE SPACE TO FEEL HEARD</span>
        <h2 className="hdw-title">How <span>Dori</span> Works</h2>
        <p className="hdw-desc">From how you feel to finding someone who <span>truly understands</span>.</p>
      </div>

      <div className="hdw-scroll-container">
        <div className="hdw-track">
          
          {/* Step 1 */}
          <div className="hdw-column">
            <div className="hdw-text">
              <span className="hdw-step-num">1</span>
              <h4>Share how you're feeling</h4>
              <p>Choose what you're experiencing today.</p>
            </div>
            <div className="hdw-phone">
               <div className="mock-feeling">
                 <div className="mock-top-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 </div>
                 <h3 className="mock-h3">How are you feeling<br/>right now?</h3>
                 <div className="mock-pills">
                    <div className="mock-pill">Lonely</div>
                    <div className="mock-pill active">Missing parental warmth</div>
                    <div className="mock-pill">Feeling neglected</div>
                    <div className="mock-pill">Overwhelmed</div>
                    <div className="mock-pill">Feeling lost</div>
                    <div className="mock-pill">Need someone to listen</div>
                    <div className="mock-pill">Calm & here to support</div>
                    <div className="mock-pill">Anxious</div>
                    <div className="mock-pill">Missing home</div>
                    <div className="mock-pill">Angry at life</div>
                 </div>
                 <div className="mock-tabbar">
                   <div className="mock-tab active">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                     <span>Home</span>
                   </div>
                   <div className="mock-tab">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                     <span>Discover</span>
                   </div>
                   <div className="mock-tab">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                     <span>Chat</span>
                   </div>
                   <div className="mock-tab">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 16.2A8.1 8.1 0 0 0 17.5 8c-2-2-5-2-7 0a8.1 8.1 0 0 0-2.5 8.2"></path><path d="M22 22H2"></path></svg>
                     <span>Weather</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="hdw-arrow">→</div>

          {/* Step 2 */}
          <div className="hdw-column">
            <div className="hdw-text">
              <span className="hdw-step-num">2</span>
              <h4>Discover people who understand</h4>
              <p>We match you with people feeling a similar way.</p>
            </div>
            <div className="hdw-phone">
              <div className="mock-discover">
                <div className="mock-user-card">
                   <div className="mock-user-header">
                     <div className="mock-uinfo">
                       <strong>User 01, 25</strong>
                       <span>MALE • INDIA</span>
                     </div>
                   </div>
                   <div className="mock-btn outline-coral">Connect Gently</div>
                   <div className="mock-user-tag">Calm & here to support</div>
                   <div className="mock-user-avatar">
                     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1"><circle cx="12" cy="8" r="5"></circle><path d="M3 21v-2a7 7 0 0 1 14 0v2"></path></svg>
                   </div>
                </div>
                <div className="mock-user-card small">
                   <div className="mock-user-header">
                     <div className="mock-uinfo">
                       <strong>User 02, 22</strong>
                       <span>MALE • INDIA</span>
                     </div>
                   </div>
                   <div className="mock-btn outline-coral">Connect Gently</div>
                </div>
                <div className="mock-tabbar">
                   <div className="mock-tab">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                     <span>Home</span>
                   </div>
                   <div className="mock-tab active">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                     <span>Discover</span>
                   </div>
                   <div className="mock-tab">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                     <span>Chat</span>
                   </div>
                   <div className="mock-tab">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 16.2A8.1 8.1 0 0 0 17.5 8c-2-2-5-2-7 0a8.1 8.1 0 0 0-2.5 8.2"></path><path d="M22 22H2"></path></svg>
                     <span>Weather</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="hdw-arrow">→</div>

          {/* Step 3 */}
          <div className="hdw-column">
            <div className="hdw-text">
              <span className="hdw-step-num">3</span>
              <h4>Connect gently</h4>
              <p>Send or accept connection requests with ease.</p>
            </div>
            <div className="hdw-phone">
              <div className="mock-connect">
                 <div className="mock-topbar">
                    <span className="mock-back">‹</span>
                    <div className="mock-top-user">
                      <div className="mock-avatar-small"></div>
                      <div className="mock-top-info">
                         <strong>User 01</strong>
                         <span className="mock-status">Missing parental warmth</span>
                      </div>
                    </div>
                 </div>
                 <div className="mock-safety-banner">
                    <div className="msb-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D9776A" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    For your safety, we recommend keeping conversations inside Dori <span style={{ color: 'var(--accent-terracotta)', fontWeight: 'bold' }}>✓</span>
                 </div>
                 <div className="mock-spacer"></div>
                 <div className="mock-btn coral mock-bottom-btn">Connect Gently</div>
              </div>
            </div>
          </div>

          <div className="hdw-arrow">→</div>

          {/* Step 4 */}
          <div className="hdw-column">
            <div className="hdw-text">
              <span className="hdw-step-num">4</span>
              <h4>Have meaningful conversations</h4>
              <p>Chat in a safe, private and supportive space.</p>
            </div>
            <div className="hdw-phone">
              <div className="mock-chat">
                 <div className="mock-topbar">
                    <span className="mock-back">‹</span>
                    <div className="mock-top-user">
                      <div className="mock-avatar-small"></div>
                      <div className="mock-top-info">
                         <strong>User 01</strong>
                         <span className="mock-status">Missing parental warmth</span>
                      </div>
                    </div>
                 </div>
                 <div className="mock-safety-banner">
                    <div className="msb-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D9776A" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    For your safety, we recommend keeping conversations inside Dori <span style={{ color: 'var(--accent-terracotta)', fontWeight: 'bold' }}>✓</span>
                 </div>
                 <div className="mock-messages">
                    <div className="mock-msg incoming">You know you were also feeling a bit anxious today.</div>
                    <div className="mock-msg outgoing">Yeah, it's been a tough week.</div>
                    <div className="mock-msg incoming">I completely understand.</div>
                    <div className="mock-msg outgoing">Thank you so much.</div>
                 </div>
                 <div className="mock-input-area">
                    <div className="mock-chat-input">Type gently...</div>
                    <div className="mock-send-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="hdw-arrow">→</div>

          {/* Step 5 */}
          <div className="hdw-column">
            <div className="hdw-text">
              <span className="hdw-step-num">5</span>
              <h4>See the bigger emotional picture</h4>
              <p>Explore real-time emotions around the world.</p>
            </div>
            <div className="hdw-phone">
              <div className="mock-weather">
                <h3 className="mock-h3">Emotional Weather</h3>
                <p className="mock-weather-sub">See how everyone is feeling, you feel</p>
                <div className="mock-weather-tabs">
                  <div className="mock-wtab active">Worldwide</div>
                  <div className="mock-wtab">India</div>
                  <div className="mock-wtab">USA</div>
                  <div className="mock-wtab">Europe</div>
                </div>
                <div className="mock-map">
                   <img src="/world-bg.png" alt="Map" className="mock-map-img" onError={(e) => e.target.style.display='none'} />
                   <div className="mock-map-dot" style={{ top: '30%', left: '20%' }}></div>
                   <div className="mock-map-dot" style={{ top: '45%', left: '70%' }}></div>
                   <div className="mock-map-dot" style={{ top: '60%', left: '50%' }}></div>
                   <div className="mock-map-dot" style={{ top: '25%', left: '55%' }}></div>
                   <div className="mock-map-dot" style={{ top: '70%', left: '80%' }}></div>
                </div>
                <div className="mock-btn outline-thin">Add your anonymous check-in</div>
                <div className="mock-tabbar">
                   <div className="mock-tab">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                     <span>Home</span>
                   </div>
                   <div className="mock-tab">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                     <span>Discover</span>
                   </div>
                   <div className="mock-tab">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                     <span>Chat</span>
                   </div>
                   <div className="mock-tab active">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 16.2A8.1 8.1 0 0 0 17.5 8c-2-2-5-2-7 0a8.1 8.1 0 0 0-2.5 8.2"></path><path d="M22 22H2"></path></svg>
                     <span>Weather</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
