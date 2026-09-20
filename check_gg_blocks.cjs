const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const supabaseAnonKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: gg } = await supabase.from('profiles').select('id, blocked_users').ilike('first_name', '%gg%').single();
  console.log("GG blocked users:", gg.blocked_users);
}
run();
