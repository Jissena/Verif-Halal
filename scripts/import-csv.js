// Fallback kalau scripts/sync-bpjph.js gagal (server BPJPH berubah, dll).
// Isi data manual di scripts/sample-data.csv, lalu jalankan:
//   node scripts/import-csv.js

require("dotenv").config({ path: ".env.local" });
const { sql } = require("@vercel/postgres");
const fs = require("fs");

async function main() {
  const raw = fs.readFileSync("./scripts/sample-data.csv", "utf-8");
  const rows = raw.trim().split("\n").slice(1); // skip header

  for (const row of rows) {
    const [product_name, brand, seller_name, halal_cert_number, halal_status, category] =
      row.split(",");
    await sql`
      INSERT INTO products (product_name, brand, seller_name, halal_cert_number, halal_status, category)
      VALUES (${product_name}, ${brand}, ${seller_name}, ${halal_cert_number}, ${halal_status}, ${category})
      ON CONFLICT (dedup_key) DO UPDATE SET
        halal_cert_number = EXCLUDED.halal_cert_number,
        halal_status = EXCLUDED.halal_status,
        category = EXCLUDED.category,
        updated_at = NOW()
    `;
    console.log(`Ditambahkan: ${product_name}`);
  }
  console.log("Import selesai.");
}

main().catch((err) => {
  console.error("Import gagal:", err.message);
  process.exit(1);
});
