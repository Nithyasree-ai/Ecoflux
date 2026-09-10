import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// True if user has configured valid Supabase keys
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock User for effortless hackathon demo presentation
export const DEMO_USER = {
  id: 'usr-demo-001',
  email: 'campus.manager@gvit.edu',
  fullName: 'Dr. Elena Rostova',
  role: 'Campus Administrator' as const,
  institution: 'Green Valley Institute of Technology',
  campusCode: 'GVIT-CAMPUS-01',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};
