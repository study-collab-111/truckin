/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  ShieldCheck, 
  Truck, 
  Package, 
  ChevronRight,
  LogOut,
  Compass,
  Briefcase,
  Play
} from 'lucide-react';
import { Booking, AppView, Account } from '../types';
import { Language, trans } from '../lib/translations';
import LanguageSwitcher from './LanguageSwitcher';

interface DashboardPartnerProps {
  bookings: Booking[];
  currentUser: Account | null;
  onAcceptBooking: (id: string) => void;
  onDeliveredBooking: (id: string) => void;
  onUpdateLocation: (id: string, location: string) => void;
  onNavigate: (view: AppView) => void;
  lang: Language;
  onSetLang: (lang: Language) => void;
}

export default function DashboardPartner({ 
  bookings, 
  currentUser,
  onAcceptBooking, 
  onDeliveredBooking,
  onUpdateLocation,
  onNavigate,
  lang,
  onSetLang
}: DashboardPartnerProps) {

  // State to hold custom string input per active cargo tracking item
  const [locations, setLocations] = useState<Record<string, string>>({});

  // Jobs that are currently WAITING ('MENUNGGU') are open for Mitra to claim
  const openCargos = useMemo(() => {
    return bookings.filter(b => b.status === 'MENUNGGU');
  }, [bookings]);

  // Jobs currently running ('DALAM PERJALANAN') that Mitra is carrying 
  const currentRunningJobs = useMemo(() => {
    return bookings.filter(b => b.status === 'DALAM PERJALANAN');
  }, [bookings]);

  // Historical completed jobs
  const completedJobs = useMemo(() => {
    return bookings.filter(b => b.status === 'SELESAI');
  }, [bookings]);

  // Calculate earnings
  const earnings = useMemo(() => {
    const totalRaw = completedJobs.reduce((sum, b) => {
      const strippedNum = parseInt(b.amount.replace(/[^0-9]/g, ''), 10) || 0;
      return sum + strippedNum;
    }, 0);

    // standard Mitra multiplier e.g. 85% split goes to driver, 15% to platform
    const driverEarningVal = totalRaw * 0.85;

    return {
      formatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(driverEarningVal),
      count: completedJobs.length
    };
  }, [completedJobs]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased selection:bg-[#C5FF00] selection:text-black">
      {/* Top Navbar */}
      <header className="bg-[#0A0A0A]/95 border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="bg-[#C5FF00] text-black font-mono font-black text-[9px] px-2.5 py-1 uppercase tracking-widest rounded-none">MITRA_CARRIER</span>
            <div className="text-lg font-black tracking-tighter uppercase select-none">
              TRUKIN<span className="text-[#C5FF00]">_</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <LanguageSwitcher currentLang={lang} onSetLang={onSetLang} />
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-1.5 text-xs font-mono tracking-wider text-white/60 hover:text-red-400 uppercase font-bold transition-all cursor-pointer bg-transparent border-0"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              {trans('keluarSesi', lang)}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Profile Station */}
        <section className="bg-[#121212] p-8 border border-white/10 mb-8 rounded-none">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img 
                  alt="Partner Profile Pic Arifin" 
                  className="w-16 h-16 rounded-none border border-[#C5FF00] object-cover grayscale brightness-110 shadow-md"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjw2uLJsubdvzSnTZOe1EGRJFUfeoTBrQzJevir_JkSI13taIqg7oBnUwIXP82k06XwY8P2VpwGvkSL8WrChR8N75Zqmyv8_1VLeNSNH_o4S25O4NS2htx29C-EX_kwIVn1wysAOfQEfJQM5A-tjEUmo01GeHB_xMYyPT4uj3BBd5g-VUUKkXbcUf_gdOm7BJHcrTMYy14FGQt7rwcMfkHgIigC1InX6VEW0KxwdMg1poACTRa8JvzGGCkFzbXbfUO_V2N2cqgfZo"
                />
                <span className="absolute bottom-1 right-0 bg-[#C5FF00] border-2 border-[#121212] w-3.5 h-3.5 rounded-full"></span>
              </div>
              <div>
                <h2 className="text-xl font-black uppercase text-white tracking-tight">{currentUser?.name || 'SAMSUL ARIFIN_'}</h2>
                <p className="text-xs font-mono text-white/50">
                  {currentUser?.email || 'samsul.arifin@trukinkarsa.com'} &bull; 
                  Plate: <span className="font-mono text-[#C5FF00] font-black">{currentUser?.plateNumber || 'B 9821 TKI'}</span> &bull; 
                  Class: {currentUser?.truckType || 'TRAILER'} &bull; 
                  Tel: {currentUser?.phoneNumber || '081398765432'}
                </p>
                <div className="flex items-center gap-2 mt-2 bg-[#C5FF00]/10 border border-[#C5FF00]/30 text-[#C5FF00] px-2.5 py-0.5 rounded-none text-[9px] w-fit font-mono font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> {lang === 'id' ? 'MITRA VERIFIKASI EMAS_' : 'GOLDEN TIER PARTNER_'}
                </div>
              </div>
            </div>

            {/* Stats list */}
            <div className="flex gap-4 md:gap-8 flex-wrap w-full md:w-auto">
              <div className="bg-black/50 border border-white/10 px-5 py-4 rounded-none flex-1 md:flex-initial min-w-[130px]">
                <p className="text-white/40 text-[9px] font-mono uppercase tracking-[0.2em]">{lang === 'id' ? 'MUATAN AKTIF' : 'ACTIVE CARGO'}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-[#C5FF00] font-mono">{currentRunningJobs.length}</span>
                  <span className="text-[10px] text-white/40 uppercase font-mono">{lang === 'id' ? 'Kerjaan' : 'Jobs'}</span>
                </div>
              </div>
              <div className="bg-black/50 border border-white/10 px-5 py-4 rounded-none flex-1 md:flex-initial min-w-[130px]">
                <p className="text-white/40 text-[9px] font-mono uppercase tracking-[0.2em]">{lang === 'id' ? 'TERKIRIM' : 'DELIVERED_LOG'}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-white font-mono">{earnings.count}</span>
                  <span className="text-[10px] text-white/40 uppercase font-mono">{lang === 'id' ? 'Selesai' : 'Done'}</span>
                </div>
              </div>
              <div className="bg-[#C5FF00] text-black px-6 py-4 rounded-none flex-1 md:flex-initial min-w-[190px]">
                <p className="text-black/60 text-[9px] font-mono font-black uppercase tracking-[0.2em]">{lang === 'id' ? 'PENDAPATAN DOMPET_' : 'MY BALANCE CREDITS_'}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black font-mono text-black whitespace-nowrap">{earnings.formatted}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Panel Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Available jobs market to pick up right now */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[#121212] p-8 border border-white/10 rounded-none">
              <div className="mb-6">
                <span className="text-[9px] font-mono text-[#C5FF00] uppercase tracking-[0.25em] block mb-1">REAL-TIME JOB MARKET_</span>
                <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#C5FF00]" />
                  {trans('bursaMuatanDaftar', lang)}
                </h3>
                <p className="text-xs font-mono text-white/50">{lang === 'id' ? 'Cari, pilih, & klaim kargo aktif terdekat yang siap diangkut' : 'Search, select, and claim active shipping cargos nearby'}</p>
              </div>

              {openCargos.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-none bg-black/40">
                  <Package className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="font-mono text-xs text-white/40 uppercase">{lang === 'id' ? 'BELUM ADA MUATAN TERSEDIA' : 'NO CARGO LOADS AVAILABLE RIGHT NOW'}</p>
                  <p className="text-[10px] text-white/30 font-mono mt-1">{lang === 'id' ? 'Gunakan portal Demo Pelanggan untuk menambah pesanan muatan baru.' : 'Use the Client Demo portal to post a cargo load contract.'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {openCargos.map(job => (
                    <div 
                      key={job.id}
                      className="bg-black/45 border border-white/5 hover:border-[#C5FF00] p-6 rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-300"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black bg-[#C5FF00]/10 border border-[#C5FF00]/30 text-[#C5FF00] px-2.5 py-1 rounded-none uppercase tracking-wider">{job.id}</span>
                          <span className="text-[10px] text-white/50 font-mono uppercase tracking-wider">{job.date}</span>
                        </div>
                        <div>
                          <h4 className="font-black text-sm uppercase text-white tracking-tight">{job.cargoDetail}</h4>
                          <div className="flex items-center gap-1.5 text-xs text-white/70 font-mono uppercase mt-1">
                            <span>{job.pickup}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#C5FF00]" />
                            <span>{job.destination}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest">
                          <span className="border border-white/10 px-2 py-0.5 rounded-none bg-white/5">
                            {job.truckType === 'TRUK BOKS' ? (lang === 'id' ? 'TRUK BOKS' : 'BOX TRUCK') : job.truckType}
                          </span>
                          <span>&bull;</span>
                          <span>{job.weight} TON</span>
                          <span>&bull;</span>
                          <span className="text-[#C5FF00] font-black">{job.priority === 'EKSPRES' ? (lang === 'id' ? 'EKSPRES' : 'EXPRESS') : (lang === 'id' ? 'STANDAR' : 'STANDARD')}</span>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-end justify-between w-full md:w-auto border-t md:border-t-0 border-white/10 pt-4 md:pt-0 gap-4">
                        <div className="text-right font-mono">
                          <p className="text-[9px] text-white/40 uppercase tracking-wider">{lang === 'id' ? 'BAGIAN DRIVER (85%)' : 'DRIVER SHARE (85%)'}</p>
                          <p className="text-base font-black text-[#C5FF00]">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                              (parseInt(job.amount.replace(/[^0-9]/g, ''), 10) || 0) * 0.85
                            )}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => onAcceptBooking(job.id)}
                          className="bg-[#C5FF00] hover:bg-white text-black text-xs font-black px-5 py-3 rounded-none cursor-pointer flex items-center gap-2 uppercase tracking-widest transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-black" />
                          {trans('ambilMuatanBtn', lang)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Active Transits telemetry and list reports */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Active shipping tasks carrying */}
            <div className="bg-[#121212] p-8 border border-white/10 rounded-none">
              <div className="mb-6">
                <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest block mb-1">IN-TRANSIT TASKS_</span>
                <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#C5FF00]" />
                  {lang === 'id' ? 'JALUR ANGKUT AKTIF' : 'ACTIVE CONVEYANCE ROUTE'} ({currentRunningJobs.length})_
                </h3>
                <p className="text-xs font-mono text-white/50">{lang === 'id' ? 'Perbarui posisi Anda secara berkala lewat laporan tempat berikut.' : 'Regularly keep shippers informed by writing location status below.'}</p>
              </div>

              {currentRunningJobs.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-none bg-black/40">
                  <Compass className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="font-mono text-xs text-white/40 uppercase">{lang === 'id' ? 'TIDAK ADA MUATAN KONTRAK AKTIF' : 'NO CARGO CONTRACT COMMITTED'}</p>
                  <p className="text-[10px] text-white/30 font-mono mt-1">{lang === 'id' ? 'Gunakan Bursa Muatan untuk mengambil kargo!' : 'Claim loads from the cargo marketplace to get started!'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentRunningJobs.map(job => (
                    <div 
                      key={job.id}
                      className="bg-indigo-950/15 border border-indigo-500/30 p-5 rounded-none space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-full">
                          <span className="font-mono text-[10px] font-black bg-indigo-500/10 border border-indigo-500/40 text-indigo-400 px-2.5 py-1 rounded-none uppercase">{job.id}</span>
                          <h5 className="font-black text-sm uppercase tracking-tight text-white mt-3">{job.cargoDetail}</h5>
                          <p className="text-xs font-mono text-white/55 mt-1">{job.pickup} &rarr; {job.destination}</p>
                        </div>
                      </div>

                      {/* Driver input location text (New active telemetry) */}
                      <div className="bg-black/60 p-4 border border-indigo-500/20 space-y-2">
                        <label className="block text-[8px] font-mono uppercase tracking-widest text-[#C5FF00] font-black">
                          {lang === 'id' ? 'INPUT POSISI LOKASI TERKINI_' : 'SUBMIT CURRENT TRANSIT LOCATION_'}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input 
                            type="text"
                            placeholder={lang === 'id' ? "Contoh: Bongkar muat / Exit Tol Cikampek" : "e.g., Transit / Highway Km 52 Rest Spot"}
                            value={locations[job.id] !== undefined ? locations[job.id] : (job.currentLocation || '')}
                            onChange={(e) => setLocations(prev => ({ ...prev, [job.id]: e.target.value }))}
                            className="flex-1 bg-black text-xs font-mono p-2 border-y border-x border-white/15 focus:border-[#C5FF00] text-white outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const val = locations[job.id] !== undefined ? locations[job.id] : (job.currentLocation || '');
                              onUpdateLocation(job.id, val.trim() || 'Rest area / Rest transit');
                              alert(lang === 'id' ? `Titik Lokasi ${job.id} Berhasil Diperbarui!` : `Location spot for ${job.id} successfully updated!`);
                            }}
                            className="bg-[#C5FF00] text-black hover:bg-white font-mono font-bold text-[9px] uppercase px-3 py-2 rounded-none transition-all cursor-pointer border-0"
                          >
                            {lang === 'id' ? 'SIMPAN' : 'SAVE'}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-white/10">
                        <div>
                          <p className="text-[9px] font-mono text-white/40 uppercase tracking-wider">{lang === 'id' ? 'BAYARAN DI ALAMAT TUJUAN_' : 'PAYOUT ON ARRIVAL_'}</p>
                          <p className="text-sm font-black text-[#C5FF00] font-mono">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                              (parseInt(job.amount.replace(/[^0-9]/g, ''), 10) || 0) * 0.85
                            )}
                          </p>
                        </div>

                        <button
                          onClick={() => onDeliveredBooking(job.id)}
                          className="bg-[#C5FF00] hover:bg-white text-black font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-none flex items-center gap-1 cursor-pointer transition-all border-0"
                        >
                          <Check className="w-4 h-4" />
                          {trans('selesaiKirimBtn', lang)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
