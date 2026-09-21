import { useEffect, useRef } from 'react';

// 1. Create the AudioContext GLOBALLY
const AudioContext = window.AudioContext || window.webkitAudioContext;
let sharedAudioCtx = null;
let ringtoneMasterGain = null;

if (AudioContext) {
  sharedAudioCtx = new AudioContext();
  ringtoneMasterGain = sharedAudioCtx.createGain();
  ringtoneMasterGain.gain.value = 0;
  ringtoneMasterGain.connect(sharedAudioCtx.destination);
}

// 2. The Safari Hack
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().then(() => {
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
      }).catch(e => console.error(e));
    }
  };
  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);
}

export const useRingtone = (isRinging) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRinging && sharedAudioCtx && ringtoneMasterGain) {
      if (sharedAudioCtx.state !== 'running') {
        sharedAudioCtx.resume().catch(() => {});
      }

      const playMeditationBowl = () => {
        const t = sharedAudioCtx.currentTime;
        
        // Instantly reset volume for the new swell
        ringtoneMasterGain.gain.cancelScheduledValues(t);
        ringtoneMasterGain.gain.setValueAtTime(0, t);
        
        // Very soft volume (0.1) to prevent clipping/distortion
        ringtoneMasterGain.gain.setTargetAtTime(0.1, t, 1.0); // Slow fade in
        ringtoneMasterGain.gain.setTargetAtTime(0, t + 3.0, 1.0); // Slow fade out
        
        // Pure 432Hz healing tone (Tibetan bowl effect)
        const osc1 = sharedAudioCtx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = 432.0; 
        
        const osc2 = sharedAudioCtx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 434.0; // Slightly detuned to create a warm, pulsing throb
        
        osc1.connect(ringtoneMasterGain);
        osc2.connect(ringtoneMasterGain);
        
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 5.0);
        osc2.stop(t + 5.0);
      };

      playMeditationBowl();
      // Breathe in and out every 5 seconds
      intervalRef.current = setInterval(playMeditationBowl, 5000);
    }

    // CLEANUP: Instantly kill the audio if the call connects or ends!
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (ringtoneMasterGain && sharedAudioCtx) {
        const t = sharedAudioCtx.currentTime;
        ringtoneMasterGain.gain.cancelScheduledValues(t);
        // Instantly fade out to 0 in 0.1 seconds (stops the background noise immediately)
        ringtoneMasterGain.gain.setTargetAtTime(0, t, 0.1); 
      }
    };
  }, [isRinging]);
};
