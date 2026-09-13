"use client";

import { useState, useRef } from "react";
import { Search, ArrowRight, ShieldCheck, TrendingUp, Users, Package, ChevronDown, CircleAlert, X, Check, ReceiptText } from "lucide-react";

export default function VerifHalalLanding() {
  const [link, setLink] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [mainTab, setMainTab] = useState("ringkasan");
  const [subTab, setSubTab] = useState("halal");
  const cardRef = useRef(null);

  const [notFound, setNotFound] = useState(false);

  async function handleCheck(e) {
    e.preventDefault();
    if (!link.trim()) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });
      const data = await res.json();

      if (data.status === "terverifikasi") {
        setResult({
          name: data.product.product_name,
          seller: data.product.seller_name,
          cert: data.product.halal_cert_number,
        });
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setNotFound(true);
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

  const subTabs = {
    halal: {
      label: "Status halal",
      title: "Dicek langsung ke sumber resminya.",
      desc: "Bukan tebakan, bukan opini toko. Kami cocokkan nama & merek produk ke database resmi BPJPH, otoritas satu-satunya yang berhak menerbitkan sertifikat halal di Indonesia.",
      chip: { bg: "#E9F7EE", color: "#1E824C", icon: <ShieldCheck size={20} style={{ color: "#1E824C" }} />, title: "Terverifikasi halal", sub: "Sumber: database resmi BPJPH" },
    },
    riba: {
      label: "Skema riba",
      title: "Cicilan itu nggak sesederhana ada-bunga-atau-tidak.",
      desc: "Bunga tetap dan denda telat yang jadi keuntungan platform itu riba. Tapi biaya admin flat di awal itu wilayah abu-abu ulama masih berbeda pendapat. Kami tunjukkan struktur biayanya apa adanya, sesuai fatwa DSN-MUI yang relevan, bukan vonis halal-haram sepihak.",
      chip: { bg: "#FDECE8", color: coral, icon: <CircleAlert size={20} style={{ color: coral }} />, title: "Ada bunga tetap per bulan", sub: "Terdeteksi pada metode pembayaran ini" },
    },
    rekomendasi: {
      label: "Rekomendasi",
      title: "Belum terverifikasi? Ada gantinya.",
      desc: "Kalau produk yang kamu cek belum ketemu datanya, kami tunjukkan produk sejenis dari penjual lain yang sudah terverifikasi, biar kamu tetap bisa lanjut belanja dengan tenang.",
      chip: { bg: "#EEECFB", color: indigo, icon: <Package size={20} style={{ color: indigo }} />, title: "3 alternatif ditemukan", sub: "Sudah terverifikasi dari penjual lain" },
    },
  };

  const mainTabs = [
    { key: "ringkasan", label: "Ringkasan" },
    { key: "kenapa", label: "Kenapa penting" },
    { key: "caraKerja", label: "Cara kerja" },
    { key: "bandingkan", label: "Sebelum vs sesudah" },
  ];

  return (
    <div className="min-h-screen w-full" style={{ background: paper, color: ink }}>
            {/* HEADER: logo icon dihapus, wordmark saja */}
      <header className="px-6 md:px-14 py-6 sticky top-0 z-30" style={{ background: paper }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display text-xl font-bold tracking-tight">VerifHalal</span>
          <div className="hidden md:flex items-center gap-8 font-body text-sm font-medium" style={{ color: muted }}>
            <a href="#konten" className="hover:opacity-70">Kenapa penting</a>
            <a href="#konten" className="hover:opacity-70">Cara kerja</a>
            <a href="#faq" className="hover:opacity-70">FAQ</a>
          </div>
          <button className="font-body text-sm font-semibold px-4 py-2.5" style={{ background: ink, color: paper, borderRadius: 10 }}>
            Untuk penjual
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative px-6 md:px-14 pt-8 pb-16 md:pt-12 md:pb-20 overflow-hidden"
        style={{ background: paper }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 font-body text-xs font-semibold px-3 py-1.5 mb-6" style={{ background: "#FFD966", color: ink, borderRadius: 999 }}>
                <ShieldCheck size={13} /> Sumber data resmi BPJPH
              </div>
              <h1 className="font-display text-[2.6rem] md:text-[3.6rem] leading-[1.02] font-extrabold mb-6">
                Sebelum checkout,
                <br />
                <span style={{ color: indigo }}>pastikan dulu.</span>
              </h1>
              <p className="font-body text-base md:text-lg mb-9 max-w-md" style={{ color: muted }}>
                Tempel link produk Shopee atau Tokopedia. Kami cek status halal dan skema pembayarannya, seketika.
              </p>
              <form onSubmit={handleCheck} className="max-w-lg">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-3.5" style={{ background: "#FFFFFF", borderRadius: 14 }}>
                    <Search size={16} style={{ color: faint }} />
                    <input
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="Tempel link produk di sini"
                      className="font-body bg-transparent outline-none flex-1 text-sm placeholder:opacity-60"
                      style={{ color: ink }}
                    />
                  </div>
                  <button type="submit" className="font-body px-6 py-3.5 text-sm font-semibold flex items-center justify-center gap-2" style={{ background: coral, color: "#fff", borderRadius: 14 }}>
                    Cek sekarang <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            </div>

            <div className="relative flex items-center justify-center py-6" style={{ perspective: 1200 }}>
              <div className="absolute w-[240px] h-[300px]" style={{ background: "#D8CFF7", borderRadius: 20, transform: "rotate(-11deg) translateY(10px)" }} />
              <div className="absolute w-[240px] h-[300px]" style={{ background: indigoDeep, borderRadius: 20, transform: "rotate(7deg) translateY(6px)" }} />
              <div
                ref={cardRef}
                className="relative w-[250px] p-6"
                style={{ background: "#FFFFFF", borderRadius: 20, boxShadow: "0 20px 45px -12px rgba(35,29,130,0.35)" }}
              >
                {!result && !loading && !notFound && (
                  <div className="flex flex-col items-center justify-center text-center py-14">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ background: paperDim }}>
                      <ReceiptText size={20} style={{ color: faint }} />
                    </div>
                    <p className="font-body text-sm" style={{ color: faint }}>Hasil pengecekan<br />akan muncul di sini</p>
                  </div>
                )}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-14">
                    <div className="w-6 h-6 mb-4 rounded-full border-2 animate-spin" style={{ borderColor: paperDim, borderTopColor: indigo }} />
                    <p className="font-body text-sm" style={{ color: faint }}>Mencocokkan ke BPJPH...</p>
                  </div>
                )}
                {notFound && !loading && (
                  <div className="flex flex-col items-center justify-center text-center py-10">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ background: "#FDECE8" }}>
                      <CircleAlert size={20} style={{ color: coral }} />
                    </div>
                    <p className="font-body text-sm font-semibold mb-1">Belum terverifikasi</p>
                    <p className="font-body text-xs" style={{ color: faint }}>Data produk belum ketemu di database kami. Bukan berarti tidak halal.</p>
                  </div>
                )}
                {result && !loading && (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-body text-xs font-semibold px-2.5 py-1" style={{ background: "#E9F7EE", color: "#1E824C", borderRadius: 8 }}>Terverifikasi</span>
                      <ShieldCheck size={18} style={{ color: "#1E824C" }} />
                    </div>
                    <p className="font-body text-xs mb-1" style={{ color: faint }}>{result.seller}</p>
                    <p className="font-display text-base font-bold mb-5">{result.name}</p>
                    <div className="space-y-3 pt-4" style={{ borderTop: `1px solid ${paperDim}` }}>
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm" style={{ color: muted }}>No. sertifikat</span>
                        <span className="font-body text-sm font-semibold">{result.cert}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm" style={{ color: muted }}>Skema bayar</span>
                        <span className="font-body text-sm font-semibold" style={{ color: "#1E824C" }}>Tidak ada bunga terdeteksi</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ONE BIG TABBED SECTION: gabungan Ringkasan / Kenapa Penting / Cara Kerja / Sebelum-Sesudah */}
      <section id="konten" className="px-6 md:px-14 py-14" style={{ background: paperDim }}>
        <div className="max-w-6xl mx-auto">

          <div className="flex gap-2 mb-10 flex-wrap">
            {mainTabs.map((t) => (
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

          {/* PANEL: RINGKASAN */}
          {mainTab === "ringkasan" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Package size={17} />, num: "12.400+", label: "produk sudah dicek" },
                { icon: <Users size={17} />, num: "860+", label: "UMKM terverifikasi" },
                { icon: <TrendingUp size={17} />, num: "3.200+", label: "pengguna aktif" },
              ].map((s, i) => (
                <div key={i} className="p-5" style={{ background: "#FFFFFF", borderRadius: 16 }}>
                  <div className="flex items-center gap-2 mb-1" style={{ color: indigo }}>
                    {s.icon}
                    <span className="font-display text-xl md:text-2xl font-extrabold">{s.num}</span>
                  </div>
                  <p className="font-body text-xs md:text-sm" style={{ color: muted }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* PANEL: KENAPA PENTING (sub-tabs) */}
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
              <div className="grid md:grid-cols-[1fr_1fr] gap-10 items-center">
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold mb-3">{subTabs[subTab].title}</h3>
                  <p className="font-body text-sm md:text-base leading-relaxed" style={{ color: muted }}>{subTabs[subTab].desc}</p>
                </div>
                <div className="p-7" style={{ background: "#FFFFFF", borderRadius: 20 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: subTabs[subTab].chip.bg }}>
                      {subTabs[subTab].chip.icon}
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold">{subTabs[subTab].chip.title}</p>
                      <p className="font-body text-xs" style={{ color: faint }}>{subTabs[subTab].chip.sub}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PANEL: CARA KERJA */}
          {mainTab === "caraKerja" && (
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { n: "1", title: "Tempel link", desc: "Salin link produk dari Shopee atau Tokopedia." },
                { n: "2", title: "Kami cocokkan", desc: "Sistem mencocokkan ke data resmi BPJPH dan cek skema pembayaran." },
                { n: "3", title: "Belanja yakin", desc: "Hasil langsung tampil, lengkap dengan rekomendasi kalau belum terverifikasi." },
              ].map((s) => (
                <div key={s.n} className="p-6" style={{ background: "#FFFFFF", borderRadius: 20 }}>
                  <span className="font-display font-extrabold text-2xl block mb-4" style={{ color: indigo }}>{s.n}</span>
                  <p className="font-body font-semibold mb-1.5">{s.title}</p>
                  <p className="font-body text-sm" style={{ color: muted }}>{s.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* PANEL: SEBELUM VS SESUDAH */}
          {mainTab === "bandingkan" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-6" style={{ background: "#FFFFFF", borderRadius: 20 }}>
                <div className="flex items-center gap-2 mb-4 font-body text-sm font-semibold" style={{ color: "#A14A2F" }}>
                  <X size={16} /> Tanpa VerifHalal
                </div>
                <ul className="font-body text-sm space-y-3" style={{ color: muted }}>
                  <li className="flex gap-2"><CircleAlert size={15} className="shrink-0 mt-0.5" /> Buka satu-satu website BPJPH manual</li>
                  <li className="flex gap-2"><CircleAlert size={15} className="shrink-0 mt-0.5" /> Nggak sadar cicilan yang dipakai ada bunganya</li>
                  <li className="flex gap-2"><CircleAlert size={15} className="shrink-0 mt-0.5" /> Terlanjur checkout, baru ragu belakangan</li>
                </ul>
              </div>
              <div className="p-6" style={{ background: indigo, borderRadius: 20 }}>
                <div className="flex items-center gap-2 mb-4 font-body text-sm font-semibold" style={{ color: "#FFD966" }}>
                  <Check size={16} /> Dengan VerifHalal
                </div>
                <ul className="font-body text-sm space-y-3" style={{ color: "#fff" }}>
                  <li className="flex gap-2"><ShieldCheck size={15} className="shrink-0 mt-0.5" style={{ color: "#FFD966" }} /> Tempel link, hasil keluar dalam hitungan detik</li>
                  <li className="flex gap-2"><ShieldCheck size={15} className="shrink-0 mt-0.5" style={{ color: "#FFD966" }} /> Info skema pembayaran ikut ditampilkan</li>
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
              { q: "Apa VerifHalal ini yang menentukan produk halal atau tidak?", a: "Bukan. Kewenangan itu ada di BPJPH. Kami cuma mencocokkan data produk ke database resmi mereka dan menampilkannya lebih mudah diakses." },
              { q: "Kalau statusnya \"belum terverifikasi\", berarti haram?", a: "Belum tentu. Artinya datanya belum ketemu di database BPJPH, bisa jadi produknya belum didaftarkan sertifikasi." },
              { q: "Kenapa harus cek skema pembayaran juga?", a: "Karena cicilan/paylater itu berbeda-beda strukturnya. Bunga tetap dan denda telat yang jadi keuntungan platform tergolong riba. Biaya admin flat tanpa bunga masih diperdebatkan ulama. Kami tunjukkan strukturnya, bukan vonis sepihak." },
              { q: "Dasar penilaian skema riba dari mana?", a: "Dari fatwa DSN-MUI yang relevan (No. 117/2018 tentang fintech syariah dan No. 54/2006 tentang kartu kredit syariah). Kami bukan lembaga fatwa, jadi untuk kondisi spesifik tetap disarankan konsultasi ke ustaz atau lembaga fatwa terpercaya." },
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
