const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const supabaseAnonKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const userId = 'de1b2ae3-790d-49dc-be1c-948dc01ffe02'; // vaish
  let query = supabase.from('profiles').select('*').neq('id', userId);
  query = query.ilike('first_name', '%gg%');
  
  const { data, error } = await query;
  console.log("Result:", data?.length, error);
}
run();
