import { createClient } from "@supabase/supabase-js";

// Estos dos valores son públicos (clave "publicable"), es seguro tenerlos aquí.
const SUPABASE_URL = "https://odiceqqseszfhpmtalny.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_JJ4umguHPbb6-3dlo4BeOw_llpUeiqa";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
