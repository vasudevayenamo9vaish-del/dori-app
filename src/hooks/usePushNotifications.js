import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { supabase } from '../lib/supabase';

export const usePushNotifications = (user) => {
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
        // Save the device token to Supabase so we can send notifications to this user!
        await supabase.from('profiles').update({ 
          device_token: token.value 
        }).eq('id', user.id);
      });

      await PushNotifications.addListener('registrationError', err => {
        console.error('Registration error: ', err.error);
      });

      await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push received: ', notification);
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push action performed: ', notification);
      });
    };

    registerPush();
    addListeners();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [user]);
};
