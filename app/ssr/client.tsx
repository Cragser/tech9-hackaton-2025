import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Función para crear un cliente de Supabase que funciona tanto en renderizado estático como dinámico
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken();
      },
    },
  );
}
