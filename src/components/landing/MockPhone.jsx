import React from 'react';
import './MockStyles.css';

const MockPhone = ({ children, style }) => {
  return (
    <div className="mock-phone" style={style}>
      <div className="mock-phone-content">
        {children}
      </div>
    </div>
  );
};

export default MockPhone;
