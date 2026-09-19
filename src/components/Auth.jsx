import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import ThreadIcon from './ThreadIcon';
import './Auth.css';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password',
        });
        if (error) throw error;
        setMessage('Check your email for the password reset link.');
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link.');
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container screen-container">
      <motion.div 
        className="auth-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="auth-header">
          <ThreadIcon size={40} className="auth-logo" />
          <h2>Dori</h2>
          <p>{isForgotPassword ? 'Reset Password' : 'Emotional Thread Connections'}</p>
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          
          {!isForgotPassword && (
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          )}

          {isLogin && !isForgotPassword && (
            <button 
              type="button" 
              className="forgot-password-link" 
              onClick={() => { setIsForgotPassword(true); setMessage(''); }}
            >
              Forgot password?
            </button>
          )}
          
          {message && <p className="auth-message">{message}</p>}
          
          <button type="submit" disabled={loading} className="auth-btn connect-btn">
            {loading ? 'Loading...' : (isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account'))}
          </button>
        </form>
        
        {!isForgotPassword && (
          <>
            <div className="auth-divider">
              <span>or</span>
            </div>

            <button 
              type="button" 
              disabled={loading} 
              className="auth-btn google-btn"
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </button>
          </>
        )}

        <button 
          className="toggle-auth-btn"
          onClick={() => { 
            if (isForgotPassword) {
              setIsForgotPassword(false);
            } else {
              setIsLogin(!isLogin); 
            }
            setMessage(''); 
          }}
        >
          {isForgotPassword 
            ? "Back to login" 
            : (isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in")}
        </button>
      </motion.div>
    </div>
  );
};

export default Auth;
