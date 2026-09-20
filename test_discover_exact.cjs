const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const supabaseAnonKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  // Assume user is vaish
  const { data: userProfile } = await supabase.from('profiles').select('id, blocked_users').eq('first_name', 'vaish').single();
  const userId = userProfile.id;
  const blockedUsers = userProfile.blocked_users || [];
  
  let query = supabase.from('profiles').select('*').neq('id', userId);
  query = query.ilike('first_name', '%gg%');
  
  const { data, error } = await query;
  
  console.log("Raw query data:", data?.length, "profiles");
  
  let availableProfiles = data.filter(p => !blockedUsers.includes(p.id));
  
  console.log("Available profiles after blocked filter:", availableProfiles.length);
  if (availableProfiles.length > 0) {
      console.log("Names:", availableProfiles.map(p => p.first_name));
  }
}
run();
