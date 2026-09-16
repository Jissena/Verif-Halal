"use client";

import { useState } from "react";
import { ShieldCheck, TrendingUp, Users, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

export default function UntukPenjual() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ nama_usaha: "", nomor_sertifikat: "", kontak: "" });

  const ink = "#161326";
  const paper = "#ECE8FA";
  const paperDim = "#DFD9F3";
  const indigo = "#3B31C4";
  const coral = "#FF5A3C";
  const muted = "#5F5A72";
  const faint = "#8B86A0";

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nama_usaha || !form.nomor_sertifikat) return;
    // Untuk tahap prototipe: data pendaftaran belum tersimpan ke database
    // (sesuai keputusan arsitektur tanpa database untuk MVP ini).
    // Rencana pengembangan: dikirim ke Google Form/email tim sementara,
    // sebelum ada sistem database khusus penjual.
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen w-full" style={{ background: paper, color: ink }}>
      <header className="px-6 md:px-14 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-body text-sm" style={{ color: muted }}>
            <ArrowLeft size={15} /> Kembali ke VerifHalal
          </Link>
        </div>
      </header>

      <section className="px-6 md:px-14 py-10 md:py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-5 leading-tight">
              Produk halal kamu,
              <br />
              <span style={{ color: indigo }}>lebih gampang ketemu.</span>
            </h1>
            <p className="font-body text-sm md:text-base mb-8" style={{ color: muted }}>
              Sudah tersertifikasi halal? Daftarkan usahamu supaya lebih mudah direkomendasikan
              ke pembeli yang peduli kepatuhan syariah.
            </p>

            <div className="space-y-3">
              {[
                { icon: <ShieldCheck size={16} />, text: "Tampil sebagai rekomendasi utama saat pembeli mencari produk sejenis" },
                { icon: <TrendingUp size={16} />, text: "Akses data seberapa sering produkmu dicek pembeli" },
                { icon: <Users size={16} />, text: "Terhubung ke komunitas pembeli yang peduli produk syariah" },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-4" style={{ background: "#FFFFFF", borderRadius: 14 }}>
                  <span style={{ color: indigo }} className="mt-0.5">{f.icon}</span>
                  <span className="font-body text-sm" style={{ color: ink }}>{f.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4" style={{ background: paperDim, borderRadius: 14 }}>
              <p className="font-body text-xs leading-relaxed" style={{ color: muted }}>
                Catatan: fitur pendaftaran ini masih tahap awal. Untuk sekarang, tim kami akan
                menghubungi kamu secara manual setelah mengisi form di samping. Verifikasi
                sertifikat tetap merujuk ke data resmi BPJPH.
              </p>
            </div>
          </div>

          <div className="p-7" style={{ background: "#FFFFFF", borderRadius: 20 }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-display text-lg font-bold mb-1">Daftar sebagai penjual</h2>
                <p className="font-body text-xs mb-5" style={{ color: faint }}>
                  Isi form ini, tim kami akan menghubungi kamu.
                </p>

                <div>
                  <label className="font-body text-xs font-semibold block mb-1.5" style={{ color: ink }}>
                    Nama usaha
                  </label>
                  <input
                    required
                    value={form.nama_usaha}
                    onChange={(e) => setForm({ ...form, nama_usaha: e.target.value })}
                    placeholder="Contoh: Toko Bahagia Sembako"
                    className="w-full font-body text-sm px-4 py-3 outline-none"
                    style={{ background: paperDim, borderRadius: 12, color: ink }}
                  />
                </div>

                <div>
                  <label className="font-body text-xs font-semibold block mb-1.5" style={{ color: ink }}>
                    Nomor sertifikat halal
                  </label>
                  <input
                    required
                    value={form.nomor_sertifikat}
                    onChange={(e) => setForm({ ...form, nomor_sertifikat: e.target.value })}
                    placeholder="Contoh: ID00123456789012"
                    className="w-full font-body text-sm px-4 py-3 outline-none"
                    style={{ background: paperDim, borderRadius: 12, color: ink }}
                  />
                </div>

                <div>
                  <label className="font-body text-xs font-semibold block mb-1.5" style={{ color: ink }}>
                    Kontak (WhatsApp/email)
                  </label>
                  <input
                    value={form.kontak}
                    onChange={(e) => setForm({ ...form, kontak: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full font-body text-sm px-4 py-3 outline-none"
                    style={{ background: paperDim, borderRadius: 12, color: ink }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full font-body text-sm font-semibold py-3.5 mt-2"
                  style={{ background: coral, color: "#fff", borderRadius: 12 }}
                >
                  Kirim pendaftaran
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#E9F7EE" }}>
                  <Check size={22} style={{ color: "#1E824C" }} />
                </div>
                <p className="font-display text-lg font-bold mb-2">Terima kasih!</p>
                <p className="font-body text-sm" style={{ color: muted }}>
                  Pendaftaran kamu sudah kami terima. Tim VerifHalal akan menghubungi kamu segera.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
