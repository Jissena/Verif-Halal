"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  CircleAlert,
  X,
  Check,
  ReceiptText,
  Package,
} from "lucide-react";

export default function VerifHalalLanding() {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [alternatives, setAlternatives] = useState([]);
  const [unreachable, setUnreachable] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [mainTab, setMainTab] = useState("kenapa");
  const [subTab, setSubTab] = useState("halal");
  const [selectedPayment, setSelectedPayment] = useState(null);

  async function handleCheck(e) {
    e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true);
    setProducts(null);
    setNotFound(false);
    setUnreachable(false);
    setAlternatives([]);

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();

      if (data.status === "terverifikasi") {
        setProducts(data.products);
      } else if (data.status === "tidak_terjangkau") {
        setUnreachable(true);
      } else {
        setNotFound(true);
        setAlternatives(data.alternatives || []);
      }
    } catch (err) {
      setUnreachable(true);
    } finally {
      setLoading(false);
    }
  }

  const ink = "#161326";
  const paper = "#ECE8FA";
  const paperDim = "#DFD9F3";
  const indigo = "#3B31C4";
  const indigoDeep = "#231D82";
  const coral = "#FF5A3C";
  const muted = "#5F5A72";
  const faint = "#8B86A0";

  const paymentMethods = [
    {
      key: "tunai",
      label: "Tunai / Transfer Langsung",
      status: "aman",
      title: "Aman dari riba",
      desc: "Bayar lunas tanpa penundaan berarti tidak ada unsur bunga sama sekali. Ini cara bayar yang paling jelas kehalalannya.",
    },
    {
      key: "cicilan_toko",
      label: "Cicilan dari Toko (tanpa bunga tertulis)",
      status: "cek",
      title: "Perlu dicek lebih detail",
      desc: "Kalau harga cicilan sama persis dengan harga tunai (nggak ada tambahan biaya), umumnya dianggap aman oleh mayoritas ulama. Tapi kalau ada biaya admin flat, ini masuk wilayah abu-abu yang ulama masih berbeda pendapat.",
    },
    {
      key: "paylater",
      label: "PayLater / Kredivo (dicicil)",
      status: "riba",
      title: "Berpotensi mengandung riba",
      desc: "Kalau dicicil dan ada bunga per bulan, atau ada denda keterlambatan yang jadi keuntungan platform, ini tergolong riba nasiah menurut fatwa DSN-MUI No. 117/2018.",
    },
    {
      key: "kartu_kredit",
      label: "Kartu Kredit Konvensional (dicicil)",
      status: "riba",
      title: "Berpotensi mengandung riba",
      desc: "Kartu kredit konvensional yang dicicil dengan bunga tergolong riba. Kalau mau aman, gunakan kartu kredit syariah (akad kafalah/ijarah) sesuai fatwa DSN-MUI No. 54/2006, atau bayar penuh sebelum jatuh tempo (tanpa bunga).",
    },
  ];

  const paymentStatusColor = {
    aman: { bg: "#E9F7EE", text: "#1E824C" },
    cek: { bg: "#FFF6DE", text: "#9A7B1E" },
    riba: { bg: "#FDECE8", text: coral },
  };

  const subTabs = {
    halal: {
      label: "Status halal",
      title: "Dicek langsung ke sumber resminya.",
      desc: "Bukan tebakan, bukan opini toko. Kami cocokkan nama produk ke data resmi BPJPH secara real-time, otoritas satu-satunya yang berhak menerbitkan sertifikat halal di Indonesia.",
    },
    riba: {
      label: "Skema riba",
      title: "Cicilan itu nggak sesederhana ada-bunga-atau-tidak.",
      desc: "Bunga tetap dan denda telat yang jadi keuntungan platform itu riba. Bayar tunai atau lunas di awal umumnya aman. Biaya admin flat tanpa bunga itu wilayah abu-abu ulama masih berbeda pendapat. Kami jelaskan strukturnya, bukan vonis sepihak.",
    },
    data: {
      label: "Sumber data",
      title: "Datanya dari mana, memangnya bisa dipercaya?",
      desc: "Setiap pencarian, sistem kami langsung mengambil data dari halaman pencarian publik BPJPH (bpjph.halal.go.id), bukan salinan data yang kami simpan sendiri. Jadi hasilnya selalu mengikuti data terbaru yang resmi diterbitkan.",
    },
  };

  return (
    <div className="min-h-screen w-full" style={{ background: paper, color: ink }}>
      {/* HEADER */}
      <header className="px-6 md:px-14 py-6 sticky top-0 z-30" style={{ background: paper }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display text-xl font-bold tracking-tight">VerifHalal</span>
          <div className="hidden md:flex items-center gap-8 font-body text-sm font-medium" style={{ color: muted }}>
            <a href="#konten" className="hover:opacity-70">Kenapa penting</a>
            <a href="#faq" className="hover:opacity-70">FAQ</a>
          </div>
          <Link href="/untuk-penjual" className="font-body text-sm font-semibold px-4 py-2.5 inline-block" style={{ background: ink, color: paper, borderRadius: 10 }}>
            Untuk penjual
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="px-6 md:px-14 pt-8 pb-16 md:pt-12 md:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 font-body text-xs font-semibold px-3 py-1.5 mb-6" style={{ background: "#FFD966", color: ink, borderRadius: 999 }}>
            <ShieldCheck size={13} /> Data real-time dari BPJPH
          </div>
          <h1 className="font-display text-[2.4rem] md:text-[3.4rem] leading-[1.05] font-extrabold mb-6">
            Sebelum checkout,
            <br />
            <span style={{ color: indigo }}>pastikan dulu.</span>
          </h1>
          <p className="font-body text-base md:text-lg mb-9" style={{ color: muted }}>
            Ketik nama produk yang mau kamu beli. Kami cari langsung ke data resmi BPJPH, real-time.
          </p>

          <form onSubmit={handleCheck} className="max-w-lg mx-auto mb-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3.5" style={{ background: "#FFFFFF", borderRadius: 14 }}>
                <Search size={16} style={{ color: faint }} />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Contoh: kecap manis, keripik pisang"
                  className="font-body bg-transparent outline-none flex-1 text-sm placeholder:opacity-60"
                  style={{ color: ink }}
                />
              </div>
              <button type="submit" className="font-body px-6 py-3.5 text-sm font-semibold flex items-center justify-center gap-2" style={{ background: coral, color: "#fff", borderRadius: 14 }}>
                Cek sekarang <ArrowRight size={15} />
              </button>
            </div>
          </form>
          <p className="font-body text-xs" style={{ color: faint }}>
            Hasil bisa mencakup UMKM/warung kecil juga, bukan cuma produk kemasan bermerek.
          </p>
        </div>

        {/* HASIL PENCARIAN */}
        <div className="max-w-2xl mx-auto mt-10">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-6 h-6 mb-4 rounded-full border-2 animate-spin" style={{ borderColor: paperDim, borderTopColor: indigo }} />
              <p className="font-body text-sm" style={{ color: faint }}>Mencari ke BPJPH...</p>
            </div>
          )}

          {notFound && !loading && (
            <div>
              <div className="flex flex-col items-center text-center py-8 px-6" style={{ background: "#FFFFFF", borderRadius: 20 }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ background: "#FDECE8" }}>
                  <CircleAlert size={20} style={{ color: coral }} />
                </div>
                <p className="font-body text-sm font-semibold mb-1">Belum terverifikasi</p>
                <p className="font-body text-xs" style={{ color: faint }}>Data belum ketemu di BPJPH. Bukan berarti tidak halal, coba kata kunci lain.</p>
              </div>

              {alternatives.length > 0 && (
                <div className="mt-4">
                  <p className="font-body text-xs font-semibold mb-3 px-1" style={{ color: muted }}>
                    Produk sejenis yang sudah terverifikasi:
                  </p>
                  <div className="space-y-2">
                    {alternatives.map((p, i) => (
                      <div key={i} className="p-4 flex items-start gap-3" style={{ background: "#FFFFFF", borderRadius: 14 }}>
                        <Package size={16} style={{ color: indigo }} className="shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="font-body text-sm font-medium">{p.product_name}</p>
                          <p className="font-body text-xs" style={{ color: faint }}>{p.seller_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {unreachable && !loading && (
            <div className="flex flex-col items-center text-center py-8 px-6" style={{ background: "#FFFFFF", borderRadius: 20 }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ background: "#FDECE8" }}>
                <CircleAlert size={20} style={{ color: coral }} />
              </div>
              <p className="font-body text-sm font-semibold mb-1">Sistem BPJPH sedang sibuk</p>
              <p className="font-body text-xs" style={{ color: faint }}>Coba cek lagi beberapa saat lagi.</p>
            </div>
          )}

          {products && !loading && (
            <div className="space-y-3">
              {products.map((p, i) => (
                <div key={i} className="p-5 flex items-start gap-4" style={{ background: "#FFFFFF", borderRadius: 16 }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#E9F7EE" }}>
                    <ShieldCheck size={18} style={{ color: "#1E824C" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-bold mb-1">{p.product_name}</p>
                    <p className="font-body text-xs mb-2" style={{ color: faint }}>{p.seller_name}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 font-body text-xs" style={{ color: muted }}>
                      <span>No. {p.halal_cert_number}</span>
                      {p.cert_date && <span>{p.cert_date}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TABBED SECTION */}
      <section id="konten" className="px-6 md:px-14 py-14" style={{ background: paperDim }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 mb-8 flex-wrap">
            {[
              { key: "kenapa", label: "Kenapa penting" },
              { key: "caraKerja", label: "Cara kerja" },
              { key: "bandingkan", label: "Sebelum vs sesudah" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setMainTab(t.key)}
                className="font-body text-sm font-semibold px-4 py-2.5 transition"
                style={{
                  background: mainTab === t.key ? ink : "#CFC6EF",
                  color: mainTab === t.key ? paper : indigoDeep,
                  borderRadius: 999,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {mainTab === "kenapa" && (
            <div>
              <div className="flex gap-2 mb-7 flex-wrap">
                {Object.entries(subTabs).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => setSubTab(key)}
                    className="font-body text-xs font-semibold px-3.5 py-2 transition"
                    style={{ background: subTab === key ? coral : "#FFFFFF", color: subTab === key ? "#fff" : muted, borderRadius: 999 }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="max-w-2xl">
                <h3 className="font-display text-xl md:text-2xl font-bold mb-3">{subTabs[subTab].title}</h3>
                <p className="font-body text-sm md:text-base leading-relaxed" style={{ color: muted }}>{subTabs[subTab].desc}</p>
              </div>

              {subTab === "riba" && (
                <div className="mt-8 max-w-2xl">
                  <p className="font-body text-sm font-semibold mb-3" style={{ color: ink }}>
                    Coba pilih metode pembayaran yang biasa kamu pakai:
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.key}
                        onClick={() => setSelectedPayment(pm.key)}
                        className="font-body text-xs font-semibold px-3.5 py-2.5 transition text-left"
                        style={{
                          background: selectedPayment === pm.key ? ink : "#FFFFFF",
                          color: selectedPayment === pm.key ? paper : muted,
                          borderRadius: 12,
                        }}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>

                  {selectedPayment && (() => {
                    const pm = paymentMethods.find((p) => p.key === selectedPayment);
                    const colors = paymentStatusColor[pm.status];
                    return (
                      <div className="p-5 flex items-start gap-3" style={{ background: colors.bg, borderRadius: 16 }}>
                        <CircleAlert size={18} style={{ color: colors.text }} className="shrink-0 mt-0.5" />
                        <div>
                          <p className="font-body text-sm font-semibold mb-1" style={{ color: colors.text }}>{pm.title}</p>
                          <p className="font-body text-xs leading-relaxed" style={{ color: muted }}>{pm.desc}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {mainTab === "caraKerja" && (
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { n: "1", title: "Ketik nama produk", desc: "Masukkan nama produk yang mau kamu cek, boleh nama merek atau jenis makanan." },
                { n: "2", title: "Kami cari real-time", desc: "Sistem langsung mencari ke data resmi BPJPH, tidak ada data yang kami simpan sendiri." },
                { n: "3", title: "Lihat hasilnya", desc: "Status sertifikasi, nomor sertifikat, dan nama pelaku usaha langsung tampil." },
              ].map((s) => (
                <div key={s.n} className="p-6" style={{ background: "#FFFFFF", borderRadius: 20 }}>
                  <span className="font-display font-extrabold text-2xl block mb-4" style={{ color: indigo }}>{s.n}</span>
                  <p className="font-body font-semibold mb-1.5">{s.title}</p>
                  <p className="font-body text-sm" style={{ color: muted }}>{s.desc}</p>
                </div>
              ))}
            </div>
          )}

          {mainTab === "bandingkan" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-6" style={{ background: "#FFFFFF", borderRadius: 20 }}>
                <div className="flex items-center gap-2 mb-4 font-body text-sm font-semibold" style={{ color: "#A14A2F" }}>
                  <X size={16} /> Tanpa VerifHalal
                </div>
                <ul className="font-body text-sm space-y-3" style={{ color: muted }}>
                  <li className="flex gap-2"><CircleAlert size={15} className="shrink-0 mt-0.5" /> Buka situs BPJPH manual, cari sendiri</li>
                  <li className="flex gap-2"><CircleAlert size={15} className="shrink-0 mt-0.5" /> Nggak sadar cicilan yang dipakai ada bunganya</li>
                  <li className="flex gap-2"><CircleAlert size={15} className="shrink-0 mt-0.5" /> Terlanjur checkout, baru ragu belakangan</li>
                </ul>
              </div>
              <div className="p-6" style={{ background: indigo, borderRadius: 20 }}>
                <div className="flex items-center gap-2 mb-4 font-body text-sm font-semibold" style={{ color: "#FFD966" }}>
                  <Check size={16} /> Dengan VerifHalal
                </div>
                <ul className="font-body text-sm space-y-3" style={{ color: "#fff" }}>
                  <li className="flex gap-2"><ShieldCheck size={15} className="shrink-0 mt-0.5" style={{ color: "#FFD966" }} /> Ketik nama produk, hasil keluar dalam hitungan detik</li>
                  <li className="flex gap-2"><ShieldCheck size={15} className="shrink-0 mt-0.5" style={{ color: "#FFD966" }} /> Penjelasan skema riba tersedia</li>
                  <li className="flex gap-2"><ShieldCheck size={15} className="shrink-0 mt-0.5" style={{ color: "#FFD966" }} /> Yakin dulu, baru checkout</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 md:px-14 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-8">Pertanyaan yang sering muncul.</h2>
          <div className="space-y-2">
            {[
              { q: "Apa VerifHalal ini yang menentukan produk halal atau tidak?", a: "Bukan. Kewenangan itu ada di BPJPH. Kami cuma mencari data ke sumber resmi mereka secara real-time dan menampilkannya lebih mudah diakses." },
              { q: "Kalau statusnya \"belum terverifikasi\", berarti haram?", a: "Belum tentu. Artinya datanya belum ketemu di BPJPH, bisa jadi produknya belum didaftarkan sertifikasi, atau nama yang dicari kurang sesuai." },
              { q: "Kenapa hasil pencarian kadang muncul warung/UMKM kecil, bukan produk kemasan?", a: "Karena database BPJPH mencakup semua pelaku usaha wajib sertifikasi halal, dari UMKM rumahan sampai pabrikan besar, bukan cuma produk yang dijual di marketplace." },
              { q: "Dasar penilaian skema riba dari mana?", a: "Dari fatwa DSN-MUI yang relevan (No. 117/2018 tentang fintech syariah dan No. 54/2006 tentang kartu kredit syariah). Kami bukan lembaga fatwa, untuk kondisi spesifik tetap disarankan konsultasi ke ustaz atau lembaga fatwa terpercaya." },
              { q: "Berapa biayanya buat masyarakat umum?", a: "Gratis. Yang berbayar cuma penjual/UMKM yang mau produknya tampil sebagai rekomendasi prioritas." },
            ].map((f, i) => (
              <div key={i} className="p-5" style={{ background: paperDim, borderRadius: 16 }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex items-center justify-between text-left font-body font-semibold text-sm md:text-base"
                >
                  {f.q}
                  <ChevronDown size={18} className="shrink-0 transition-transform ml-3" style={{ transform: openFaq === i ? "rotate(180deg)" : "none", color: indigo }} />
                </button>
                {openFaq === i && <p className="font-body text-sm mt-3" style={{ color: muted }}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-14 py-16">
        <div className="max-w-6xl mx-auto p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: indigo, borderRadius: 24 }}>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-center md:text-left" style={{ color: "#fff" }}>
            Cek dulu,<br className="hidden md:block" /> baru yakin belanja.
          </h2>
          <a href="#" className="font-body px-6 py-3.5 font-semibold flex items-center gap-2 shrink-0" style={{ background: coral, color: "#fff", borderRadius: 12 }}>
            Mulai cek gratis <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-14 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <span className="font-display text-sm font-bold">VerifHalal</span>
          <p className="font-body text-xs" style={{ color: faint }}>Bukan otoritas fatwa. Data halal dari BPJPH, info skema riba merujuk fatwa DSN-MUI.</p>
        </div>
      </footer>
    </div>
  );
}
