# Play Store Launch & UX Polish Checklist

To ensure Dori is fully ready for the Google Play Store and provides a flawless user experience, here are the recommended next steps.

## 1. Google Play Store Compliance (Critical)
Google Play is very strict about apps with User-Generated Content (UGC) like chats and profiles.
- [ ] **Privacy Policy & Terms of Service**: We need a "Settings" page with links to a Privacy Policy and EULA (End User License Agreement). You cannot publish without this.
- [ ] **Report Moderation**: We currently have a "Block & Report" button, which is great! However, Google requires you (the admin) to take action on reports within 24 hours. We should add a system that emails you or sends a Discord/Slack message instantly whenever someone is reported.

## 2. Video & Audio Experience Polish
- [ ] **Ringing Sounds**: The video call pops up silently right now. We should add an audio file (like a gentle chime or ringtone) that plays on loop when an incoming call is received, and stops when they answer or decline.
- [ ] **Call Disconnect Cleanup**: Ensure that if someone's network drops, the video call UI gracefully closes instead of freezing.

## 3. Android Native Feel (Capacitor)
- [ ] **Hardware Back Button**: On Android phones, users press the physical/swipe back button. Right now, doing that might close the entire app! We need to add Capacitor logic so the hardware back button just navigates to the previous screen (e.g., closes a chat and goes back to the Connections list).
- [ ] **App Icon & Splash Screen**: We need to generate the official Dori logo for the Android home screen and the loading splash screen that appears while the app opens.

## 4. Chat & Connection Features
- [ ] **Read Receipts**: We can add tiny "Read" or "Seen" checkmarks to messages so users know if the other person saw their message.
- [ ] **Push Notification Deep Linking**: When someone gets a push notification that says "New message from GG", tapping the notification should ideally open the app *directly* to the chat with GG, rather than just the home screen.

Let me know which category you want to tackle next!
