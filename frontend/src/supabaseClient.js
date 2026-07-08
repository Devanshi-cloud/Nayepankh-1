import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const IS_PREVIEW_MODE = !supabaseUrl || !supabaseAnonKey;

if (IS_PREVIEW_MODE) {
  console.warn("⚠️ Supabase environment variables are missing. Running in PREVIEW/MOCK MODE.");
}

// Export a dummy client if in preview mode so that calls to it do not crash the app
export const supabase = IS_PREVIEW_MODE 
  ? {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        insert: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: [], error: null }),
      })
    }
  : createClient(supabaseUrl, supabaseAnonKey);
