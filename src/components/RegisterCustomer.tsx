/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight,
  Building2,
  Mail,
  Phone,
  MapPin,
  Lock,
  AlertCircle
} from 'lucide-react';
import { AppView } from '../types';
import { registerNewAccount } from '../lib/firebase';
import { Language, trans } from '../lib/translations';
import LanguageSwitcher from './LanguageSwitcher';

interface RegisterCustomerProps {
  onNavigate: (view: AppView) => void;
  setUserMode: (mode: 'customer' | 'partner' | 'admin') => void;
  lang: Language;
  onSetLang: (lang: Language) => void;
}

export default function RegisterCustomer({ onNavigate, setUserMode, lang, onSetLang }: RegisterCustomerProps) {
  const [companyName, setCompanyName] = useState('');
  const [picEmail, setPicEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!companyName || !picEmail || !phoneNumber || !city || !password) {
      setError(lang === 'id' ? 'Mohon lengkapi semua bidang isian.' : 'Please complete all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await registerNewAccount({
        email: picEmail.toLowerCase().trim(),
        name: companyName,
        password: password,
        role: 'customer',
        phoneNumber: phoneNumber,
        city: city
      });
      alert(lang === 'id' ? 'Registrasi Akun Pelanggan Sukses! Akun Anda telah tersimpan di database. Silakan masuk.' : 'Customer Account Registered Successfully! Your data is preserved. Please login.');
      onNavigate('login');
    } catch (err: any) {
      setError(lang === 'id' ? 'Sistem Error: Gagal menyimpan data registrasi ke database. Periksa koneksi Anda.' : 'System Error: Failed to save registration details to central database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between py-12 px-6 font-sans">
      
      {/* Top Header Row with back arrow */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center mb-8">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-white/60 hover:text-[#C5FF00] font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {trans('kembaliBeranda', lang)}
        </button>
        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLang={lang} onSetLang={onSetLang} />
          <div className="text-xl font-black tracking-tighter uppercase select-none">
            TRUKIN<span className="text-[#C5FF00]">_</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center max-w-lg mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#121212] p-10 rounded-none border border-white/10 w-full"
        >
          <div className="text-center mb-8">
            <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-[#C5FF00] font-bold px-4 py-1.5 rounded-none uppercase tracking-[0.2em] mb-3 inline-block">{trans('untukPengirim', lang)}_</span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">{trans('registrasiPengirim', lang)}</h2>
            <p className="text-white/60 text-xs font-mono uppercase tracking-wider">{trans('formulirPengirimDesc', lang)}</p>
          </div>

          {error && (
            <div className="bg-red-950/40 text-red-400 p-4 rounded-none flex items-start gap-2 text-xs font-mono mb-6 border border-red-900/40">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#C5FF00]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-white/50 mb-1.5">{trans('namaKorporat', lang)}</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="PT Sinar Global Logistik"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 focus:border-[#C5FF00] rounded-none py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder-white/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-white/50 mb-1.5">E-mail PIC</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    placeholder="nama@perusahaan.com"
                    value={picEmail}
                    onChange={(e) => setPicEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-[#C5FF00] rounded-none py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder-white/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-white/50 mb-1.5">{trans('nomorTelepon', lang)}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-[#C5FF00] rounded-none py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder-white/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-white/50 mb-1.5">{trans('kotaOperasional', lang)}</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Jakarta Barat"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-[#C5FF00] rounded-none py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder-white/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-white/50 mb-1.5">{trans('password', lang)}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-[#C5FF00] rounded-none py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder-white/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#C5FF00] text-black py-4.5 rounded-none font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex justify-center items-center gap-2 cursor-pointer mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (lang === 'id' ? 'MEMPROSES...' : 'PROCESSING...') : trans('prosesRegistrasiShipper', lang)}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-white/50 mt-8 font-mono">
            {trans('sudahPunyaAkun', lang)}{' '}
            <button 
              onClick={() => onNavigate('login')} 
              className="text-[#C5FF00] font-black hover:underline cursor-pointer uppercase font-sans text-xs tracking-wider ml-1"
            >
              {lang === 'id' ? 'MASUK AKUN' : 'LOGIN HERE'}
            </button>
          </p>

        </motion.div>
      </div>

      {/* Bottom Footer Row */}
      <div className="text-center text-[10px] font-mono uppercase tracking-widest text-[#a4a7af]/50 mt-8">
        &copy; 2026 TRUKIN LABS. SECURED SIGNUP MODULE V2.0.
      </div>

    </div>
  );
}
