import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing Supabase URL or Anon Key. Authentication will not work."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

// Utilidad para obtener la URL de redirección según el entorno
export const getAuthRedirectUrl = () => {
  const isProduction = import.meta.env.PROD;
  const isVercel = window.location.hostname.includes("vercel.app");

  if (isProduction || isVercel) {
    return `${window.location.origin}/auth/callback`;
  }
  return "http://localhost:3000/auth/callback";
};
