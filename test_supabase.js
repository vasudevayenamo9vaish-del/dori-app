import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://chvsgvoynatpqqbxnwem.supabase.co';
const supabaseKey = 'sb_publishable_35SF9GtzbtJvIFOrzvQiNQ_6HuWTtmN';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing Supabase connection...");
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Auth Error:", error.message);
  } else {
    console.log("Auth Success. Session:", data.session);
  }
}

test();
