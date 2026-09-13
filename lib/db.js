import { sql } from "@vercel/postgres";

// Vercel Postgres otomatis kasih environment variable (POSTGRES_URL, dst)
// begitu database di-attach ke project di dashboard Vercel.
// Tidak perlu isi manual seperti Supabase.
export { sql };
