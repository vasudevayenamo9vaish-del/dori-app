import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useNavigate, useLocation } from 'react-router-dom';

export function useBackButton(customHandler) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let listener = null;

    const setupListener = async () => {
      listener = await App.addListener('backButton', ({ canGoBack }) => {
        // If there's a custom handler (like closing a chat modal), use it
        if (customHandler) {
          const handled = customHandler();
          if (handled) return;
        }

        // Otherwise, do default router navigation
        if (canGoBack) {
          navigate(-1);
        } else {
          // At root, close the app
          App.exitApp();
        }
      });
    };

    setupListener();

    return () => {
      if (listener) listener.remove();
    };
  }, [customHandler, navigate, location]);
}
