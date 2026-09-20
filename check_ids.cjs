const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const supabaseAnonKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: vaish } = await supabase.from('profiles').select('id, first_name').eq('first_name', 'vaish').single();
  const { data: gg } = await supabase.from('profiles').select('id, first_name').ilike('first_name', '%gg%').single();
  
  console.log("Vaish:", vaish);
  console.log("GG:", gg);
}
run();
