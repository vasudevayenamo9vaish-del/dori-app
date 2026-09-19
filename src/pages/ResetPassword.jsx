import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import ThreadIcon from '../components/ThreadIcon';
import '../components/Auth.css'; // Reuse auth styles

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the recovery event to know if we successfully mounted with the token
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        console.log("Password recovery event received");
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      setMessage('Password updated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container screen-container">
      <div className="auth-box">
        <div className="auth-header">
          <ThreadIcon size={40} className="auth-logo" />
          <h2>Dori</h2>
          <p>Update your password</p>
        </div>

        <form onSubmit={handleResetPassword} className="auth-form">
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="auth-input"
            minLength={6}
          />
          
          {message && <p className="auth-message">{message}</p>}
          
          <button type="submit" disabled={loading} className="auth-btn connect-btn">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
