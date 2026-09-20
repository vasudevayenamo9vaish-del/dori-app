import { useEffect, useRef } from 'react';

export const useRingtone = (isRinging) => {
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRinging) {
      // Setup AudioContext
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      audioCtxRef.current = new AudioContext();

      const playTone = () => {
        if (!audioCtxRef.current) return;
        
        const t = audioCtxRef.current.currentTime;
        
        // Gentle marimba/bell sound
        const osc1 = audioCtxRef.current.createOscillator();
        const osc2 = audioCtxRef.current.createOscillator();
        const gainNode = audioCtxRef.current.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, t); // C5
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, t); // E5
        
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(0.3, t + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, t + 1.0);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);
        
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 1.2);
        osc2.stop(t + 1.2);
      };

      // Play pattern: Ring... Ring... (pause)
      playTone();
      setTimeout(() => { if(isRinging) playTone(); }, 1500);

      intervalRef.current = setInterval(() => {
        playTone();
        setTimeout(() => { if(isRinging) playTone(); }, 1500);
      }, 4000);

    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(e => {});
        audioCtxRef.current = null;
      }
    };
  }, [isRinging]);
};
