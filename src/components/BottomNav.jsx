import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Cloud } from 'lucide-react';
import ThreadIcon from './ThreadIcon';
import './BottomNav.css';

const BottomNav = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home', isWarm: true },
    { path: '/discover', icon: Compass, label: 'Discover' },
    { path: '/weather', icon: Cloud, label: 'Weather' },
    { path: '/chats', icon: ThreadIcon, label: 'Chats', customIcon: true }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${item.isWarm ? 'warm-home' : ''}`}
          >
            <div className="icon-container">
              {item.customIcon ? (
                <Icon size={24} />
              ) : (
                <Icon size={24} strokeWidth={1.5} />
              )}
              <div className="active-dot"></div>
            </div>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;
