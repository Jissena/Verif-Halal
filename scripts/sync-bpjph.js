/**
 * Script ini narik data produk halal dari pencarian publik BPJPH,
 * lalu simpan ke database. Jalankan dengan:
 *   node scripts/sync-bpjph.js "kecap" "indomie" "teh botol"
 *
 * CATATAN JUJUR (baca ini sebelum pakai):
 * BPJPH belum menyediakan API resmi untuk pihak ketiga. Endpoint yang dipakai
 * di bawah ini ditemukan lewat observasi jaringan pada portal publik mereka
 * (cekhalal.bpjph.go.id), BUKAN dokumentasi resmi. Artinya:
 *   1. Bisa berhenti berfungsi sewaktu-waktu kalau BPJPH mengubah sistemnya.
 *   2. Harus dipakai secara wajar (jangan spam request, kasih jeda antar request,
 *      sudah diterapkan di bawah lewat delay 1.5 detik).
 *   3. Untuk proposal/skripsi, tulis ini sebagai "solusi sementara sebelum ada
 *      kerja sama resmi dengan BPJPH", bukan sebagai integrasi resmi.
 *
 * Kalau script ini gagal jalan (karena endpoint berubah), fallback-nya pakai
 * scripts/import-csv.js dengan data yang diisi manual dari pencarian di
 * cekhalal.bpjph.go.id.
 */

require("dotenv").config({ path: ".env.local" });
const { sql } = require("@vercel/postgres");

const BPJPH_SEARCH_ENDPOINT = "https://cmsbl.halal.go.id/api/search/data_penyelia";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchKeyword(keyword) {
  try {
    const res = await fetch(`${BPJPH_SEARCH_ENDPOINT}?q=${encodeURIComponent(keyword)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; VerifHalalSync/1.0)" },
    });
    if (!res.ok) {
      console.warn(`  Gagal cari "${keyword}": status ${res.status}`);
      return [];
    }
    const data = await res.json();
    // Struktur respons bisa berbeda dari dugaan ini, sesuaikan setelah dicek manual.
    return Array.isArray(data?.data) ? data.data : [];
  } catch (err) {
    console.warn(`  Error cari "${keyword}": ${err.message}`);
    return [];
  }
}

async function saveToDb(item) {
  const productName = item.nama_produk || item.name || "Tidak diketahui";
  const sellerName = item.nama_pelaku_usaha || null;
  await sql`
    INSERT INTO products (product_name, brand, seller_name, halal_cert_number, halal_status, category)
    VALUES (${productName}, ${item.merek || null}, ${sellerName}, ${item.no_sertifikat || item.nib || null}, 'terverifikasi', ${item.kategori || null})
    ON CONFLICT (dedup_key) DO UPDATE SET
      halal_cert_number = EXCLUDED.halal_cert_number,
      halal_status = EXCLUDED.halal_status,
      category = EXCLUDED.category,
      updated_at = NOW()
  `;
}

async function main() {
  const keywords = process.argv.slice(2);
  if (keywords.length === 0) {
    console.log('Pakai: node scripts/sync-bpjph.js "kecap" "indomie" "teh botol"');
    process.exit(0);
  }

  for (const keyword of keywords) {
    console.log(`Mencari: ${keyword}`);
    const results = await searchKeyword(keyword);
    console.log(`  Ketemu ${results.length} hasil`);
    for (const item of results) {
      await saveToDb(item);
    }
    await delay(1500); // jeda 1.5 detik, jangan spam ke server BPJPH
  }

  console.log("Selesai.");
}

main().catch((err) => {
  console.error("Sync gagal:", err.message);
  console.error("Coba pakai scripts/import-csv.js sebagai alternatif manual.");
  process.exit(1);
});
