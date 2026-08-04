import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://chvsgvoynatpqqbxnwem.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodnNndm95bmF0cHFxYnhud2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDAyMzAsImV4cCI6MjA5NDgxNjIzMH0.oA4YvNEYOQ4Gzo7k8MDPocx4sZmXn0DNmfPaO7Psae0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
