import { createClient } from "@supabase/supabase-js"
import { SITE } from "./config"

export const supabase = createClient(SITE.supabaseUrl, SITE.supabaseAnonKey)
