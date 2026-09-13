// Jalankan sekali setelah database Vercel Postgres di-attach ke project:
//   node scripts/setup-db.js
// Script ini butuh environment variable POSTGRES_URL sudah ada di .env.local
// (otomatis didapat dari Vercel lewat perintah: vercel env pull .env.local)

require("dotenv").config({ path: ".env.local" });
const { sql } = require("@vercel/postgres");
const fs = require("fs");

async function main() {
  const schema = fs.readFileSync("./scripts/schema.sql", "utf-8");
  await sql.query(schema);
  console.log("Tabel 'products' berhasil dibuat / sudah ada.");
}

main().catch((err) => {
  console.error("Gagal setup database:", err.message);
  process.exit(1);
});
