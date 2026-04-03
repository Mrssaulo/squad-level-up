import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const FALLBACK_BACKEND_URL = "https://yhrghkwerszhmtnnzdpr.supabase.co";
const FALLBACK_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlocmdoa3dlcnN6aG10bm56ZHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODA4ODAsImV4cCI6MjA5MDQ1Njg4MH0.FKZwyDnP4oW0kP6xMtgabxMNruH6h0q3u8Q4Z3Kll9Y";

export const backendUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_BACKEND_URL;
export const backendPublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(backendUrl, backendPublishableKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});