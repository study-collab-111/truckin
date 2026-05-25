/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Truck, 
  Lock, 
  Compass
} from 'lucide-react';
import { AppView } from '../types';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="bg-[#0A0A0A] text-white font-sans antialiased min-h-screen selection:bg-[#C5FF00] selection:text-black">
      {/* Navigation */}
      <header className="bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 fixed w-full z-50">
        <div className="flex justify-between items-center h-20 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <div 
              className="text-2xl font-black tracking-tighter uppercase cursor-pointer flex items-center gap-2"
              onClick={() => onNavigate('landing')}
            >
              TRUKIN<span className="text-[#C5FF00]">_</span>
            </div>
            
            {/* Navigation links */}
            <nav className="hidden md:flex gap-8 items-center text-xs uppercase tracking-[0.2em] font-medium text-white/60">
              <a href="#solusi" className="hover:text-white transition-colors">Solusi</a>
              <a href="#armada" className="hover:text-white transition-colors">Armada</a>
              <a href="#tentang-kami" className="hover:text-white transition-colors">Tentang Kami</a>
              <button 
                onClick={() => onNavigate('admin-login')} 
                className="hover:text-white transition-colors flex items-center gap-1.5 opacity-80 hover:opacity-100 uppercase"
              >
                <Lock className="w-3.5 h-3.5 text-[#C5FF00]" />
                Admin
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('login')} 
              className="hidden md:block px-4 py-2 text-xs uppercase tracking-wider font-bold text-white/80 hover:text-white transition-all cursor-pointer"
            >
              Akun Saya
            </button>
            <button 
              onClick={() => onNavigate('register-customer')} 
              className="bg-[#C5FF00] text-black hover:bg-white px-6 py-2.5 rounded-none font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-20">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-36 border-b border-white/10">
          {/* Large decorative technical grid */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          </div>
          
          {/* Decorative Background Text Overlay */}
          <div className="absolute top-1/2 -left-16 text-[22rem] font-black opacity-[0.02] leading-none pointer-events-none select-none italic uppercase tracking-tighter -translate-y-1/2">
            MOVE
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 border border-white/10 mb-8 rounded-none">
                <span className="flex h-2 w-2 rounded-full bg-[#C5FF00] animate-pulse"></span>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/60">Ekosistem Logistik Terpercaya</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black tracking-[-0.04em] uppercase leading-[0.85] mb-8">
                LOGISTIK <span className="text-[#C5FF00]">DIGITAL</span> &amp; <br />
                PEMESANAN <span className="underline decoration-white/20 underline-offset-8">TRUK</span>.
              </h1>
              
              <p className="text-base md:text-lg opacity-70 mb-12 max-w-xl leading-relaxed border-l-2 border-[#C5FF00] pl-6 font-sans">
                Efisiensi logistik untuk dunia modern. Terhubung dengan operator terverifikasi, kelola armada secara real-time, dan kembangkan bisnis Anda bersama platform digital TrukIn.
              </p>
              
              <div className="flex flex-wrap gap-5">
                <button 
                  onClick={() => onNavigate('register-customer')}
                  className="bg-[#C5FF00] text-black px-10 py-4.5 rounded-none font-black text-sm uppercase tracking-widest hover:bg-white transition-all flex items-center gap-3 cursor-pointer"
                >
                  Pesan Truk
                  <ArrowRight className="w-4 h-4 animate-bounce-horizontal" />
                </button>
                <button 
                  onClick={() => onNavigate('register-partner')}
                  className="bg-transparent border border-white/20 text-white hover:border-white px-10 py-4.5 rounded-none font-black text-sm uppercase tracking-widest transition-all cursor-pointer"
                >
                  Kemitraan Armada
                </button>
              </div>

              {/* Counter stats */}
              <div className="mt-16 flex items-center gap-12 border-t border-white/15 pt-10">
                <div>
                  <p className="text-3xl md:text-4xl font-extrabold font-mono text-white tracking-tight">12RB+</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] mt-1 font-mono">Truk Aktif</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-extrabold font-mono text-[#C5FF00] tracking-tight">99.8%</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] mt-1 font-mono">Tepat Waktu</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-extrabold font-mono text-white tracking-tight">4.9/5</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] mt-1 font-mono">Rating Partner</p>
                </div>
              </div>
            </motion.div>

            {/* Right Side Feature Graphics */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-4 relative hidden lg:block"
            >
              <div className="absolute -inset-10 bg-[#C5FF00]/5 blur-[120px] rounded-full"></div>
              <div className="relative z-10 bg-[#121212] p-6 border border-white/10 grayscale contrast-125 hover:grayscale-0 transition-all duration-700">
                <div className="absolute top-2 right-2 text-[10.5px] font-mono text-white/30">SYS_A_43</div>
                <img 
                  alt="TrukIn Hero Logistics Illustration" 
                  className="w-full h-auto object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrU1bxqiMMxDdLfze9hsK7AtaN25s3EtaL0OfPznUZIfzgWSvsAKIhVmp4gIiVslw-eSWMpKPO9_nfSZDVzGGSJuUJSeYHP2qg5zxA2GjNV9kfh66Hwg-Oanx1E0nbYXm67AmIAsP0x1PvvdwnaXCsx7sANsUIXkDjBVb5Dt9Vl_o-8Iy-063LFmvEhx251b9EXulZZEnBYAGOWAQLu087Xugf1lKKfYLMTQikRf57FHq7kqyFI6vrsWa00tqRUIPxWT5uTpn6AmI" 
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Path Split Section */}
        <section id="solusi" className="py-24 border-b border-white/10 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <span className="text-xs font-mono text-[#C5FF00] tracking-[0.3em] uppercase block mb-2">PILIH DIVISI</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">KONEKTIVITAS DUA SISI_</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              
              {/* Customer Box */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-[#121212] p-12 border border-white/10 hover:border-[#C5FF00] transition-all duration-300"
              >
                <div className="absolute top-6 right-6 font-mono text-[10px] text-white/30">DIV_SHIPPER</div>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-1.5 font-mono text-[10px] tracking-wider mb-8">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5FF00]" />
                  UNTUK PENGIRIM CARGO
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">SAYA INGIN MENGIRIM KARGO</h3>
                <p className="text-white/60 mb-10 text-sm leading-relaxed">
                  Dapatkan penawaran instan transparan, pelacakan armada real-time, dan pengemudi terverifikasi jaminan keamanan untuk pengiriman bisnis Anda.
                </p>
                <button 
                  onClick={() => onNavigate('login')}
                  className="w-full bg-[#C5FF00] text-black py-4 font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex justify-center items-center gap-2 cursor-pointer"
                >
                  MASUK SEBAGAI PELANGGAN
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Partner Box */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-[#121212] p-12 border border-white/10 hover:border-white transition-all duration-300"
              >
                <div className="absolute top-6 right-6 font-mono text-[10px] text-white/30">DIV_CARRIER</div>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-[#C5FF00] px-4 py-1.5 font-mono text-[10px] tracking-wider mb-8">
                  <Compass className="w-3.5 h-3.5 text-[#C5FF00]" />
                  UNTUK PEMBAWA MUATAN
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">SAYA MEMILIKI ARMADA TRUK</h3>
                <p className="text-white/60 mb-10 text-sm leading-relaxed">
                  Akses jaringan pengirim korporat berskala nasional, optimalkan utilitas rute Anda, dan cairkan pembayaran lebih cepat via sistem kami.
                </p>
                <button 
                  onClick={() => onNavigate('register-partner')}
                  className="w-full border-2 border-white text-white py-4 font-black text-xs uppercase tracking-widest hover:bg-[#C5FF00] hover:text-black hover:border-transparent transition-all flex justify-center items-center gap-2 cursor-pointer"
                >
                  DAFTAR KEMITRAAN DRIVER
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Tentang Kami */}
        <section id="tentang-kami" className="py-24 border-b border-white/10 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Image panel */}
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#C5FF00]/5 rounded-full blur-3xl"></div>
                <div className="relative z-10 p-2 bg-[#121212] border border-white/15 grayscale hover:grayscale-0 transition-all duration-500">
                  <img 
                    alt="Logistics and Trucking" 
                    className="w-full h-[450px] object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZlnXzKBQrbb2j0GQRtjYbModwRzhKZ2Be-J8ygY_zUmPYSvIw3_Iub-8JNxyqjTtzN9PGVlxYIe3bXcyb8H9v2k2Anohzg3I0oBJNHNGyyU83m7u7dY6VoAYobQsABNNictsdQE3yeeHF_Z4NZdRtk_zzMKXasgt3SvH-EvDPn3qBxi89tpty8Stamvs66_nIbq7gK5aqK4rZ9jzwco8NmKaN6TaHPWJ0PfnkJ30IRiWcKpYChwh28fxF3_zxaYnUVtTLTRfouOE" 
                  />
                </div>
                
                {/* Float indicator badge */}
                <div className="absolute bottom-6 -right-6 bg-black p-5 border border-white/10 z-20 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#C5FF00] p-3 text-black">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-xs uppercase tracking-wider text-white">EFISIENSI MAKSIMAL</p>
                      <p className="text-[10px] font-mono text-white/50">MUTU &amp; DISIPLIN KERJA</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text info panel */}
              <div className="flex flex-col items-start">
                <span className="font-mono text-xs tracking-[0.3em] text-[#C5FF00] mb-4 uppercase bg-white/5 px-4 py-1.5 border border-white/10">MANIFESTO_</span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight leading-none">MENGHUBUNGKAN LOGISTIK, MEMPERCEPAT PERTUMBUHAN</h2>
                <div className="h-1 w-24 bg-[#C5FF00] mb-8"></div>
                
                <div className="space-y-6 text-white/70 leading-relaxed text-sm">
                  <p>Selamat datang di TrukIn, platform logistik digital berkinerja tinggi yang dirancang khusus untuk menyederhanakan cara Anda mendistribusikan barang berskala kecil hingga muatan kontainer berat.</p>
                  <p>TrukIn hadir memotong proses birokrasi tradisional, mengintegrasikan pengirim langsung dengan pengemudi armada terverifikasi di seluruh Indonesia. Dengan sistem lacak real-time, kami meniadakan kecemasan dan menghadirkan kepastian.</p>
                  <p>Filosofi kami adalah menghadirkan transparansi harga mutlak serta ketersediaan armada terjamin. Kami mendemokrasikan ranah logisktik nasional demi kemajuan perekonomian Indonesia Timur hingga Barat.</p>
                </div>
                
                <button 
                  onClick={() => onNavigate('register-customer')}
                  className="mt-8 flex items-center gap-2 text-[#C5FF00] font-black text-xs uppercase tracking-widest hover:text-white transition-all cursor-pointer"
                >
                  PELAJARI SELENGKAPNYA 
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* Armada Gallery Section */}
        <section id="armada" className="py-24 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <p className="text-xs font-mono tracking-[0.30em] text-[#C5FF00] mb-3">KAPABILITAS KAMI_</p>
                <h2 className="text-4xl font-black uppercase tracking-tight text-white">ARMADA TERVERIFIKASI &amp; AKTIF</h2>
              </div>
              <button 
                onClick={() => onNavigate('register-customer')}
                className="text-xs font-mono tracking-widest text-white/60 hover:text-[#C5FF00] flex items-center gap-2 transition-all uppercase"
              >
                Lihat semua tipe kendaraan
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Truck 1 */}
              <div className="group bg-[#121212] border border-white/10 overflow-hidden hover:border-[#C5FF00] transition-all duration-300">
                <div className="h-44 overflow-hidden bg-zinc-900 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZlnXzKBQrbb2j0GQRtjYbModwRzhKZ2Be-J8ygY_zUmPYSvIw3_Iub-8JNxyqjTtzN9PGVlxYIe3bXcyb8H9v2k2Anohzg3I0oBJNHNGyyU83m7u7dY6VoAYobQsABNNictsdQE3yeeHF_Z4NZdRtk_zzMKXasgt3SvH-EvDPn3qBxi89tpty8Stamvs66_nIbq7gK5aqK4rZ9jzwco8NmKaN6TaHPWJ0PfnkJ30IRiWcKpYChwh28fxF3_zxaYnUVtTLTRfouOE" 
                    alt="Semi-Trailer" 
                  />
                </div>
                <div className="p-6">
                  <h5 className="text-base font-black uppercase text-white mb-2">Semi-Trailer Berat</h5>
                  <p className="text-white/50 text-xs mb-6 flex items-center gap-1.5 font-mono">
                    <TrendingUp className="w-3.5 h-3.5 text-[#C5FF00]" /> 25 - 40 TON CAPACITY
                  </p>
                  <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-[#C5FF00] font-bold px-3 py-1.5 rounded-none uppercase tracking-wider block text-center">ANTAR PROVINSI</span>
                </div>
              </div>

              {/* Truck 2 */}
              <div className="group bg-[#121212] border border-white/10 overflow-hidden hover:border-[#C5FF00] transition-all duration-300">
                <div className="h-44 overflow-hidden bg-zinc-900 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcmryeplEx1cdzmExqZZVpYj_okupujyemsacI19hO_nJBCIaQPvimkSZnbyExL8zwtjyHAg1fOK56rk47BIy4bXGToVjBCjmdcqZLo2jKQmCZVcNeJ908Z820L_YqHGjB2Xjy-Aw2lui1S6QICog_YTn3R3FPXJcz9DZQUI7Ym4_AItagHP4FjLVFUgok25Gc059ncdsDyVz6-HQHxhw_P-NDUYsxRzrdGliwSE_BBzcMi9p_jigLmsPXM1vWTzjZWqoNB8ZvKgc" 
                    alt="Box Truck" 
                  />
                </div>
                <div className="p-6">
                  <h5 className="text-base font-black uppercase text-white mb-2">Truk Box Menengah</h5>
                  <p className="text-white/50 text-xs mb-6 flex items-center gap-1.5 font-mono">
                    <TrendingUp className="w-3.5 h-3.5 text-[#C5FF00]" /> 5 - 15 TON CAPACITY
                  </p>
                  <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-white font-bold px-3 py-1.5 rounded-none uppercase tracking-wider block text-center">PENGIRIMAN KOTA</span>
                </div>
              </div>

              {/* Truck 3 */}
              <div className="group bg-[#121212] border border-white/10 overflow-hidden hover:border-[#C5FF00] transition-all duration-300">
                <div className="h-44 overflow-hidden bg-zinc-900 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7hlcZfEP4LokLPVaUakfGnvrVWq0i3Hua4iPUOvtBUOXcvbQe5BUkZbIqjOgb5LLfXCeLbFiBlmcM-nI4Lo2yTuFZ9mXqdAcaGaLc-_UO3FY6_LK-48U1J05btKk6PVM5sHl-0PinKQ1TT5f4Jwgf3M11zLNRGOOzx6iWtXpUNLaN2b9LtLHBIZbKaBdm73WZCJAiMh8RV_0Oa3cWSdLV6euJHgB4MLSz2kznXh7gAmhz5tX1xpcNIM2kdqzI6N2k8syx5m_rFk" 
                    alt="Flatbed" 
                  />
                </div>
                <div className="p-6">
                  <h5 className="text-base font-black uppercase text-white mb-2">Flatbed Heavy</h5>
                  <p className="text-white/50 text-xs mb-6 flex items-center gap-1.5 font-mono">
                    <TrendingUp className="w-3.5 h-3.5 text-[#C5FF00]" /> 20 - 30 TON CAPACITY
                  </p>
                  <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-white font-bold px-3 py-1.5 rounded-none uppercase tracking-wider block text-center">SEKTOR KONSTRUKSI</span>
                </div>
              </div>

              {/* Truck 4 */}
              <div className="group bg-[#121212] border border-white/10 overflow-hidden hover:border-[#C5FF00] transition-all duration-300">
                <div className="h-44 overflow-hidden bg-zinc-900 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFap0bWybRAd6uZ_38BagWL3E2yh-Vwt4G8_rriA9JGNH_i_dfoTAJZ3BK6scQTNzWikOUTsVv2pJ_mwNAm2Yt9cPFYPKmbiMAfozz-BAmmW_LYdQJ5qyel2e1R4Na0xqQ2aL9bBFouKJfUnsoHUAY-OYKbg1FvfzPiupX2GohurT5s3GB0WTd9Wz4JO4VUWgFt7UrieFYPt34TsKfq8bIn4tDarKFvTqhRF8a5Xa-sd4N2PDs71GaipWYyiNK3VwOG3zPk1N6M1g" 
                    alt="Cold Chain" 
                  />
                </div>
                <div className="p-6">
                  <h5 className="text-base font-black uppercase text-white mb-2">Truk Berpendingin</h5>
                  <p className="text-white/50 text-xs mb-6 flex items-center gap-1.5 font-mono">
                    <TrendingUp className="w-3.5 h-3.5 text-[#C5FF00]" /> 10 - 20 TON CAPACITY
                  </p>
                  <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-white font-bold px-3 py-1.5 rounded-none uppercase tracking-wider block text-center">FROZEN FOODS COLD CHAIN</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Final CTA Container */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-[#121212] border border-white/15 p-12 md:p-24 text-center text-white relative overflow-hidden">
              
              {/* Grid Background overlay */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
              </div>

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight leading-none">REVOLUSI LOGISTIK DI TANGAN ANDA.</h2>
                <p className="text-white/70 text-sm mb-12 leading-relaxed">
                  Bergabunglah dengan ribuan pelaku usaha dan penyedia transportasi cerdas yang mengoptimalkan utilisasi armada harian bersama TrukIn.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button 
                    onClick={() => onNavigate('register-customer')}
                    className="bg-[#C5FF00] text-black px-12 py-5 font-black text-xs uppercase tracking-widest hover:bg-white transition-all cursor-pointer"
                  >
                    MULAI SEKARANG
                  </button>
                  <button 
                    onClick={() => onNavigate('register-partner')}
                    className="border border-white/20 text-white px-12 py-5 font-black text-xs uppercase tracking-widest hover:border-white transition-all cursor-pointer"
                  >
                    KEMITRAAN ARMADA
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer Area */}
      <footer className="bg-[#0A0A0A] border-t border-white/10 py-16 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
              <div className="text-xl font-black tracking-tighter uppercase mb-2">
                TRUKIN<span className="text-[#C5FF00]">_</span>
              </div>
              <p className="text-xs text-white/40 max-w-xs font-mono">
                &copy; 2026 TRUKIN LABS. ALL SYSTEM LOGS DISCIPLINED. SHIPPED WITH BOLD CRAFT.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-widest font-mono text-white/50">
              <a href="#" className="hover:text-white transition-colors">Ketentuan Layanan</a>
              <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition-colors">Karir</a>
              <a href="#" className="hover:text-white transition-colors">Bantuan Syarat</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
