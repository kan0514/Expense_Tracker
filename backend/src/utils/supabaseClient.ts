// file: src/config/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load .env variables (optional if already loaded in index.ts)
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

console.log("✅ Supabase client initialized")
