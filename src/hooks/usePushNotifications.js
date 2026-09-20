import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { supabase } from '../lib/supabase';

export const usePushNotifications = (user, navigate) => {
  useEffect(() => {
    // Only run this on mobile devices (Android/iOS)
    if (!Capacitor.isNativePlatform()) return;
    if (!user) return;

    const registerPush = async () => {
      // Request permission to use push notifications
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.log('User denied push notification permission');
        return;
      }

      // Register with Apple / Google to receive push via APNS/FCM
      await PushNotifications.register();
    };

    // Listeners for push notification events
    const addListeners = async () => {
      await PushNotifications.addListener('registration', async (token) => {
        console.log('Push registration success, token: ' + token.value);
        
        // Fetch the LATEST user directly to avoid stale closures!
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (currentUser) {
          const { error } = await supabase
            .from('profiles')
            .update({ device_token: token.value })
            .eq('id', currentUser.id);

          if (error) {
            console.error('Supabase token update error:', error);
          } else {
            console.log('Successfully saved device_token to Supabase:', token.value);
          }
        }
      });

      await PushNotifications.addListener('registrationError', err => {
        console.error('Registration error: ', err.error);
      });

      await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push received: ', notification);
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push action performed: ', notification);
        // Deep link to chats when tapping a notification
        if (navigate) {
          navigate('/chats');
        }
      });
    };

    registerPush();
    addListeners();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [user]);
};
