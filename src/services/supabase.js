/*
    Based on project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Configuration for Supabase backend
    Secrets are imported from environment variables defined in gitignored .env file.
*/

import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
