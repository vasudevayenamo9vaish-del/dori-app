import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const useLocalNotifications = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setupDailyReminders = async () => {
      // Request permission
      let permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display === 'prompt') {
        permStatus = await LocalNotifications.requestPermissions();
      }

      if (permStatus.display !== 'granted') return;

      // Clear any old scheduled notifications
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

      // Schedule a new daily notification for 10:00 AM every day
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Dori Check-in",
            body: "Care to share kindness to someone who needs it today?",
            id: 1,
            schedule: { 
              at: new Date(Date.now() + 1000 * 10), // 10 seconds from now
              allowWhileIdle: true
            },
            smallIcon: "ic_stat_icon_config_sample", // Uses default icon
          }
        ]
      });
      console.log('Daily local notifications scheduled!');
    };

    setupDailyReminders();
  }, []);
};
