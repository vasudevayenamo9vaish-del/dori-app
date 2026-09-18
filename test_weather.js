import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testWeather() {
  const { data, error } = await supabase.from('weather_check_ins').insert([
    { text: 'Happy', country: 'Test' }
  ]).select();
  
  if (error) {
    console.error('Error:', error.message, error.details, error.hint, error.code);
  } else {
    console.log('Success:', data);
  }
}

testWeather();
