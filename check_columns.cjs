

const supabaseUrl = 'https://chvsgvoynatpqqbxnwem.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodnNndm95bmF0cHFxYnhud2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDAyMzAsImV4cCI6MjA5NDgxNjIzMH0.oA4YvNEYOQ4Gzo7k8MDPocx4sZmXn0DNmfPaO7Psae0';

async function check() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseAnonKey}`);
    const json = await res.json();
    console.log(json);
  } catch (err) {
    console.error(err);
  }
}
check();
