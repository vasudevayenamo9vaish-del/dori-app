import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://chvsgvoynatpqqbxnwem.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodnNndm95bmF0cHFxYnhud2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDAyMzAsImV4cCI6MjA5NDgxNjIzMH0.oA4YvNEYOQ4Gzo7k8MDPocx4sZmXn0DNmfPaO7Psae0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('profiles').select('id, device_token').not('device_token', 'is', null);
  console.log("Tokens found:", data);
  console.log("Error:", error);
}

check();
