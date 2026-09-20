const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const supabaseAnonKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: userProfile } = await supabase.from('profiles').select('id').eq('first_name', 'vaish').single();
  const userId = userProfile.id;
  console.log("Current user ID:", userId);
  
  // Fake sign in to get a session
  // Wait, I can't sign in without password. 
  // Let's just check the RLS policies by querying postgres directly.
}
run();
