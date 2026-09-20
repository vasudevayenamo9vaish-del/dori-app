import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import './VideoCall.css';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export default function VideoCall({ channel, isInitiator, onEndCall, remoteUser, currentUser }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionState, setConnectionState] = useState('Connecting...');

  useEffect(() => {
    let isComponentMounted = true;

    const initCall = async () => {
      try {
        // 1. Get Local Media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!isComponentMounted) return;
        
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // 2. Setup Peer Connection
        const pc = new RTCPeerConnection(configuration);
        peerConnectionRef.current = pc;

        // Add local tracks to PC
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        // Handle remote tracks
        pc.ontrack = (event) => {
          if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setConnectionState('Connected');
          }
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            channel.send({
              type: 'broadcast',
              event: 'webrtc_ice_candidate',
              payload: { candidate: event.candidate, userId: currentUser.id }
            });
          }
        };

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
            handleEndCall();
          }
        };

        // 3. Signaling Listeners
        channel.on('broadcast', { event: 'webrtc_offer' }, async (payload) => {
          if (payload.payload.userId === currentUser.id) return;
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(payload.payload.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            channel.send({
              type: 'broadcast',
              event: 'webrtc_answer',
              payload: { answer, userId: currentUser.id }
            });
          } catch (e) { console.error("Error handling offer", e); }
        });

        channel.on('broadcast', { event: 'webrtc_answer' }, async (payload) => {
          if (payload.payload.userId === currentUser.id) return;
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(payload.payload.answer));
          } catch (e) { console.error("Error handling answer", e); }
        });

        channel.on('broadcast', { event: 'webrtc_ice_candidate' }, async (payload) => {
          if (payload.payload.userId === currentUser.id) return;
          try {
            await pc.addIceCandidate(new RTCIceCandidate(payload.payload.candidate));
          } catch (e) { console.error("Error adding ice candidate", e); }
        });

        channel.on('broadcast', { event: 'call_ended' }, (payload) => {
          if (payload.payload.userId !== currentUser.id) {
            handleEndCall(false); // don't broadcast again
          }
        });

        // 4. If Initiator, create Offer
        if (isInitiator) {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            channel.send({
              type: 'broadcast',
              event: 'webrtc_offer',
              payload: { offer, userId: currentUser.id }
            });
          } catch (e) { console.error("Error creating offer", e); }
        }
      } catch (err) {
        console.error("Media error:", err);
        setConnectionState('Camera/Mic permission denied.');
        setTimeout(() => handleEndCall(), 3000);
      }
    };

    initCall();

    return () => {
      isComponentMounted = false;
      cleanup();
    };
  }, []); // Run once on mount

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const handleEndCall = (broadcast = true) => {
    cleanup();
    if (broadcast) {
      channel.send({
        type: 'broadcast',
        event: 'call_ended',
        payload: { userId: currentUser.id }
      });
    }
    onEndCall();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  return (
    <div className="video-call-overlay">
      <div className="video-container">
        <video 
          ref={remoteVideoRef} 
          autoPlay 
          playsInline 
          className="remote-video"
        />
        <video 
          ref={localVideoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`local-video ${isVideoOff ? 'hidden' : ''}`}
        />
        
        {connectionState !== 'Connected' && (
          <div className="connection-status">
            {remoteUser?.avatar_url ? (
              <img src={remoteUser.avatar_url} alt="avatar" className="pulsing-avatar" />
            ) : (
              <div className="pulsing-avatar placeholder"></div>
            )}
            <h3>{connectionState}</h3>
            <p>with {remoteUser?.first_name}</p>
          </div>
        )}

        <div className="video-controls">
          <button className={`control-btn ${isMuted ? 'danger' : ''}`} onClick={toggleMute}>
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button className={`control-btn ${isVideoOff ? 'danger' : ''}`} onClick={toggleVideo}>
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>
          <button className="control-btn end-call" onClick={() => handleEndCall(true)}>
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
