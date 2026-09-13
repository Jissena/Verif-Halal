import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Ambil nama produk dari halaman Shopee/Tokopedia lewat meta tag og:title.
// Ini teknik wajar dan umum dipakai (bukan scraping data pribadi),
// karena og:title memang disediakan tiap halaman produk untuk keperluan preview link.
async function extractProductName(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; VerifHalalBot/1.0)" },
    });
    const html = await res.text();
    const match = html.match(/<meta property="og:title" content="([^"]*)"/i);
    if (match && match[1]) return match[1];
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    return titleMatch ? titleMatch[1] : null;
  } catch (err) {
    return null;
  }
}

// Cari produk di database dengan dua lapis strategi:
// 1. Full-text search (toleran terhadap perbedaan urutan kata)
// 2. Fallback: cari pakai kata paling khas (kata terpanjang) kalau full-text kosong
async function findProduct(productName) {
  const ftsResult = await sql`
    SELECT *, ts_rank(to_tsvector('simple', product_name), plainto_tsquery('simple', ${productName})) AS rank
    FROM products
    WHERE to_tsvector('simple', product_name) @@ plainto_tsquery('simple', ${productName})
    ORDER BY rank DESC
    LIMIT 1
  `;
  if (ftsResult.rows.length > 0) return ftsResult.rows[0];

  // Fallback: ambil kata terpanjang dari nama produk (biasanya kata paling khas/unik,
  // misal nama merek), lalu cari pakai pencarian teks biasa.
  const words = productName
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);
  if (words.length === 0) return null;
  const mostDistinctiveWord = words.reduce((a, b) => (b.length > a.length ? b : a));

  const fallbackResult = await sql`
    SELECT * FROM products
    WHERE product_name ILIKE ${"%" + mostDistinctiveWord + "%"}
    LIMIT 1
  `;
  return fallbackResult.rows[0] || null;
}

export async function POST(request) {
  const body = await request.json();
  const url = body?.url;

  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return NextResponse.json(
      { error: "Link tidak valid. Pastikan format link diawali https://" },
      { status: 400 }
    );
  }

  const productName = await extractProductName(url);

  if (!productName) {
    return NextResponse.json(
      { status: "gagal", message: "Tidak bisa membaca nama produk dari link ini." },
      { status: 200 }
    );
  }

  try {
    const match = await findProduct(productName);

    if (match) {
      return NextResponse.json({ status: "terverifikasi", product: match });
    }

    return NextResponse.json({ status: "belum_terverifikasi", scanned_name: productName });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
