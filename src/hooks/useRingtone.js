import { useEffect, useRef } from 'react';

export const useRingtone = (isRinging) => {
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRinging) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      audioCtxRef.current = new AudioContext();

      const playEmotionalPad = () => {
        if (!audioCtxRef.current) return;
        
        const t = audioCtxRef.current.currentTime;
        
        // A majestic, emotional Major 9th chord (warm, nostalgic, peaceful)
        // Frequencies: A3, E4, G#4, B4
        const frequencies = [220.00, 329.63, 415.30, 493.88]; 
        
        const masterGain = audioCtxRef.current.createGain();
        
        // Slow, emotional breath-like swell
        masterGain.gain.setValueAtTime(0, t);
        masterGain.gain.linearRampToValueAtTime(0.3, t + 1.5); // Very slow, gentle fade in
        masterGain.gain.exponentialRampToValueAtTime(0.001, t + 5.5); // Luxurious, long fade out
        
        frequencies.forEach(freq => {
            // Pure sine waves give that crystal clear singing bowl / meditation pad sound
            const osc = audioCtxRef.current.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            
            // Add a tiny, microscopic wobble (chorus) to make it sound organic and human, not digital
            const lfo = audioCtxRef.current.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.15; 
            const lfoGain = audioCtxRef.current.createGain();
            lfoGain.gain.value = 1.5; 
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start(t);
            lfo.stop(t + 6.0);
            
            osc.connect(masterGain);
            osc.start(t);
            osc.stop(t + 6.0);
        });
        
        masterGain.connect(audioCtxRef.current.destination);
      };

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
