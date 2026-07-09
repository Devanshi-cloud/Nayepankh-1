import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// IS_PREVIEW_MODE still exported for other modules; no dummy client is provided
// (the real client will fail gracefully on its own)
export const IS_PREVIEW_MODE = !supabaseUrl || !supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Fatal: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
