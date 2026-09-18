import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Video, Check, X, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ThreadIcon from '../components/ThreadIcon';
import './Chats.css';

const Chats = () => {
  const { user, profile } = useAuth();
  const [matches, setMatches] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [safetyWarning, setSafetyWarning] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.match_id);
      
      const channel = supabase
        .channel(`chat_${activeChat.match_id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `match_id=eq.${activeChat.match_id}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
          scrollToBottom();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeChat]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function fetchMatches() {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id, status, requester_id, receiver_id,
          requester:requester_id (id, first_name, avatar_url, current_mood),
          receiver:receiver_id (id, first_name, avatar_url, current_mood)
        `)
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) throw error;

      const pending = data.filter(m => m.status === 'pending' && m.receiver_id === user.id);
      const sent = data.filter(m => m.status === 'pending' && m.requester_id === user.id);
      const accepted = data.filter(m => m.status === 'accepted').map(m => {
        const otherUser = m.requester_id === user.id ? m.receiver : m.requester;
        return { match_id: m.id, ...otherUser };
      });

      setPendingRequests(pending);
      setSentRequests(sent);
      setMatches(accepted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (matchId) => {
    await supabase.from('matches').update({ status: 'accepted' }).eq('id', matchId);
    fetchMatches();
  };

  const handleDecline = async (matchId) => {
    await supabase.from('matches').update({ status: 'declined' }).eq('id', matchId);
    fetchMatches();
  };

  async function fetchMessages(matchId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });
    
    if (!error) {
      setMessages(data);
      scrollToBottom();
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const newMsg = {
      match_id: activeChat.match_id,
      sender_id: user.id,
      text: inputText
    };

    setInputText('');
    
    const { data, error } = await supabase.from('messages').insert([newMsg]).select();
    
    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    setMessages(prev => {
      // Prevent duplicate if Realtime event already added it
      if (prev.find(m => m.id === data[0].id)) return prev;
      return [...prev, data[0]];
    });
    
    // Small delay to ensure DOM is updated before scrolling
    setTimeout(scrollToBottom, 100);
  };

  if (!activeChat) {
    return (
      <div className="screen-container match-list-screen">
        <h2 className="screen-title">Connections</h2>
        
        {pendingRequests.length > 0 && (
          <div className="pending-section">
            <h3>Pending Requests</h3>
            {pendingRequests.map(req => (
              <div key={req.id} className="match-item pending">
                <img src={req.requester.avatar_url} alt="avatar" />
                <div className="match-info">
                  <h4>{req.requester.first_name}</h4>
                  <span>wants to connect</span>
                </div>
                <div className="action-btns">
                  <button onClick={() => handleAccept(req.id)} className="accept-btn"><Check size={16}/></button>
                  <button onClick={() => handleDecline(req.id)} className="decline-btn"><X size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {sentRequests.length > 0 && (
          <div className="pending-section" style={{ marginTop: '20px' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Sent Requests</h3>
            {sentRequests.map(req => (
              <div key={req.id} className="match-item pending" style={{ opacity: 0.8 }}>
                <img src={req.receiver.avatar_url} alt="avatar" />
                <div className="match-info">
                  <h4>{req.receiver.first_name}</h4>
                  <span>Request pending...</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {matches.length === 0 && pendingRequests.length === 0 && sentRequests.length === 0 && (
          <div className="empty-state">
            <ThreadIcon size={48} color="var(--accent-terracotta)" />
            <p>No threads yet. Head to Discover to meet someone new.</p>
          </div>
        )}

        {matches.length > 0 && (
          <div className="matches-list">
            <h3>Your Threads</h3>
            {matches.map(match => (
              <div key={match.match_id} className="match-item" onClick={() => setActiveChat(match)}>
                <img src={match.avatar_url} alt="avatar" />
                <div className="match-info">
                  <h4>{match.first_name}</h4>
                  <span>{match.current_mood || 'Connected'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const canVideoCall = messages.length >= 5;

  return (
    <div className="chat-container">
      <style>{`.bottom-nav { display: none !important; }`}</style>
      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={() => setActiveChat(null)}><ArrowLeft size={20} /></button>
        <div className="chat-user-info">
          <img src={activeChat.avatar_url} alt={activeChat.first_name} className="chat-avatar" />
          <div>
            <h3>{activeChat.first_name}</h3>
            <span className="status">{activeChat.current_mood}</span>
          </div>
        </div>
        {canVideoCall && (
          <button className="video-btn"><Video size={20} /></button>
        )}
      </div>

      {/* Messages */}
      <div className="messages-area">
        <div className="static-safety-warning">
          <ShieldAlert size={14} />
          <span>For your safety, we recommend keeping conversations inside Dori 🌿</span>
        </div>
        
        <div className="chat-thread-line"></div>
        {messages.map((msg) => {
          const isMe = msg.sender_id === user.id;
          return (
            <motion.div 
              key={msg.id}
              className={`message-bubble ${isMe ? 'me' : 'them'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p>{msg.text}</p>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder="Type gently..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chats;
