import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

// Función para crear un cliente de Supabase que funciona tanto en renderizado estático como dinámico
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    // {
    //   async accessToken() {
    //     return (await auth()).getToken();
    //   },
    // },
  );
}

// Lets use this one!!
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!,
);

// useEffect(() => {
//   console.log("ReportPage");

//   function loadData() {
//     supabase.from("category").select("*").then(({ data, error }) => {
//       if (error) {
//         console.error("Error loading categories:", error);
//       } else {
//         console.log("Categories loaded:", data);
//       }
//     });
//   }

//   loadData();
// }, []);