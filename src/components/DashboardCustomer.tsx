/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  Trash2, 
  ChevronRight,
  LogOut,
  Sparkles,
  Zap,
  Package,
  Calendar
} from 'lucide-react';
import { Booking, AppView, Account } from '../types';
import { Language, trans } from '../lib/translations';
import LanguageSwitcher from './LanguageSwitcher';

interface DashboardCustomerProps {
  bookings: Booking[];
  currentUser: Account | null;
  onAddBooking: (booking: Booking) => void;
  onDeleteBooking: (id: string) => void;
  onNavigate: (view: AppView) => void;
  lang: Language;
  onSetLang: (lang: Language) => void;
}

export default function DashboardCustomer({ 
  bookings, 
  currentUser,
  onAddBooking, 
  onDeleteBooking,
  onNavigate,
  lang,
  onSetLang
}: DashboardCustomerProps) {
  
  // Create state for new booking form
  const [pickup, setPickup] = useState('Jakarta Barat (DC)');
  const [destination, setDestination] = useState('Surabaya Hub Center');
  const [cargoDetail, setCargoDetail] = useState('');
  const [weight, setWeight] = useState(10);
  const [priority, setPriority] = useState<'STANDAR' | 'EKSPRES'>('STANDAR');
  const [truckType, setTruckType] = useState<Booking['truckType']>('TRUK BOKS');
  const [date, setDate] = useState('2026-05-26');
  
  // Search / Filter states
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'MENUNGGU' | 'DALAM PERJALANAN' | 'SELESAI'>('ALL');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto quotation calculations based on form fields
  const quoteAmount = useMemo(() => {
    let base = 500000;
    // factor pickup to destination length estimation
    if (destination.toLowerCase().includes('surabaya')) base += 2500000;
    else if (destination.toLowerCase().includes('semarang')) base += 1500000;
    else if (destination.toLowerCase().includes('bandung')) base += 750000;
    
    // truck scale multiplier
    if (truckType === 'TRAILER') base += 2000000;
    else if (truckType === 'TRUK PENDINGIN') base += 1200000;
    else if (truckType === 'BAK TERBUKA') base += 600000;
    
    // priority overhead
    if (priority === 'EKSPRES') base += 850000;
    
    // Weight overhead: 150k IDR per ton
    base += weight * 150000;
    
    return base;
  }, [destination, truckType, priority, weight]);

  const formattedQuote = useMemo(() => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(quoteAmount);
  }, [quoteAmount]);

  // Submit new booking
  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!pickup.trim()) {
      alert(lang === 'id' ? 'Tulis rute pengiriman asal Anda.' : 'Please type your pickup delivery origin.');
      return;
    }
    if (!destination.trim()) {
      alert(lang === 'id' ? 'Tulis rute tujuan pengiriman Anda.' : 'Please type your shipping destination.');
      return;
    }
    if (!cargoDetail) {
      alert(lang === 'id' ? 'Tulis detail kargo atau muatan Anda.' : 'Please specify cargo or load details.');
      return;
    }

    const uniqueId = `#TK-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedDateString = new Date(date).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const newBooking: Booking = {
      id: uniqueId,
      pickup: pickup.trim(),
      destination: destination.trim(),
      cargoDetail,
      weight,
      priority,
      truckType,
      date: formattedDateString,
      amount: formattedQuote,
      status: 'MENUNGGU'
    };

    onAddBooking(newBooking);
    setCargoDetail('');
    setSuccessMsg(lang === 'id' ? `Pemesanan Truk ${uniqueId} Berhasil Dibuat!` : `Truck booking ${uniqueId} successful!`);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  // Filtered list
  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  // KPI Calculations
  const stats = useMemo(() => {
    const totalSpentValue = bookings.reduce((sum, b) => {
      const strippedNum = parseInt(b.amount.replace(/[^0-9]/g, ''), 10) || 0;
      return sum + strippedNum;
    }, 0);

    const formattedActiveMoney = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalSpentValue);

    return {
      active: bookings.filter(b => b.status === 'DALAM PERJALANAN').length,
      waiting: bookings.filter(b => b.status === 'MENUNGGU').length,
      totalMoney: formattedActiveMoney
    };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased selection:bg-[#C5FF00] selection:text-black">
      {/* Top Console Navigation Bar */}
      <header className="bg-[#0A0A0A]/95 border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="bg-[#C5FF00] text-black font-mono font-black text-[9px] px-2.5 py-1 uppercase tracking-widest rounded-none">CUSTOMER_PORTAL</span>
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
        
        {/* Profile Card Header */}
        <section className="bg-[#121212] p-8 border border-white/15 mb-8 rounded-none">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img 
                  alt="Customer Profile Rivera" 
                  className="w-16 h-16 rounded-none border border-[#C5FF00] object-cover grayscale brightness-110 shadow-md"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7F30ho-fnUshbPEanhBHeHq26LZGr5d-u6RTz_8wgbOpu6yNEI18iA1v34SiwWFSpFq0xGBOaDu4m-4HXfYxI6W5dWULmD85UQwkwXpWO0aNukTbj4Vl1VD0KCPkuJhThppqC9GdHuVsourTsJeVbGSLOLuMq7yhdlU4CPulJ279CYmNOKeZsoGHGzLIcd1nsZpHmnkfZR9JtCowQZ6U0PRTwIcUdWPSvuhH7XsZlP60J-OiEQjs8fDYM6BzFmHpVTgv9a8qu-vw"
                />
                <span className="absolute bottom-1 right-0 bg-[#C5FF00] border-2 border-[#121212] w-3.5 h-3.5 rounded-full"></span>
              </div>
              <div>
                <h2 className="text-xl font-black uppercase text-white tracking-tight">{currentUser?.name || 'ALEX RIVERA_'}</h2>
                <p className="text-xs font-mono text-white/50">
                  {currentUser?.email || 'alex.rivera@globalstore.id'} &bull; 
                  Tel: {currentUser?.phoneNumber || '08123456789'} &bull; 
                  {lang === 'id' ? 'Lokasi' : 'Base'}: {currentUser?.city || 'Jakarta Barat'}
                </p>
                <div className="flex items-center gap-2 mt-2 bg-[#C5FF00]/10 border border-[#C5FF00]/30 text-[#C5FF00] px-2.5 py-0.5 rounded-none text-[9px] w-fit font-mono font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> {lang === 'id' ? 'Akun Terverifikasi' : 'Verified Merchant Account'}
                </div>
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="flex gap-4 md:gap-8 flex-wrap w-full md:w-auto">
              <div className="bg-black/50 border border-white/10 px-5 py-4 rounded-none flex-1 md:flex-initial min-w-[130px]">
                <p className="text-white/40 text-[9px] font-mono uppercase tracking-[0.2em]">{trans('onDeliveryKpi', lang)}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-white font-mono">{stats.active}</span>
                  <span className="text-[10px] text-white/40 uppercase font-mono">{lang === 'id' ? 'TRUK' : 'TRUCKS'}</span>
                </div>
              </div>
              <div className="bg-black/50 border border-white/10 px-5 py-4 rounded-none flex-1 md:flex-initial min-w-[130px]">
                <p className="text-white/40 text-[9px] font-mono uppercase tracking-[0.2em]">QUEUE PO</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-[#C5FF00] font-mono">{stats.waiting}</span>
                  <span className="text-[10px] text-white/40 uppercase font-mono">{lang === 'id' ? 'Tunda' : 'HOLD'}</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 text-white px-5 py-4 rounded-none flex-1 md:flex-initial min-w-[180px]">
                <p className="text-[#C5FF00] text-[9px] font-mono uppercase tracking-[0.2em] font-black">{lang === 'id' ? 'TOTAL PENGELUARAN_' : 'TOTAL EXPENSE_'}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black font-mono text-white tracking-tight whitespace-nowrap">{stats.totalMoney}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Booking Core System Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Fast Ordering Station Panel */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#121212] p-8 border border-white/10 rounded-none relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#C5FF00] text-black font-mono font-black text-[9px] px-4 py-2 uppercase tracking-widest flex items-center gap-1 rounded-none">
                <Sparkles className="w-3 h-3" />
                INSTANT
              </div>
              
              <h3 className="text-lg font-black uppercase text-white mb-6 flex items-center gap-2 tracking-tight">
                <Plus className="w-5 h-5 text-[#C5FF00]" />
                {trans('pesanArmadaBaru', lang)}
              </h3>

              {successMsg && (
                <div className="bg-[#C5FF00]/10 text-[#C5FF00] border border-[#C5FF00]/40 p-4 rounded-none text-xs font-mono mb-6 flex items-center gap-2 animate-pulse">
                  <ShieldCheck className="w-4 h-4" />
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Route specs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider text-white/50 mb-1">{trans('rutePengirimanAsal', lang)}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5FF00]" />
                      <input
                        type="text"
                        placeholder="Contoh: Jakarta DC"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="w-full bg-black/60 text-xs font-bold font-mono uppercase py-3.5 pl-10 pr-4 border border-white/10 outline-none rounded-none focus:border-[#C5FF00] text-white placeholder-white/20"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider text-white/50 mb-1">{trans('ruteTujuan', lang)}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                      <input
                        type="text"
                        placeholder="Contoh: Surabaya Hub"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-black/60 text-xs font-bold font-mono uppercase py-3.5 pl-10 pr-4 border border-white/10 outline-none rounded-none focus:border-[#C5FF00] text-white placeholder-white/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Cargo Details */}
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-white/50 mb-1">{trans('detailMuatanCargo', lang)}</label>
                  <div className="relative">
                    <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      placeholder="e.g. Suku Cadang Elektronik / Farmasi"
                      value={cargoDetail}
                      onChange={(e) => setCargoDetail(e.target.value)}
                      className="w-full bg-black/60 text-xs font-medium py-3.5 pl-10 pr-4 border border-white/10 rounded-none outline-none focus:border-[#C5FF00] text-white placeholder-white/20"
                    />
                  </div>
                </div>

                {/* Weight in Tons */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] font-mono uppercase tracking-wider text-white/50">{trans('beratKargoTonnase', lang)}</label>
                    <span className="text-xs font-black font-mono text-[#C5FF00] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-none">{weight} TON</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="45"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-black rounded-none cursor-pointer accent-[#C5FF00]"
                  />
                </div>

                {/* Truck specifications */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider text-white/50 mb-1">{trans('jenisLayananTruk', lang)}</label>
                    <div className="relative">
                      <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <select
                        value={truckType}
                        onChange={(e) => setTruckType(e.target.value as Booking['truckType'])}
                        className="w-full bg-black/60 text-xs font-bold font-mono py-3.5 pl-10 pr-4 border border-white/10 rounded-none appearance-none cursor-pointer"
                      >
                        <option value="TRUK BOKS">{lang === 'id' ? 'TRUK BOKS' : 'BOX TRUCK'}</option>
                        <option value="TRAILER">{lang === 'id' ? 'TRAILER CONTAINER' : 'TRAILER CONTAINER'}</option>
                        <option value="BAK TERBUKA">{lang === 'id' ? 'BAK TERBUKA/FLAT' : 'FLATBED CARRIER'}</option>
                        <option value="TRUK PENDINGIN">{lang === 'id' ? 'TRUK BERPENDINGIN' : 'REFRIGERATED TRUCK'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider text-white/50 mb-1">{trans('prioritasKiriman', lang)}</label>
                    <div className="flex bg-black p-1 border border-white/10 rounded-none">
                      <button
                        type="button"
                        onClick={() => setPriority('STANDAR')}
                        className={`flex-1 text-[9px] font-black py-2 rounded-none transition-all cursor-pointer ${
                          priority === 'STANDAR' 
                            ? 'bg-white text-black font-bold' 
                            : 'text-white/60'
                        }`}
                      >
                        {lang === 'id' ? 'STANDAR' : 'STANDARD'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriority('EKSPRES')}
                        className={`flex-1 text-[9px] font-black py-2 rounded-none transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          priority === 'EKSPRES' 
                            ? 'bg-[#C5FF00] text-black font-bold' 
                            : 'text-white/60'
                        }`}
                      >
                        <Zap className="w-3 h-3" />
                        {lang === 'id' ? 'EKSPRES' : 'EXPRESS'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-white/50 mb-1">{trans('metodePengiriman', lang)}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-black/60 text-xs font-mono font-bold py-3.5 pl-10 pr-4 border border-white/10 rounded-none outline-none focus:border-[#C5FF00]"
                    />
                  </div>
                </div>

                {/* Live Estimator Display */}
                <div className="bg-black/80 rounded-none p-5 border border-white/15 mt-6">
                  <span className="text-[9px] font-mono tracking-widest uppercase text-white/40 block mb-1">{trans('estimasiTarifInstan', lang)}_</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-black text-[#C5FF00] font-mono">{formattedQuote}</span>
                    <span className="text-[9px] text-white/60 font-mono tracking-wider border border-white/10 px-2 py-0.5 rounded-none">ALL IN</span>
                  </div>
                  <span className="text-[9px] text-white/50 mt-1.5 block leading-tight font-mono">{lang === 'id' ? 'Biaya fix termasuk BBM, tol, asuransi penuh, pengawal operasional.' : 'Fixed cost includes fuel, tolls, full cargo insurance, driver allowance.'}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C5FF00] text-black py-4.5 rounded-none font-black text-xs uppercase tracking-widest hover:bg-white cursor-pointer flex justify-center items-center gap-2 mt-4"
                >
                  <Plus className="w-4 h-4" />
                  {trans('kirimOrderBtn', lang)}_
                </button>
              </form>

            </div>
          </div>

          {/* RIGHT: Active Bookings Listing & Live Text tracking Telemetry */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Live Text Telemetry Panel */}
            <div className="bg-[#121212] p-6 border border-white/10 rounded-none">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h4 className="font-black text-sm uppercase text-white tracking-tight">{lang === 'id' ? 'STATUS PELACAKAN JALAN AKTIF_' : 'ACTIVE TRANSIT TELEMETRY_'}</h4>
                  <p className="text-[10px] font-mono text-white/50">{lang === 'id' ? 'Laporan posisi riil kontainer terupdate langsung dari supir armada' : 'Real-time transit feedback stream logged directly by the carrier crew'}</p>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5FF00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5FF00]"></span>
                </span>
              </div>
              
              <div className="space-y-4">
                {bookings.filter(b => b.status === 'DALAM PERJALANAN').length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-white/10 rounded-none bg-black/30">
                    <Truck className="w-8 h-8 text-white/20 mx-auto mb-2" />
                    <p className="font-mono text-xs text-white/40 uppercase">{lang === 'id' ? 'TIDAK ADA JADWAL JALAN SEKARANG' : 'NO CARRIERS ENGAGED CURRENTLY'}</p>
                    <p className="text-[10px] text-white/30 font-mono mt-0.5">{lang === 'id' ? 'Semua pengiriman selesai atau sedang dalam jadwal antrean.' : 'All shipments are completed or waiting in queue.'}</p>
                  </div>
                ) : (
                  bookings.filter(b => b.status === 'DALAM PERJALANAN').map(b => (
                    <div key={b.id} className="bg-black/55 border-l-2 border-[#C5FF00] border-y border-r border-white/5 p-4 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] font-black bg-[#C5FF00]/10 border border-[#C5FF00]/30 text-[#C5FF00] px-2 py-0.5 tracking-wider">{b.id}</span>
                        <span className="text-[9px] text-[#C5FF00] font-mono flex items-center gap-1 uppercase">
                          <span className="inline-block w-1.5 h-1.5 bg-[#C5FF00] rounded-full animate-ping"></span>
                          LIVE STATUS
                        </span>
                      </div>
                      <div>
                        <h5 className="font-black text-xs uppercase text-white">{b.cargoDetail}</h5>
                        <p className="text-[10px] font-mono text-white/60 uppercase mt-0.5">{b.pickup} &rarr; {b.destination}</p>
                      </div>
                      <div className="bg-white/[0.03] p-3 border border-white/5">
                        <span className="text-[8px] font-mono text-white/40 block uppercase tracking-wider mb-1">{lang === 'id' ? 'KETERANGAN TEMPAT TERKINI (DURASI JALAN):' : 'GPS TRANSMISSION POINT FEEDBACK:'}</span>
                        <p className="text-xs text-[#C5FF00] font-mono font-bold">{b.currentLocation || (lang === 'id' ? "Menunggu pembaruan lokasi dari supir." : "Waiting driver feedback update.")}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* List block */}
            <div className="bg-[#121212] p-8 border border-white/10 rounded-none">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-white">{trans('daftarPemesananAktif', lang)}</h3>
                  <p className="text-xs font-mono text-white/50">{lang === 'id' ? 'Log status logistik riwayat muatan kargo Anda' : 'Complete historic cargo shipping and billing ledger'}</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-1 bg-black p-1 rounded-none border border-white/10">
                  {(['ALL', 'MENUNGGU', 'DALAM PERJALANAN', 'SELESAI'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`text-[9px] font-black font-mono tracking-wider px-3 py-1.5 rounded-none transition-all cursor-pointer uppercase ${
                        filterStatus === st 
                          ? 'bg-[#C5FF00] text-black font-bold' 
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {st === 'ALL' ? (lang === 'id' ? 'SEMUA_LOG' : 'ALL_HISTORY') : (st === 'MENUNGGU' ? trans('statusMenunggu', lang) : st === 'DALAM PERJALANAN' ? trans('statusDalamPerjalanan', lang) : trans('statusSelesai', lang))}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid content container */}
              <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-none bg-black/40">
                    <Truck className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="font-mono text-xs text-white/40 uppercase">{lang === 'id' ? 'TIDAK ADA JADWAL PEMESANAN AKTIF' : 'NO RECORD MATCHING SELECTION'}</p>
                  </div>
                ) : (
                  filteredBookings.map((b) => (
                    <div 
                      key={b.id}
                      className="group bg-black/40 hover:bg-black/80 border border-white/5 hover:border-[#C5FF00] p-6 rounded-none transition-all duration-300 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                      {/* Left: Metadata & Route info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] font-black bg-[#C5FF00]/10 border border-[#C5FF00]/30 text-[#C5FF00] px-2.5 py-1 rounded-none uppercase tracking-wider">{b.id}</span>
                          <span className="text-[10px] text-white/50 font-mono uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#C5FF00]" /> {b.date}
                          </span>
                        </div>

                        <div>
                          <h5 className="font-black text-sm uppercase text-white tracking-tight">{b.cargoDetail}</h5>
                          <div className="flex items-center gap-1.5 text-xs text-white/70 mt-1 uppercase font-mono font-medium">
                            <span>{b.pickup}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#C5FF00]" />
                            <span>{b.destination}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest">
                          <span className="border border-white/10 px-2.5 py-1 rounded-none bg-white/5 text-white/70">
                            {b.truckType === 'TRUK BOKS' ? (lang === 'id' ? 'TRUK BOKS' : 'BOX TRUCK') : b.truckType === 'TRAILER' ? 'TRAILER' : b.truckType === 'BAK TERBUKA' ? (lang === 'id' ? 'BAK TERBUKA' : 'FLATBED') : (lang === 'id' ? 'COLD CHAIN BERPENDINGIN' : 'REFRIGERATED COLD TRUCK')}
                          </span>
                          <span>&bull;</span>
                          <span className="text-white/70">{b.weight} TON</span>
                          <span>&bull;</span>
                          <span className={`border px-2 py-0.5 rounded-none font-black ${b.priority === 'EKSPRES' ? 'bg-[#C5FF00]/5 border-[#C5FF00]/30 text-[#C5FF00]' : 'border-white/10 bg-white/5 text-white/50'}`}>
                            {b.priority === 'EKSPRES' ? (lang === 'id' ? 'EKSPRES' : 'EXPRESS') : (lang === 'id' ? 'STANDAR' : 'STANDARD')}
                          </span>
                        </div>

                        {/* Text Location Display (Reported dynamically by drivers) */}
                        {b.status !== 'MENUNGGU' && (
                          <div className="mt-4 pt-3 border-t border-white/10 bg-white/[0.02] p-3 border-l-2 border-[#C5FF00]/50">
                            <span className="text-[8px] font-mono text-[#C5FF00] uppercase tracking-widest block mb-1">{trans('posisiLacak', lang)}_</span>
                            <p className="text-xs text-white/95 font-mono font-bold">
                              {b.currentLocation || (b.status === 'SELESAI' ? (lang === 'id' ? 'Kargo telah berhasil dibongkar di tujuan.' : 'Cargo successfully discharged at facility.') : (lang === 'id' ? 'Armada sedang berangkat, menunggu pembaruan lokasi.' : 'Carrier crew in transit, pending telemetry signal.'))}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right: Pricing, Status & Quick actions */}
                      <div className="flex md:flex-col items-end justify-between w-full md:w-auto h-full border-t md:border-t-0 border-white/10 pt-4 md:pt-0 gap-4">
                        <div className="text-right">
                          <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">{lang === 'id' ? 'KONTRAK FIXED_' : 'FLAT CONTRACT_'}</p>
                          <p className="text-base font-black text-[#C5FF00] font-mono">{b.amount}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Status Pill */}
                          <span className={`text-[9px] font-black font-mono px-3 py-1 rounded-none border uppercase tracking-wider ${
                            b.status === 'SELESAI' 
                              ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30' 
                              : b.status === 'DALAM PERJALANAN' 
                                ? 'bg-indigo-950/30 text-indigo-400 border-indigo-500/30' 
                                : 'bg-amber-950/30 text-[#C5FF00] border-[#C5FF00]/30'
                          }`}>
                            {b.status === 'MENUNGGU' ? trans('statusMenunggu', lang) : b.status === 'DALAM PERJALANAN' ? trans('statusDalamPerjalanan', lang) : trans('statusSelesai', lang)}
                          </span>

                          {/* Allow cancel if WAITING MENUNGGU */}
                          {b.status === 'MENUNGGU' && (
                            <button
                              onClick={() => onDeleteBooking(b.id)}
                              className="p-1.5 text-red-400 hover:bg-red-950/50 hover:text-red-300 border border-transparent hover:border-red-900/30 rounded-none transition-all cursor-pointer bg-transparent"
                              title={lang === 'id' ? 'Batalkan Booking' : 'Cancel Booking'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
