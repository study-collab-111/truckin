/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  MapPin, 
  Trash2, 
  ChevronRight, 
  LogOut, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Truck, 
  Activity,
  Plus
} from 'lucide-react';
import { Booking, SystemAlert, AppView, Account } from '../types';

interface DashboardAdminProps {
  bookings: Booking[];
  currentUser: Account | null;
  onUpdateBookingStatus: (id: string, nextStatus: Booking['status']) => void;
  onDeleteBooking: (id: string) => void;
  onNavigate: (view: AppView) => void;
}

export default function DashboardAdmin({ 
  bookings, 
  currentUser,
  onUpdateBookingStatus, 
  onDeleteBooking,
  onNavigate 
}: DashboardAdminProps) {
  
  // Custom alerts queue in Command Room 
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: 'alt-01',
      type: 'critical',
      title: 'KEMACETAN EKSTRIM TOL CIPALI KM 102',
      message: 'Estimasi perlambatan keterlambatan pengiriman rute Jakarta-Surabaya sekitar +45 Menit.',
      time: '15 MENIT LALU'
    },
    {
      id: 'alt-02',
      type: 'info',
      title: 'PENGISIAN BAHAN BAKAR TERPADU JKI',
      message: 'Diskon avtur solar subsidi mitra TrukIn di rest area Pertamina KM 45 divalidasi.',
      time: '1 JAM LALU'
    }
  ]);

  // Mock pending drivers list for verification
  const [pendingDrivers, setPendingDrivers] = useState([
    { id: 'drv-01', name: 'Budiman Santoso', plate: 'D 4410 ABK', type: 'TRUK BOKS', status: 'PENDING' },
    { id: 'drv-02', name: 'Rahmat Hidayat', plate: 'L 9022 UY', type: 'TRAILER', status: 'PENDING' }
  ]);

  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeMsg, setNewNoticeMsg] = useState('');

  // Handle posting new alert
  const handlePostNotice = (e: FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeMsg) return;

    const newAlert: SystemAlert = {
      id: `alt-${Math.floor(100 + Math.random() * 900)}`,
      type: 'critical',
      title: newNoticeTitle.toUpperCase(),
      message: newNoticeMsg,
      time: 'BARU SAJA'
    };

    setAlerts([newAlert, ...alerts]);
    setNewNoticeTitle('');
    setNewNoticeMsg('');
  };

  // Resolve Alerts
  const handleResolveAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  // Approve driver
  const handleApproveDriver = (id: string) => {
    setPendingDrivers(pendingDrivers.map(d => {
      if (d.id === id) return { ...d, status: 'APPROVED' };
      return d;
    }));
  };

  // KPI aggregates
  const stats = useMemo(() => {
    const totalRaw = bookings.reduce((sum, b) => {
      const strippedNum = parseInt(b.amount.replace(/[^0-9]/g, ''), 10) || 0;
      return sum + strippedNum;
    }, 0);

    const formattedTotalTurnover = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalRaw);

    return {
      totalJobs: bookings.length,
      activeJobs: bookings.filter(b => b.status === 'DALAM PERJALANAN').length,
      transitIncome: formattedTotalTurnover,
      pendingVerificationsCount: pendingDrivers.filter(d => d.status === 'PENDING').length
    };
  }, [bookings, pendingDrivers]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased selection:bg-[#C5FF00] selection:text-black">
      {/* Admin Panel Header */}
      <header className="bg-[#0A0A0A]/95 border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="bg-red-950/40 border border-red-500/30 text-red-500 px-2.5 py-1 font-mono font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 rounded-none">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> {currentUser?.name?.toUpperCase() || 'SYSTEM_ADMIN_'}
            </span>
            <div className="text-lg font-black tracking-tighter uppercase select-none">
              TRUKIN<span className="text-[#C5FF00]">_</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-1.5 text-xs font-mono tracking-wider text-white/60 hover:text-red-400 uppercase font-black transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              Keluar Konsol
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Dynamic KPI Block */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-[#121212] border border-white/10 p-6 rounded-none relative overflow-hidden">
            <div className="text-white/40 text-[9px] font-mono uppercase tracking-[0.2em] mb-2">Platform Turnover</div>
            <div className="text-2xl font-black font-mono text-[#C5FF00] whitespace-nowrap">{stats.transitIncome}</div>
            <div className="w-1 h-full bg-[#C5FF00] absolute left-0 top-0"></div>
          </div>

          <div className="bg-[#121212] border border-white/10 p-6 rounded-none relative overflow-hidden">
            <div className="text-white/40 text-[9px] font-mono uppercase tracking-[0.2em] mb-2">Total Logistics Load</div>
            <div className="text-3xl font-black font-mono text-white">{stats.totalJobs} <span className="text-xs font-mono text-white/40 font-normal">Jobs</span></div>
            <div className="w-1 h-full bg-white/20 absolute left-0 top-0"></div>
          </div>

          <div className="bg-[#121212] border border-white/10 p-6 rounded-none relative overflow-hidden">
            <div className="text-white/40 text-[9px] font-mono uppercase tracking-[0.2em] mb-2">Active Fleet</div>
            <div className="text-3xl font-black font-mono text-indigo-400">{stats.activeJobs} <span className="text-xs font-mono text-white/40 font-normal">Trks</span></div>
            <div className="w-1 h-full bg-indigo-500 absolute left-0 top-0"></div>
          </div>

          <div className="bg-[#121212] border border-white/10 p-6 rounded-none relative overflow-hidden">
            <div className="text-white/40 text-[9px] font-mono uppercase tracking-[0.2em] mb-2">Pending Driver Approvals</div>
            <div className="text-3xl font-black font-mono text-rose-500">{stats.pendingVerificationsCount} <span className="text-xs font-mono text-white/40 font-normal">Hold</span></div>
            <div className="w-1 h-full bg-rose-500 absolute left-0 top-0"></div>
          </div>

        </section>

        {/* Command center master grids */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Grid Panel: Global fleet radar map and central alert queue */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* National Central Activity Logs (Replaces Map Tracking) */}
            <div className="bg-[#121212] p-6 border border-white/10 rounded-none">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-black text-sm uppercase text-white tracking-tight">LOG AKTIVITAS OPERASIONAL_</h4>
                  <p className="text-[10px] font-mono text-white/50">Audit jejak pos logistik armada real-time</p>
                </div>
                <div className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5FF00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C5FF00]"></span>
                </div>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {bookings.length === 0 ? (
                  <p className="text-xs text-white/30 font-mono py-6 text-center">Belum ada kontrak rute logistik aktif.</p>
                ) : (
                  bookings.map(b => (
                    <div key={b.id} className="bg-black/45 p-3 border border-white/5 text-[10px] font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#C5FF00] font-black">{b.id}</span>
                        <span className="text-white/40">{b.date}</span>
                      </div>
                      <p className="text-white/60 leading-none">STATUS: <span className={`font-bold ${b.status === 'SELESAI' ? 'text-emerald-400' : b.status === "DALAM PERJALANAN" ? 'text-indigo-400' : 'text-amber-400'}`}>{b.status}</span></p>
                      <p className="text-white/50 leading-tight mt-0.5">POSISI: <span className="text-white/85 font-medium">{b.currentLocation || 'Menunggu keputusan supir'}</span></p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Broadcast notices to Logistics drivers */}
            <div className="bg-[#121212] p-8 border border-white/10 rounded-none">
              <h4 className="font-black text-sm uppercase text-white tracking-tight mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-500" />
                SIARKAN INFO MITRA DRIVER_
              </h4>
              <form onSubmit={handlePostNotice} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-white/50 mb-1.5">Judul Informasi</label>
                  <input
                    type="text"
                    placeholder="e.g. Pembatasan ODOL Pelabuhan Merak"
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    className="w-full bg-black/60 text-xs font-mono font-medium py-3.5 px-4 rounded-none border border-white/10 outline-none focus:border-[#C5FF00] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-white/50 mb-1.5">Isi Informasi Detail</label>
                  <textarea
                    rows={2}
                    placeholder="Tulis instruksi berkendara aman atau kabar perbaikan jembatan timbang."
                    value={newNoticeMsg}
                    onChange={(e) => setNewNoticeMsg(e.target.value)}
                    className="w-full bg-black/60 text-xs font-medium py-3.5 px-4 rounded-none border border-white/10 outline-none focus:border-[#C5FF00] text-white resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#C5FF00] hover:bg-white text-black font-black text-xs uppercase tracking-widest py-3.5 rounded-none flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> KIRIM BROADCAST_
                </button>
              </form>
            </div>

          </div>

          {/* Right Grid Panel: Central Operations Alerts, Approvals, and Master Bookings Override Panel */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Active System Alerts Queue */}
            <div className="bg-[#121212] p-8 border border-white/10 rounded-none">
              <h4 className="font-black text-sm uppercase text-white tracking-tight mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500 animate-bounce" />
                STATUS ALARM SISTEM AKTIF ({alerts.length})_
              </h4>

              {alerts.length === 0 ? (
                <div className="text-center py-6 bg-black border border-dashed border-white/10 rounded-none text-xs font-mono text-white/40">
                  TIDAK ADA JADWAL ALARM PERJALANAN AKTIF
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map(alt => (
                    <div 
                      key={alt.id}
                      className="bg-black/45 border border-white/10 p-5 rounded-none flex justify-between items-start gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-black bg-red-950/40 text-red-500 border border-red-900/40 px-2 py-0.5 rounded-none uppercase tracking-wider">CRITICAL</span>
                          <span className="text-[9px] text-white/40 font-mono">{alt.time}</span>
                        </div>
                        <h5 className="font-black text-white text-xs tracking-tight">{alt.title}</h5>
                        <p className="text-white/60 text-xs mt-1 leading-relaxed">{alt.message}</p>
                      </div>
                      <button
                        onClick={() => handleResolveAlert(alt.id)}
                        className="text-[10px] font-black font-mono tracking-wider text-[#C5FF00] hover:bg-[#C5FF00] hover:text-black px-3.5 py-2 rounded-none border border-[#C5FF00]/40 transition-all cursor-pointer inline-flex items-center gap-1 flex-shrink-0 uppercase"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> RESOLVE_
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verification Queue Drivers */}
            <div className="bg-[#121212] p-8 border border-white/10 rounded-none">
              <h4 className="font-black text-sm uppercase text-white tracking-tight mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C5FF00]" />
                VALIDASI PERIZINAN KENDARAAN DRIVER BARU_
              </h4>

              <div className="grid sm:grid-cols-2 gap-4">
                {pendingDrivers.map(drv => (
                  <div 
                    key={drv.id}
                    className="bg-black/45 border border-white/10 p-5 rounded-none flex justify-between items-center"
                  >
                    <div>
                      <h5 className="font-black uppercase text-xs text-white tracking-tight">{drv.name}</h5>
                      <p className="text-[10px] font-mono text-[#C5FF00] font-black">{drv.plate}</p>
                      <p className="text-[9px] font-mono text-white/45 uppercase tracking-wider mt-1">{drv.type}</p>
                    </div>

                    {drv.status === 'PENDING' ? (
                      <button
                        onClick={() => handleApproveDriver(drv.id)}
                        className="bg-[#C5FF00] hover:bg-white text-black font-black text-[9px] px-3.5 py-2 rounded-none transition-all cursor-pointer uppercase tracking-wider"
                      >
                        APPROVE MITRA_
                      </button>
                    ) : (
                      <span className="text-[9px] font-mono font-black text-[#C5FF00] bg-[#C5FF00]/10 px-2.5 py-1 rounded-none border border-[#C5FF00]/30 tracking-widest uppercase">
                        APPROVED_
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Master Bookings State Controller Table */}
            <div className="bg-[#121212] p-8 border border-white/10 rounded-none">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-black text-sm uppercase text-white tracking-tight">SUPERVISI &amp; OVERRIDE STATUS LOGISTIK_</h4>
                  <p className="text-xs font-mono text-white/50">Daftar muatan global, bypass status, &amp; pembatalan langsung</p>
                </div>
              </div>

              <div className="space-y-4">
                {bookings.map(b => (
                  <div 
                    key={b.id}
                    className="bg-black/45 border border-white/10 p-6 rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] font-black bg-[#C5FF00]/10 border border-[#C5FF00]/30 text-[#C5FF00] px-2 py-0.5 rounded-none">{b.id}</span>
                        <span className="text-[9px] text-white/40 font-mono uppercase">{b.date}</span>
                      </div>
                      <h5 className="font-black uppercase text-xs text-white leading-snug tracking-tight">{b.cargoDetail}</h5>
                      <p className="text-xs font-mono text-white/55 mt-1">{b.pickup} &rarr; {b.destination}</p>
                      
                      <div className="flex items-center gap-3 mt-3 text-[9px] font-mono text-white/40 uppercase tracking-widest">
                        <span className="border border-white/10 px-2 py-0.5 rounded-none bg-white/5 text-white/70">{b.truckType}</span>
                        <span>&bull;</span>
                        <span className="text-white/70">{b.weight} TON</span>
                        <span>&bull;</span>
                        <span className="text-[#C5FF00] font-black">{b.amount}</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-white/10 pt-4 md:pt-0 justify-between">
                      
                      {/* State manipulator dropdown */}
                      <div className="text-right">
                        <label className="block text-[9px] uppercase font-mono tracking-wider text-white/40 mb-1">State Override_</label>
                        <select
                          value={b.status}
                          onChange={(e) => onUpdateBookingStatus(b.id, e.target.value as Booking['status'])}
                          className="bg-black text-[#C5FF00] text-xs font-mono font-black py-2 px-3.5 border border-white/15 outline-none cursor-pointer appearance-none rounded-none uppercase"
                        >
                          <option value="MENUNGGU">MENUNGGU (Open)</option>
                          <option value="DALAM PERJALANAN">DALAM PERJALANAN</option>
                          <option value="SELESAI">SELESAI</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-black px-3 py-1 rounded-none border uppercase tracking-wider ${
                          b.status === 'SELESAI' 
                            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30' 
                            : b.status === 'DALAM PERJALANAN' 
                              ? 'bg-indigo-950/30 text-indigo-400 border-indigo-500/30' 
                              : 'bg-amber-950/30 text-[#C5FF00] border-[#C5FF00]/30'
                        }`}>
                          {b.status}
                        </span>

                        <button
                          onClick={() => onDeleteBooking(b.id)}
                          className="p-1.5 text-red-400 hover:bg-red-950/50 hover:text-red-300 border border-transparent hover:border-red-900/30 rounded-none transition-all cursor-pointer"
                          title="Frictionless delete / prune order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
