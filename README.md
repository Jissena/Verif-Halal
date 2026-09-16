# VerifHalal

Cek dulu, baru yakin belanja.

## Arsitektur

Website ini mencari data secara REAL-TIME langsung ke halaman pencarian
publik BPJPH (bpjph.halal.go.id/cari/sertifikat), tidak menyimpan salinan
data produk sendiri. Ini sudah diverifikasi manual bekerja (lihat
app/api/check/route.js untuk detail endpoint dan parameter yang dipakai).

Alur:
1. User mengetik nama produk (bukan menempel link, karena Shopee tidak bisa
   dibaca otomatis dan Tokopedia memblokir akses otomatis ke halaman produk)
2. Server memanggil bpjph.halal.go.id/cari/sertifikat?produk=<kata kunci>
3. Hasil HTML diparse mengambil tabel hasil pencarian
4. Ditampilkan ke user, maksimal 5 hasil teratas

## Catatan penting

- Endpoint ini ditemukan lewat observasi manual pada portal publik BPJPH,
  bukan dokumentasi API resmi. Bisa berubah jika BPJPH mengubah struktur
  halamannya.
- Hasil pencarian bisa mencakup UMKM/warung kecil, bukan cuma produk
  kemasan bermerek, karena database BPJPH mencakup semua pelaku usaha
  wajib sertifikasi halal.
- Fitur riba bersifat edukasi umum (bukan mendeteksi metode pembayaran
  spesifik yang dipakai user), karena keterbatasan teknis untuk membaca
  halaman checkout marketplace.

## Cara jalanin di laptop

```
npm install
npm run dev
```
Buka http://localhost:3000

## Deploy ke Vercel

1. Push ke GitHub (pastikan struktur folder app/, bukan file rata semua)
2. Import repo di vercel.com
3. Deploy (tidak perlu setup database apapun)
