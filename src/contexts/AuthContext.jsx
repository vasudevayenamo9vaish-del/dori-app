import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user);
      }
      setLoading(false);
    }).catch((err) => {
      console.error("Auth session error:", err);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId, currentUser = null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      
      if (!data) {
        // Auto-create a profile with SSO data if available
        const u = currentUser || user;
        const meta = u?.user_metadata || {};
        
        let initialName = meta.given_name || meta.first_name || '';
        if (!initialName && (meta.full_name || meta.name)) {
          const parts = (meta.full_name || meta.name).trim().split(' ');
          initialName = parts[0] || '';
        }
        if (!initialName) {
          initialName = 'Dori User';
        }

        const initialAvatar = meta.avatar_url || meta.picture || 
          `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(initialName)}&backgroundColor=F8F4ED`;

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              first_name: initialName,
              age: 25,
              dob: '2000-01-01',
              country: 'Worldwide',
              gender: 'Prefer not to say',
              avatar_url: initialAvatar
            }
          ])
          .select()
          .single();
          
        if (!insertError && newProfile) {
          setProfile(newProfile);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
