import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { JWT } from 'https://esm.sh/google-auth-library@9.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { match_id, sender_id, text } = await req.json();

    // 1. Get Firebase Credentials from Supabase Secrets
    const serviceAccountStr = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
    if (!serviceAccountStr) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT secret');
    const serviceAccount = JSON.parse(serviceAccountStr);

    // 2. Initialize Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // 3. Find who the receiver is
    const { data: match } = await supabaseClient.from('matches').select('requester_id, receiver_id').eq('id', match_id).single();
    if (!match) throw new Error('Match not found');
    const receiverId = match.requester_id === sender_id ? match.receiver_id : match.requester_id;

    // 4. Get the receiver's push notification token and sender's name
    const { data: receiver } = await supabaseClient.from('profiles').select('device_token').eq('id', receiverId).single();
    const { data: sender } = await supabaseClient.from('profiles').select('first_name').eq('id', sender_id).single();

    if (!receiver?.device_token) {
      return new Response(JSON.stringify({ success: true, message: 'User has no device token' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 5. Generate Google OAuth Token for FCM v1
    const jwtClient = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });
    const tokens = await jwtClient.authorize();

    // 6. Send the Push Notification via FCM
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;
    
    const notificationPayload = {
      message: {
        token: receiver.device_token,
        notification: {
          title: `New message from ${sender?.first_name || 'someone'}`,
          body: text.length > 50 ? text.substring(0, 50) + '...' : text
        },
        android: {
          priority: 'high'
        }
      }
    };

    const res = await fetch(fcmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens.access_token}`,
      },
      body: JSON.stringify(notificationPayload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('FCM Error:', errorText);
      throw new Error('Failed to send FCM message');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
