import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ChatMessage {
  id: string;
  visitor_name: string;
  visitor_email: string;
  message: string;
  is_from_admin: boolean;
  read: boolean;
  session_id: string;
  created_at: string;
}
