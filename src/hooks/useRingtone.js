import { useEffect, useRef } from 'react';

// 1. Create the AudioContext GLOBALLY so it persists across renders
const AudioContext = window.AudioContext || window.webkitAudioContext;
let sharedAudioCtx = null;
if (AudioContext) {
  sharedAudioCtx = new AudioContext();
}

// 2. The Safari Hack: Attach a global click/touch listener to un-suspend the audio engine
// This MUST happen directly on a user gesture, which unlocks it forever for async WebSocket calls later!
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().then(() => {
        console.log("Audio Engine permanently unlocked!");
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
      }).catch(e => console.error("Unlock failed", e));
    }
  };
  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);
}

export const useRingtone = (isRinging) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRinging && sharedAudioCtx) {
      
      // Just in case, try to resume again
      if (sharedAudioCtx.state !== 'running') {
        sharedAudioCtx.resume().catch(() => {});
      }

      const playEmotionalPad = () => {
        const t = sharedAudioCtx.currentTime;
        
        // A majestic, emotional Major 9th chord (warm, nostalgic, peaceful)
        const frequencies = [220.00, 329.63, 415.30, 493.88]; 
        
        const masterGain = sharedAudioCtx.createGain();
        masterGain.gain.value = 0; // Start completely silent
        
        // Ultra-safe fade in and fade out
        masterGain.gain.setTargetAtTime(0.4, t, 0.8); // Fade in
        masterGain.gain.setTargetAtTime(0, t + 4.0, 0.5); // Fade out
        
        frequencies.forEach(freq => {
            const osc = sharedAudioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            osc.connect(masterGain);
            osc.start(t);
            osc.stop(t + 6.0);
        });
        
        masterGain.connect(sharedAudioCtx.destination);
      };

      playEmotionalPad();
      // Swell breathes in and out every 6 seconds
      intervalRef.current = setInterval(playEmotionalPad, 6000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRinging]);
};
