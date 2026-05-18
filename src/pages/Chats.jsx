import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowLeft } from 'lucide-react';
import './Chats.css';

const INITIAL_MESSAGES = [
  { id: 1, text: "Hi Julian, I saw you were feeling a bit adrift. I've been there.", sender: 'them', time: '10:02 AM' },
  { id: 2, text: "Thank you for reaching out. It's been hard settling in.", sender: 'me', time: '10:05 AM' },
  { id: 3, text: "Take it one gentle step at a time. The roots will grow naturally.", sender: 'them', time: '10:07 AM' }
];

const Chats = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <button className="back-btn"><ArrowLeft size={20} /></button>
        <div className="chat-user-info">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Eleanor" className="chat-avatar" />
          <div>
            <h3>Eleanor</h3>
            <span className="status">Calm and here to listen</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        <div className="chat-thread-line"></div>
        {messages.map((msg, idx) => (
          <motion.div 
            key={msg.id}
            className={`message-bubble ${msg.sender}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{msg.text}</p>
            <span className="msg-time">{msg.time}</span>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-area">
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
  );
};

export default Chats;
