import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Tabelas em `public` (padrão). Outro schema: VITE_SUPABASE_DB_SCHEMA=nome
 * e incluir o schema em Settings → API → Exposed schemas (+ grants se for custom).
 */
const dbSchema = import.meta.env.VITE_SUPABASE_DB_SCHEMA?.trim() || "gastrack";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: dbSchema },
});