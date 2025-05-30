import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";

// Función para crear un cliente de Supabase que funciona tanto en renderizado estático como dinámico
export function createServerSupabaseClient() {
  // Creamos un cliente básico sin autenticación para casos de renderizado estático
  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  // Si estamos en un contexto donde podemos acceder a headers, añadimos la autenticación
  try {
    // Esto fallará durante el build estático, pero funcionará en tiempo de ejecución
    headers(); // Verificamos si podemos acceder a headers
    
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        auth: {
          persistSession: false,
        },
        global: {
          headers: {
            // Añadir headers de autenticación si es necesario
          },
        },
      }
    );
  } catch (e) {
    // Si no podemos acceder a headers, devolvemos el cliente básico
    return supabaseClient;
  }
}
