# Video Calling (WebRTC) Implementation

We will implement Peer-to-Peer Video Calling using WebRTC. To establish the connection, the two devices need to exchange network information (Signaling). We will use our existing Supabase Realtime Broadcast channels for signaling.

## Proposed Changes

### 1. New Component: `src/pages/VideoCall.jsx`
- Create a full-screen video call UI with local and remote `<video>` elements.
- Implement WebRTC `RTCPeerConnection`.
- Handle microphone/camera permissions using `navigator.mediaDevices.getUserMedia`.
- Mute/Unmute audio and video toggle buttons.
- End call button.

### 2. Modify `src/pages/Chats.jsx`
- Listen for `call_invite` broadcasts on the chat channel.
- If an invite is received, show an "Incoming Call from [Name]" overlay with Accept/Decline buttons.
- If the Video button is clicked, open the Video Call overlay in "calling" mode and broadcast a `call_invite`.

### 3. Signaling Protocol (Supabase Broadcast)
We will send the following events over the `chat_${match_id}` channel:
- `call_invite`: Initiates the ring.
- `call_accepted`: Tells the caller to start WebRTC.
- `call_declined`: Stops the ringing.
- `webrtc_offer`: Sends the SDP offer.
- `webrtc_answer`: Sends the SDP answer.
- `webrtc_ice_candidate`: Sends ICE network candidates.
- `call_ended`: Tears down the WebRTC connection for both sides.

## User Review Required
> [!IMPORTANT]
> WebRTC requires special permissions on Android/iOS when exported via Capacitor. We will also need to add camera/mic permissions to the Android Manifest later before building the APK.

> [!WARNING]
> Peer-to-peer WebRTC works great on Wi-Fi, but if users are on strict mobile networks (NAT/Firewalls), video calls might fail to connect without a TURN server (a paid relay server like Twilio Network Traversal). We will start with a free STUN server (Google's public STUN) which works for 80% of connections. If it's not reliable enough, we may need to set up a TURN server later.

Are you ready to proceed with this architecture?
