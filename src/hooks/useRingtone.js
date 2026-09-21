import { useEffect, useRef } from 'react';

export const useRingtone = (isRinging) => {
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRinging) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      audioCtxRef.current = new AudioContext();
      
      // Attempt to force-wake the audio context (crucial for iOS Safari)
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(e => console.log('Autoplay blocked by browser', e));
      }

      const playEmotionalPad = () => {
        if (!audioCtxRef.current) return;
        
        const t = audioCtxRef.current.currentTime;
        
        // A majestic, emotional Major 9th chord (warm, nostalgic, peaceful)
        const frequencies = [220.00, 329.63, 415.30, 493.88]; 
        
        const masterGain = audioCtxRef.current.createGain();
        masterGain.gain.value = 0; // Start completely silent
        
        // Ultra-safe fade in and fade out (setTargetAtTime never throws "time in past" errors)
        masterGain.gain.setTargetAtTime(0.4, t, 0.8); // Fade in
        masterGain.gain.setTargetAtTime(0, t + 4.0, 0.5); // Fade out
        
        frequencies.forEach(freq => {
            const osc = audioCtxRef.current.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            osc.connect(masterGain);
            osc.start(t);
            osc.stop(t + 6.0);
        });
        
        masterGain.connect(audioCtxRef.current.destination);
      };

      // Force resume immediately
      if (audioCtxRef.current.state !== 'running') {
        audioCtxRef.current.resume().catch(() => {});
      }

      playEmotionalPad();
      // Swell breathes in and out every 6 seconds
      intervalRef.current = setInterval(playEmotionalPad, 6000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(e => {});
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
