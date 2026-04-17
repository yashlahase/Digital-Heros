import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Public client for use in the browser (uses cookies automatically)
export const supabase = typeof window !== 'undefined' 
  ? createClientComponentClient() 
  : (supabaseUrl && supabaseAnonKey 
      ? createClient(supabaseUrl, supabaseAnonKey) 
      : new Proxy({}, {
          get: () => {
            const handler = () => ({ 
              auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
              from: () => handler(),
              select: () => handler(),
              eq: () => handler(),
              order: () => handler(),
              single: () => Promise.resolve({ data: null, error: null }),
              then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb),
              catch: () => Promise.resolve({ data: [], error: null }),
            })
            return handler()
          }
        }) as any)

// Server-side client with service role (bypasses RLS)
export const supabaseAdmin = 
  typeof window === 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY && supabaseUrl
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : (supabase ? supabase : null as any)
