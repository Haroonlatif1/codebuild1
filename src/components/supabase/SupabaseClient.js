// src/supabaseClient.js
// Supabase now uses NEW key format (sb_publishable_... / sb_secret_...)
//
// SUPABASE_URL:  Settings → General → Project URL
//                e.g. https://abcxyzabcxyz.supabase.co
//
// SUPABASE_KEY:  Settings → API Keys → Publishable key
//                the sb_publishable_... key shown on that page
//                (safe to use in frontend code — that's exactly what it's for)
//
// DO NOT use the sb_secret_... key here — that's for servers only.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mqafdwponkhxttbkazsw.supabase.co";     // from Settings → General
const SUPABASE_KEY = "sb_publishable_aAPLdW8PNAGDD9_2poysPQ_3qQhX6jg"; // sb_publishable_aAPLdW8...

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);