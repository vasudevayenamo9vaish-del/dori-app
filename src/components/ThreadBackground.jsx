import React from 'react';
import './ThreadBackground.css';

const ThreadBackground = () => {
  return (
    <div className="thread-bg-container">
      <svg className="thread thread-1" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,50 Q25,30 50,50 T100,50" />
      </svg>
      <svg className="thread thread-2" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,80 Q30,90 60,70 T100,60" />
      </svg>
      <svg className="thread thread-3" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,20 Q40,10 70,30 T100,20" />
      </svg>
    </div>
  );
};

export default ThreadBackground;
