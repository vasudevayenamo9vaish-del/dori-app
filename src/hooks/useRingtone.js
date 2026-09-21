import { useEffect, useRef } from 'react';

// Create a global Audio element so it can be unblocked by Safari on the first click
let globalAudio = null;

if (typeof window !== 'undefined') {
  globalAudio = new Audio('https://upload.wikimedia.org/wikipedia/commons/1/1a/Tibetan_bowl.ogg');
  globalAudio.loop = true;
  globalAudio.volume = 0.4;
  
  // Safari unlock hack
  const unlockAudio = () => {
    if (globalAudio && globalAudio.paused) {
      globalAudio.play().then(() => {
        globalAudio.pause();
        globalAudio.currentTime = 0;
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
      }).catch(e => console.log(e));
    }
  };
  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);
}

export const useRingtone = (isRinging) => {
  useEffect(() => {
    if (isRinging && globalAudio) {
      globalAudio.currentTime = 0;
      globalAudio.play().catch(e => console.log("Autoplay blocked:", e));
    } else {
      if (globalAudio) {
        globalAudio.pause();
        globalAudio.currentTime = 0;
      }
    }

    return () => {
      if (globalAudio) {
        globalAudio.pause();
        globalAudio.currentTime = 0;
      }
    };
  }, [isRinging]);
};
