import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Video, Check, X, ShieldAlert, User, MoreVertical, Ban, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ThreadIcon from '../components/ThreadIcon';
import VideoCall from '../components/VideoCall';
import { Capacitor } from '@capacitor/core';
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
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const chatChannelRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const [videoCallState, setVideoCallState] = useState(null); // 'calling', 'receiving', 'connected'

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
          setMessages(prev => {
            const exists = prev?.find(m => m.id === payload.new.id);
            if (exists) return prev;
            return [...(prev || []), payload.new];
          });
          scrollToBottom();
        })
        .on('broadcast', { event: 'typing' }, (payload) => {
          if (payload?.payload?.userId !== user?.id) {
            setIsTyping(payload?.payload?.typing || false);
          }
        })
        .on('broadcast', { event: 'call_invite' }, (payload) => {
          if (payload?.payload?.userId !== user?.id) {
            setVideoCallState('receiving');
          }
        })
        .on('broadcast', { event: 'call_accepted' }, (payload) => {
          if (payload?.payload?.userId !== user?.id) {
            setVideoCallState('connected');
          }
        })
        .on('broadcast', { event: 'call_declined' }, (payload) => {
          if (payload?.payload?.userId !== user?.id) {
            setVideoCallState(null);
            alert(`${activeChat.first_name} declined the call.`);
          }
        })
        .subscribe();

      chatChannelRef.current = channel;

      return () => {
        supabase.removeChannel(channel);
        chatChannelRef.current = null;
      };
    }
  }, [activeChat]);

  const handleTyping = (e) => {
    setInputText(e.target.value);
    
    if (chatChannelRef.current) {
      chatChannelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { typing: true, userId: user.id }
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        chatChannelRef.current?.send({
          type: 'broadcast',
          event: 'typing',
          payload: { typing: false, userId: user.id }
        });
      }, 2000);
    }
  };

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

  const handleWithdraw = async (matchId) => {
    if (window.confirm("Are you sure you want to withdraw this request?")) {
      const { error } = await supabase.from('matches').update({ status: 'declined' }).eq('id', matchId);
      if (error) {
        console.error("Error withdrawing request:", error);
        alert("Error withdrawing: " + error.message);
      }
      fetchMatches();
    }
  };

  async function fetchMessages(matchId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });
    
    if (!error) {
      setMessages(data || []);
      scrollToBottom();
    }
  };

  const handleBlock = async () => {
    const blockedUserId = activeChat.id;
    if (window.confirm("Are you sure you want to block this user? You will not see their messages or profile anymore.")) {
      try {
        const { data: profileData } = await supabase.from('profiles').select('blocked_users').eq('id', user.id).single();
        const currentBlocks = profileData?.blocked_users || [];
        
        if (!currentBlocks.includes(blockedUserId)) {
          const newBlocks = [...currentBlocks, blockedUserId];
          await supabase.from('profiles').update({ blocked_users: newBlocks }).eq('id', user.id);
        }
        
        // Unmatch them to remove from chat list
        await supabase.from('matches').update({ status: 'declined' }).eq('id', activeChat.match_id);
        
        setActiveChat(null);
        setShowBlockMenu(false);
        fetchMatches();
      } catch (err) {
        console.error("Error blocking user", err);
      }
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

    // TRIGGER PUSH NOTIFICATION VIA LOCAL SERVER
    try {
      // The activeChat object represents the OTHER user's profile, so activeChat.id is their ID!
      const receiverId = activeChat.id;
      // 2. Get their device token
      const { data: receiver } = await supabase.from('profiles').select('device_token').eq('id', receiverId).single();
      
      if (receiver && receiver.device_token) {
        // Use Vercel API in production, local Node.js server in development
        const apiUrl = import.meta.env.PROD 
          ? '/api/notify'
          : (Capacitor.isNativePlatform() ? 'http://10.0.2.2:3001/notify' : 'http://localhost:3001/notify');
          
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: receiver.device_token,
            title: `New message from ${profile?.first_name || 'someone'}`,
            body: inputText.length > 50 ? inputText.substring(0, 50) + '...' : inputText
          })
        });
      }
    } catch (err) {
      console.error("Push notification error:", err);
    }
  };

  if (!activeChat) {
    return (
      <div className="screen-container match-list-screen">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="screen-title">Connections</h2>
          <button 
            onClick={async () => {
              const btn = document.getElementById('chat-refresh-btn');
              if (btn) btn.style.transform = 'rotate(180deg)';
              await fetchMatches();
              if (btn) btn.style.transform = 'rotate(0deg)';
            }} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary-teal)' }}
          >
            <RefreshCw id="chat-refresh-btn" size={20} style={{ transition: 'transform 0.3s ease' }} />
          </button>
        </div>
        
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
                <div className="action-btns">
                  <button onClick={() => handleWithdraw(req.id)} className="decline-btn" style={{ width: 'auto', padding: '0 12px', fontSize: '0.8rem', gap: '4px' }}>
                    <X size={14}/> Withdraw
                  </button>
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
                {match.avatar_url ? (
                  <img src={match.avatar_url} alt="avatar" />
                ) : (
                  <div className="avatar-placeholder"><User size={24} color="#FFF" /></div>
                )}
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

  const canVideoCall = (messages || []).length >= 5;

  return (
    <div className="chat-container">
      <style>{`.bottom-nav { display: none !important; }`}</style>
      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={() => setActiveChat(null)}><ArrowLeft size={20} /></button>
        <div className="chat-user-info">
          {activeChat.avatar_url ? (
            <img src={activeChat.avatar_url} alt={activeChat.first_name} className="chat-avatar" />
          ) : (
            <div className="avatar-placeholder" style={{ width: 40, height: 40, borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="#FFF" />
            </div>
          )}
          <div>
            <h3>{activeChat.first_name}</h3>
            <span className="status">{activeChat.current_mood}</span>
          </div>
        </div>
        <div className="chat-actions" style={{ position: 'relative', display: 'flex', gap: '10px' }}>
          {canVideoCall && (
            <button 
              className="video-btn" 
              onClick={() => {
                setVideoCallState('calling');
                chatChannelRef.current?.send({
                  type: 'broadcast',
                  event: 'call_invite',
                  payload: { userId: user.id }
                });
              }}
            >
              <Video size={20} />
            </button>
          )}
          <button className="video-btn" onClick={() => setShowBlockMenu(!showBlockMenu)}>
            <MoreVertical size={20} />
          </button>
          {showBlockMenu && (
            <div className="block-menu">
              <button onClick={handleBlock} className="block-btn">
                <Ban size={16} /> Block & Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        <div className="static-safety-warning">
          <ShieldAlert size={14} />
          <span>For your safety, we recommend keeping conversations inside Dori 🌿</span>
        </div>
        
        <div className="chat-thread-line"></div>
        {(messages || []).map((msg) => {
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
        {isTyping && (
          <motion.div 
            className="message-bubble them typing-indicator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder="Type gently..." 
            value={inputText}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>
            <Send size={18} />
          </button>
        </div>
      </div>

      {videoCallState === 'receiving' && (
        <div className="incoming-call-modal">
          <div className="incoming-call-content">
            <div className="pulsing-avatar" style={{ backgroundImage: `url(${activeChat.avatar_url})`, backgroundSize: 'cover' }}>
              {!activeChat.avatar_url && <User size={40} color="#FFF" style={{margin: 20}}/>}
            </div>
            <h3>{activeChat.first_name} is calling...</h3>
            <div className="call-actions">
              <button 
                className="control-btn end-call" 
                onClick={() => {
                  setVideoCallState(null);
                  chatChannelRef.current?.send({
                    type: 'broadcast',
                    event: 'call_declined',
                    payload: { userId: user.id }
                  });
                }}
              >
                <X size={24} />
              </button>
              <button 
                className="control-btn" 
                style={{ backgroundColor: 'var(--primary-teal)' }}
                onClick={() => {
                  setVideoCallState('connected'); // we are not initiator, we wait for offer
                  chatChannelRef.current?.send({
                    type: 'broadcast',
                    event: 'call_accepted',
                    payload: { userId: user.id }
                  });
                }}
              >
                <Video size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {(videoCallState === 'calling' || videoCallState === 'connected') && (
        <VideoCall 
          channel={chatChannelRef.current}
          isInitiator={videoCallState === 'calling'}
          onEndCall={() => setVideoCallState(null)}
          remoteUser={activeChat}
          currentUser={user}
        />
      )}

    </div>
  );
};

export default Chats;
