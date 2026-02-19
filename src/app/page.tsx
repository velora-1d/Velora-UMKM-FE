"use client";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CloudCog,
  Lock,
  Menu,
  Package,
  ShieldCheck,
  ShoppingCart,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

/* ──────────────── ANIMATION HELPERS ──────────────── */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────── DATA ──────────────── */
const NAV_LINKS = [
  { label: "Fitur", href: "#features" },
  { label: "Cara Kerja", href: "#how" },
  { label: "Harga", href: "#pricing" },
  { label: "Tentang", href: "#trust" },
];

const PROBLEMS = [
  {
    icon: Package,
    title: "Stok sering beda",
    desc: "Barang di toko nggak sesuai catatan, bikin bingung dan rugi.",
    gradient: "from-red-500/20 to-orange-500/20",
    iconColor: "text-red-400",
  },
  {
    icon: ClipboardList,
    title: "Catatan masih manual",
    desc: "Masih pakai buku atau spreadsheet, gampang salah dan lambat.",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-400",
  },
  {
    icon: BarChart3,
    title: "Sulit tahu untung rugi",
    desc: "Nggak punya laporan keuangan usaha yang jelas dan akurat.",
    gradient: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Users,
    title: "Karyawan susah dikontrol",
    desc: "Nggak ada data absensi, shift, dan performa kru usaha.",
    gradient: "from-yellow-500/20 to-lime-500/20",
    iconColor: "text-yellow-400",
  },
];

const FEATURES = [
  {
    icon: ShoppingCart,
    title: "Sales & Invoice",
    desc: "Kelola pesanan, buat invoice, dan terima pembayaran pelanggan — semua otomatis tercatat.",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Package,
    title: "Inventory",
    desc: "Stok masuk & keluar otomatis update. Lihat summary kapan saja, dari mana saja.",
    gradient: "from-cyan-500 to-sky-500",
  },
  {
    icon: Users,
    title: "Absensi Karyawan",
    desc: "Pantau kehadiran harian, shift, dan performa tim usaha Anda dengan mudah.",
    gradient: "from-sky-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Laporan Usaha",
    desc: "Dashboard harian lengkap: penjualan, stok, profit, dan tren usaha Anda.",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const STEPS = [
  { num: "01", title: "Daftar usaha", desc: "Buat akun gratis & isi info usaha Anda dalam hitungan menit." },
  { num: "02", title: "Login via subdomain", desc: "Akses aplikasi lewat link khusus usaha Anda." },
  { num: "03", title: "Input produk & stok", desc: "Tambahkan katalog produk dan stok awal Anda." },
  { num: "04", title: "Mulai jualan", desc: "Setiap transaksi langsung tercatat rapi dan otomatis." },
  { num: "05", title: "Pantau laporan", desc: "Lihat performa usaha real-time dari dashboard." },
];

const TRUST_POINTS = [
  { icon: CloudCog, title: "Berbasis Cloud", desc: "Akses dari mana saja, kapan saja. Tidak perlu install apapun." },
  { icon: Lock, title: "Data 100% Aman", desc: "Semua data milik usaha Anda, terenkripsi dan terlindungi." },
  { icon: ShieldCheck, title: "Untuk UMKM Indonesia", desc: "Dirancang khusus sesuai kebutuhan bisnis lokal." },
];

/* ──────────────── NAVBAR ──────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
        }`}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Velora
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 transition-all duration-200"
          >
            Daftar Gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#111827]/95 backdrop-blur-xl border-t border-white/5 px-6 py-6 space-y-4"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-sm font-medium text-slate-300 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/auth/register"
            className="block w-full text-center rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Daftar Gratis
          </Link>
        </motion.div>
      )}
    </nav>
  );
}

/* ──────────────── MAIN PAGE ──────────────── */
export default function LandingPage() {
  return (
    <div className="bg-[#0a0f1a] text-white overflow-hidden">
      <Navbar />

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20">
        {/* Background effects */}
        <div className="absolute inset-0">
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(20,184,166,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.5) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          {/* Radial glow top */}
          <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-teal-500/10 rounded-full blur-[150px]" />
          {/* Side glows */}
          <div className="absolute top-1/3 left-[-200px] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-5 py-2 text-xs font-semibold text-teal-400 tracking-wide uppercase">
              <Zap className="h-3.5 w-3.5" />
              Platform ERP untuk UMKM Indonesia
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Kelola Stok, Penjualan,
              <br />
              &amp; Usaha{" "}
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
                UMKM
              </span>{" "}
              Tanpa Ribet
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 leading-relaxed">
              ERP sederhana untuk UMKM: kelola stok, jualan, absensi, dan
              laporan usaha — semuanya dalam satu platform.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300"
              >
                Daftar Gratis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                Lihat Cara Kerja
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </FadeIn>

          {/* Dashboard Mockup */}
          <FadeIn delay={0.5} className="mt-20">
            <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#111827]/80 backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5 bg-[#0d1420]">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                </div>
                <div className="ml-4 flex-1 h-7 rounded-lg bg-white/5 flex items-center px-3">
                  <span className="text-xs text-slate-500 font-mono">
                    tokosaya.umkm.ve-lora.my.id/dashboard
                  </span>
                </div>
              </div>
              {/* Dashboard content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: "Penjualan Hari Ini", value: "Rp 2.450.000", trend: "+12%", color: "text-teal-400" },
                    { label: "Produk Aktif", value: "127", trend: "+3", color: "text-cyan-400" },
                    { label: "Stok Rendah", value: "5", trend: "⚠", color: "text-amber-400" },
                    { label: "Karyawan Hadir", value: "8/10", trend: "80%", color: "text-emerald-400" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-white/5 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-colors"
                    >
                      <p className="text-[11px] text-slate-500 uppercase tracking-wider">{s.label}</p>
                      <p className={`mt-2 text-xl sm:text-2xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="mt-1 text-xs text-slate-500">{s.trend}</p>
                    </div>
                  ))}
                </div>
                {/* Chart area */}
                <div className="h-36 sm:h-44 rounded-xl border border-white/5 bg-white/[0.02] flex items-end justify-center gap-2 p-6 pb-4">
                  {[40, 65, 45, 80, 60, 90, 55, 75, 85, 70, 95, 60].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-teal-500/60 to-cyan-500/40"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ PROBLEM ═══════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-sm font-bold text-red-400 uppercase tracking-[0.2em] text-center">
              Masalah UMKM
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center">
              Masih kelola usaha dengan{" "}
              <span className="text-red-400">cara lama?</span>
            </h2>
          </FadeIn>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROBLEMS.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <div className="group h-full rounded-2xl border border-white/5 bg-[#111827]/50 backdrop-blur-sm p-7 hover:border-white/10 hover:bg-[#111827]/80 transition-all duration-300">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${p.gradient}`}>
                    <p.icon className={`h-7 w-7 ${p.iconColor}`} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SOLUTION ═══════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/[0.03] to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <FadeIn>
            <p className="text-sm font-bold text-teal-400 uppercase tracking-[0.2em]">
              Solusi
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Satu sistem untuk{" "}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                semua kebutuhan
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              Velora menyatukan penjualan, stok barang, approval pembayaran,
              absensi karyawan, dan laporan usaha — dalam satu tempat.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {["Penjualan", "Stok Barang", "Approval Pembayaran", "Absensi Karyawan", "Laporan Usaha"].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-5 py-2.5 text-sm font-medium text-teal-300"
                  >
                    <CheckCircle2 className="h-4 w-4 text-teal-400" />
                    {item}
                  </span>
                )
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ KEY FEATURES ═══════ */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111827]/50 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-sm font-bold text-teal-400 uppercase tracking-[0.2em] text-center">
              Fitur Utama
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center">
              Semua yang kamu butuhkan
            </h2>
          </FadeIn>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.1}>
                <div className="group relative h-full rounded-2xl border border-white/5 bg-[#111827]/60 backdrop-blur-sm p-8 hover:border-teal-500/20 transition-all duration-300 overflow-hidden">
                  {/* Glow effect on hover */}
                  <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${f.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} shadow-lg`}>
                      <f.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-white">{f.title}</h3>
                    <p className="mt-3 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how" className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <p className="text-sm font-bold text-teal-400 uppercase tracking-[0.2em] text-center">
              Cara Kerja
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center">
              Mulai dalam{" "}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                5 langkah mudah
              </span>
            </h2>
          </FadeIn>

          <div className="mt-16 space-y-6">
            {STEPS.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.08}>
                <div className="group flex items-start gap-5 sm:gap-6">
                  <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-lg group-hover:from-teal-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300">
                    {s.num}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg font-bold text-white">{s.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{s.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111827]/50 to-transparent" />
        <div className="relative mx-auto max-w-5xl">
          <FadeIn>
            <p className="text-sm font-bold text-teal-400 uppercase tracking-[0.2em] text-center">
              Harga
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center">
              Mulai gratis, upgrade kapan saja
            </h2>
          </FadeIn>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                plan: "Free Trial",
                price: "Gratis",
                sub: "14 hari",
                features: ["Semua fitur aktif", "1 user", "Support via chat"],
                highlight: false,
              },
              {
                plan: "UMKM Pro",
                price: "Rp 99.000",
                sub: "/ bulan",
                features: [
                  "Semua fitur aktif",
                  "Unlimited user",
                  "WhatsApp notifikasi",
                  "Priority support",
                ],
                highlight: true,
              },
              {
                plan: "Enterprise",
                price: "Custom",
                sub: "hubungi kami",
                features: [
                  "Multi-cabang",
                  "Custom fitur",
                  "SLA & dedicated support",
                ],
                highlight: false,
              },
            ].map((p, i) => (
              <FadeIn key={p.plan} delay={i * 0.1}>
                <div
                  className={`relative h-full rounded-2xl border p-8 transition-all duration-300 ${p.highlight
                      ? "border-teal-500/30 bg-gradient-to-b from-teal-500/10 to-cyan-500/5 shadow-2xl shadow-teal-500/10"
                      : "border-white/5 bg-[#111827]/50 hover:border-white/10"
                    }`}
                >
                  {p.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-1.5 text-xs font-bold text-white shadow-lg shadow-teal-500/25">
                      Populer
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white">{p.plan}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className={`text-3xl font-extrabold ${p.highlight ? "text-teal-400" : "text-white"}`}>
                      {p.price}
                    </span>
                    <span className="text-sm text-slate-500">{p.sub}</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-teal-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/register"
                    className={`mt-8 block w-full rounded-xl py-3.5 text-center text-sm font-bold transition-all duration-300 ${p.highlight
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02]"
                        : "border border-white/10 text-white hover:bg-white/5"
                      }`}
                  >
                    {p.highlight ? "Mulai Sekarang" : "Pilih Paket"}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <p className="mt-10 text-center text-sm text-slate-500">
              Tanpa biaya tersembunyi • Batal kapan saja
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ TRUST ═══════ */}
      <section id="trust" className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRUST_POINTS.map((t, i) => (
              <FadeIn key={t.title} delay={i * 0.1}>
                <div className="text-center space-y-5">
                  <div className="mx-auto inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/15 to-cyan-500/15 border border-teal-500/10">
                    <t.icon className="h-9 w-9 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{t.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{t.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-32 px-6 relative">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-teal-500/10 rounded-full blur-[200px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(20,184,166,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Siap rapihin usaha kamu{" "}
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
                hari ini?
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-6 text-lg text-slate-400">
              Ribuan UMKM sudah pakai Velora. Saatnya giliran kamu.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link
              href="/auth/register"
              className="group mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300"
            >
              Daftar Gratis Sekarang
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#070b14]">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Velora</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Contact
            </Link>
          </div>

          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} Velora. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
