import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Cloud } from 'lucide-react';
import ThreadIcon from './ThreadIcon';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './BottomNav.css';

const BottomNav = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    const fetchUnread = async () => {
      // Pending incoming requests
      const { data, error } = await supabase
        .from('matches')
        .select('id')
        .eq('receiver_id', user.id)
        .eq('status', 'pending');
        
      if (!error && data) {
        setUnreadCount(data.length);
      }
    };
    
    fetchUnread();
    
    // Listen for new matches
    const channel = supabase
      .channel('matches_badge')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'matches',
        filter: `receiver_id=eq.${user.id}`
      }, () => {
        fetchUnread();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    }
  }, [user]);

  const navItems = [
    { path: '/', icon: Home, label: 'Home', isWarm: true },
    { path: '/discover', icon: Compass, label: 'Discover' },
    { path: '/weather', icon: Cloud, label: 'Weather' },
    { path: '/chats', icon: ThreadIcon, label: 'Chats', customIcon: true, badge: unreadCount > 0 }
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
            <div className="icon-container" style={{ position: 'relative' }}>
              {item.customIcon ? (
                <Icon size={24} />
              ) : (
                <Icon size={24} strokeWidth={1.5} />
              )}
              {item.badge && (
                <div style={{ position: 'absolute', top: -2, right: -4, width: 10, height: 10, borderRadius: '50%', background: '#ff4444', border: '2px solid var(--bg-cream)' }}></div>
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
