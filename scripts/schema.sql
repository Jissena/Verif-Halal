-- Jalankan sekali lewat: npm run db:setup

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_name TEXT NOT NULL,
  brand TEXT,
  seller_name TEXT,
  halal_cert_number TEXT,
  halal_status TEXT DEFAULT 'terverifikasi',
  category TEXT,
  source_url TEXT,
  -- dedup_key otomatis dibentuk dari nama produk + penjual (huruf kecil semua),
  -- dipakai biar data yang sama nggak numpuk duplikat kalau sync dijalankan berkali-kali.
  dedup_key TEXT GENERATED ALWAYS AS (lower(product_name) || '|' || lower(coalesce(seller_name, ''))) STORED,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index unik buat mencegah duplikat: kombinasi nama produk + penjual yang sama
-- tidak akan tersimpan dua kali, tapi akan meng-update data lama (lihat ON CONFLICT
-- di scripts/sync-bpjph.js dan scripts/import-csv.js).
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_dedup ON products (dedup_key);

-- Index full-text search: biar pencarian nama produk lebih toleran terhadap
-- perbedaan urutan kata (bukan cuma cocok kalau substring-nya identik persis).
CREATE INDEX IF NOT EXISTS idx_products_fts ON products USING gin (to_tsvector('simple', product_name));
