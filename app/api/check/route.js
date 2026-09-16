import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

// Endpoint ini SUDAH TERVERIFIKASI BENAR lewat pengecekan manual di browser
// (bukan tebakan lagi seperti percobaan sebelumnya):
//   https://bpjph.halal.go.id/cari/sertifikat?produk=<kata kunci>
//
// CATATAN JUJUR: ini tetap bukan API resmi dari BPJPH untuk pihak ketiga,
// melainkan halaman pencarian publik yang kita baca. Bisa berhenti berfungsi
// kalau BPJPH mengubah struktur halamannya. Untuk proposal, tulis ini sebagai
// "jembatan pencarian real-time ke data publik BPJPH", dengan rencana
// pengajuan kerja sama resmi sebagai pengembangan jangka panjang.
const BPJPH_SEARCH_URL = "https://bpjph.halal.go.id/cari/sertifikat";

async function searchBpjph(keyword) {
  const url = `${BPJPH_SEARCH_URL}?produk=${encodeURIComponent(keyword)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return { ok: false, reason: "status_error" };

    const html = await res.text();
    const $ = cheerio.load(html);

    // Cari tabel hasil: baca setiap baris <tr> di dalam <table>,
    // ambil teks tiap kolom <td>. Ini pendekatan umum yang toleran
    // terhadap perbedaan class/styling, karena hanya bergantung pada
    // struktur tabel (tr > td), bukan nama class tertentu.
    //
    // Untuk menentukan kolom mana yang mana, kita kenali POLA datanya
    // (bukan cuma asumsi posisi index tetap), supaya tetap akurat kalau
    // urutan kolom di halaman BPJPH berubah sewaktu-waktu:
    //   - Nomor sertifikat: selalu diawali "ID" diikuti angka
    //   - Tanggal: mengandung nama bulan (January-December)
    //   - Nomor urut: cuma angka pendek (1-3 digit) di kolom pertama
    const CERT_PATTERN = /^ID\d+/i;
    const DATE_PATTERN = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/i;

    const results = [];
    $("table tr").each((i, row) => {
      const cells = $(row)
        .find("td")
        .map((j, cell) => $(cell).text().trim())
        .get();

      if (cells.length < 4) return; // baris header atau tidak lengkap, lewati

      let certNumber = null;
      let certDate = null;
      let nomorUrut = null;
      const remaining = [];

      for (const cell of cells) {
        if (CERT_PATTERN.test(cell)) {
          certNumber = cell;
        } else if (DATE_PATTERN.test(cell)) {
          certDate = cell;
        } else if (!nomorUrut && /^\d{1,4}$/.test(cell)) {
          nomorUrut = cell;
        } else {
          remaining.push(cell);
        }
      }

      // Setelah nomor sertifikat, tanggal, dan nomor urut dikeluarkan,
      // sisanya (biasanya 2 kolom: nama produk & produsen) diambil berurutan.
      results.push({
        product_name: remaining[0] || null,
        seller_name: remaining[1] || null,
        halal_cert_number: certNumber,
        cert_date: certDate,
      });
    });

    // Buang baris yang gagal kebaca nama produknya (data rusak/kolom tidak
    // sesuai pola), daripada menampilkan entri kosong ke user.
    const validResults = results.filter((r) => r.product_name);

    return { ok: true, results: validResults };
  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, reason: "unreachable" };
  }
}

export async function POST(request) {
  const body = await request.json();
  const keyword = body?.keyword;

  // Validasi input dasar di server, jangan percaya input mentah dari user.
  if (!keyword || typeof keyword !== "string" || keyword.trim().length < 2) {
    return NextResponse.json(
      { error: "Ketik minimal 2 huruf nama produk." },
      { status: 400 }
    );
  }

  const trimmed = keyword.trim().slice(0, 100); // batasi panjang input

  const result = await searchBpjph(trimmed);

  if (!result.ok) {
    return NextResponse.json({
      status: "tidak_terjangkau",
      message: "Sistem BPJPH sedang tidak bisa diakses, coba lagi sebentar.",
    });
  }

  if (result.results.length === 0) {
    // Coba pencarian lebih luas pakai kata pertama saja, sebagai rekomendasi
    // produk sejenis yang mungkin masih relevan (belum tentu identik).
    const firstWord = trimmed.split(" ")[0];
    let alternatives = [];
    if (firstWord.length >= 2 && firstWord.toLowerCase() !== trimmed.toLowerCase()) {
      const broaderResult = await searchBpjph(firstWord);
      if (broaderResult.ok) {
        alternatives = broaderResult.results.slice(0, 3);
      }
    }

    return NextResponse.json({
      status: "belum_terverifikasi",
      keyword: trimmed,
      alternatives, // bisa kosong kalau memang tidak ada yang mendekati
    });
  }

  return NextResponse.json({
    status: "terverifikasi",
    products: result.results.slice(0, 5), // maksimal 5 hasil teratas
  });
}
