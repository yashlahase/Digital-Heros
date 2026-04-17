import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Public client for use in the browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role (bypasses RLS)
// This will only be initialized on the server
export const supabaseAdmin = 
  typeof window === 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null as any
