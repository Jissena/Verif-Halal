# VerifHalal

Cek dulu, baru yakin belanja. Project Next.js, database Vercel Postgres.

## Kenapa Vercel Postgres (bukan Supabase)

Vercel itu tempat menjalankan website (hosting). Database itu tempat menyimpan data,
secara teknis memang selalu jadi layanan terpisah dari hosting, di semua platform manapun.
Vercel Postgres dipilih di sini karena dia nempel langsung di dashboard Vercel yang sudah
dipakai, jadi tidak perlu daftar akun database terpisah lagi.

## Langkah setup (urutan wajib)

1. Install dependency:
   ```
   npm install
   ```

2. Buat database di dashboard Vercel:
   - Buka project ini di vercel.com (setelah di-deploy pertama kali)
   - Tab **Storage** > **Create Database** > pilih **Postgres**
   - Klik **Connect Project**, hubungkan ke project VerifHalal ini

3. Install Vercel CLI, lalu tarik environment variable-nya ke lokal:
   ```
   npm install -g vercel
   vercel link
   vercel env pull .env.local
   ```
   File `.env.local` otomatis terisi, tidak perlu ketik manual.

4. Bikin tabel database (jalankan sekali saja):
   ```
   npm run db:setup
   ```

5. Isi data awal, pilih salah satu:
   - **Otomatis** (coba dulu, tapi baca catatan jujur di dalam filenya soal keterbatasannya):
     ```
     npm run db:sync -- "kecap" "indomie" "teh botol" "minyak goreng" "susu"
     ```
   - **Manual/fallback** kalau cara di atas gagal:
     ```
     npm run db:import-csv
     ```

6. Jalankan aplikasi:
   ```
   npm run dev
   ```
   Buka `http://localhost:3000`

## Soal koneksi ke BPJPH (baca ini biar realistis)

BPJPH belum menyediakan API resmi untuk pihak ketiga. Yang ada baru portal pencarian
publik di cekhalal.bpjph.go.id. `scripts/sync-bpjph.js` mencoba mengambil data dari
endpoint yang ditemukan lewat observasi jaringan pada portal itu (bukan dokumentasi
resmi), jadi:
- Bisa berhenti berfungsi kapan saja kalau BPJPH mengubah sistemnya
- Untuk proposal, tulis ini sebagai solusi sementara, dan cantumkan "mengajukan
  kerja sama resmi ke BPJPH untuk akses data" sebagai rencana pengembangan jangka
  panjang
- Kalau sync otomatis gagal, `scripts/import-csv.js` adalah jalan pintas manual:
  cari produk satu-satu di cekhalal.bpjph.go.id, catat datanya di
  `scripts/sample-data.csv`, lalu jalankan importer-nya

## Struktur folder

```
app/
  page.jsx              -> landing page utama
  layout.jsx             -> font & metadata
  globals.css            -> styling global
  api/check/route.js     -> logic pengecekan produk (server-side)
lib/
  db.js                   -> koneksi ke Vercel Postgres
scripts/
  schema.sql              -> struktur tabel database
  setup-db.js             -> bikin tabel (jalankan sekali)
  sync-bpjph.js           -> tarik data otomatis dari BPJPH (best effort)
  import-csv.js           -> fallback import data manual
  sample-data.csv          -> data contoh buat fallback
```

## Deploy ke Vercel

1. Push project ini ke GitHub
2. Import repo di vercel.com
3. Karena database sudah di-attach di langkah setup, environment variable
   otomatis ikut ter-deploy, tidak perlu isi ulang manual di dashboard
4. Deploy

## Catatan keamanan

- Semua koneksi database lewat `@vercel/postgres` yang otomatis pakai environment
  variable dari Vercel, tidak ada kunci rahasia yang ditulis manual di kode.
- Endpoint `app/api/check/route.js` sudah validasi input sebelum diproses,
  jangan hapus validasi ini.
- Jangan commit file `.env.local` ke GitHub (sudah otomatis di-skip lewat
  `.gitignore`).
