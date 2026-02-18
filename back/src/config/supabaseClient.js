// Cliente administrativo de Supabase.
// Utiliza la SERVICE_ROLE_KEY, por lo que solo debe usarse en el backend.
// No debe exponerse nunca al frontend.

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// Se extraen las variables de entorno
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

// Validación temprana para evitar que la aplicación arranque mal configurada
if (!SUPABASE_URL) {
  throw new Error("SUPABASE_URL is not defined in environment variables");
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables");
}

// Se crea el cliente administrativo con la service role key.
// persistSession se desactiva porque no estamos usando sesiones en backend.
export const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
