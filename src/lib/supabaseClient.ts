import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigurado = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase = supabaseConfigurado
  ? createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string)
  : null
