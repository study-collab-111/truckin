/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  Mail, 
  ArrowLeft, 
  User, 
  Truck, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { AppView, Account } from '../types';
import { authenticateAccount } from '../lib/firebase';

interface LoginProps {
  onNavigate: (view: AppView) => void;
  setUserMode: (mode: 'customer' | 'partner' | 'admin') => void;
  onLoginSuccess: (user: Account) => void;
}

export default function Login({ onNavigate, setUserMode, onLoginSuccess }: LoginProps) {
  const [role, setRole] = useState<'customer' | 'partner'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('E-mail dan password wajib diisi.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      const account = await authenticateAccount(email, password, role);
      if (account) {
        onLoginSuccess(account);
        setUserMode(role);
        if (role === 'customer') {
          onNavigate('dashboard-customer');
        } else {
          onNavigate('dashboard-partner');
        }
      } else {
        setError('Otentikasi Gagal: E-mail atau kata sandi Anda salah, atau peran pilihan tidak cocok.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi server saat memverifikasi akun.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (selectedRole: 'customer' | 'partner') => {
    setUserMode(selectedRole);
    if (selectedRole === 'customer') {
      const demoCust: Account = {
        email: 'alex.rivera@globalstore.id',
        name: 'Alex Rivera (PT GlobalStore Indonesia)',
        role: 'customer',
        phoneNumber: '08123456789',
        city: 'Jakarta Barat'
      };
      onLoginSuccess(demoCust);
      setEmail('alex.rivera@globalstore.id');
      setPassword('demo1234');
      onNavigate('dashboard-customer');
    } else {
      const demoPart: Account = {
        email: 'samsul.arifin@trukinkarsa.com',
        name: 'Samsul Arifin',
        role: 'partner',
        phoneNumber: '081398765432',
        plateNumber: 'B 9821 TKI',
        truckType: 'TRAILER'
      };
      onLoginSuccess(demoPart);
      setEmail('samsul.arifin@trukinkarsa.com');
      setPassword('demo1234');
      onNavigate('dashboard-partner');
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
          Kembali ke Beranda
        </button>
        <div className="text-xl font-black tracking-tighter uppercase select-none">
          TRUKIN<span className="text-[#C5FF00]">_</span>
        </div>
      </div>

      {/* Login Box */}
      <div className="flex-1 flex items-center justify-center max-w-md mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#121212] p-10 rounded-none border border-white/10 w-full"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">OTENTIKASI MASUK_</h2>
            <p className="text-white/60 text-xs uppercase font-mono tracking-wider">Silakan isi kredensial akun Anda</p>
          </div>

          {/* Role selection tab */}
          <div className="bg-black/50 p-1 rounded-none flex gap-1 mb-8 border border-white/10">
            <button
              onClick={() => { setRole('customer'); setError(''); }}
              className={`flex-1 flex justify-center items-center gap-2 py-3.5 rounded-none font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${
                role === 'customer' 
                  ? 'bg-[#C5FF00] text-black' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              Pelanggan
            </button>
            <button
              onClick={() => { setRole('partner'); setError(''); }}
              className={`flex-1 flex justify-center items-center gap-2 py-3.5 rounded-none font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${
                role === 'partner' 
                  ? 'bg-[#C5FF00] text-black' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              Mitra Crew
            </button>
          </div>

          {error && (
            <div className="bg-red-950/40 text-red-400 p-4 rounded-none flex items-start gap-2 text-xs font-mono mb-6 border border-red-900/40">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#C5FF00]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-white/60 mb-2">Alamat E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 focus:border-[#C5FF00] rounded-none py-4 pl-12 pr-4 text-sm font-medium text-white placeholder-white/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono tracking-wider uppercase text-white/60">Kata Sandi</label>
                <a href="#" className="text-xs font-mono text-[#C5FF00] hover:underline uppercase">Sandi Lupa?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 focus:border-[#C5FF00] rounded-none py-4 pl-12 pr-4 text-sm font-medium text-white placeholder-white/20 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#C5FF00] text-black py-4.5 rounded-none font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex justify-center items-center gap-2 cursor-pointer mt-8 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'MEMVERIFIKASI LOG IN...' : 'UJI SISTEM MASUK SECURE'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins block */}
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 block mb-4">Akses Uji Coba Cepat (Direct Bypass)</span>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => demoLogin('customer')}
                className="bg-white/5 border border-white/10 hover:border-[#C5FF00] text-white font-mono py-3 px-4 rounded-none text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#C5FF00]" />
                Demo User
              </button>
              <button 
                onClick={() => demoLogin('partner')}
                className="bg-white/5 border border-white/10 hover:border-[#C5FF00] text-white font-mono py-3 px-4 rounded-none text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5 text-[#C5FF00]" />
                Demo Driver
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-white/50 mt-8 font-mono">
            BELUM MEMILIKI AKUN?{' '}
            <button 
              onClick={() => onNavigate(role === 'customer' ? 'register-customer' : 'register-partner')} 
              className="text-[#C5FF00] font-black hover:underline cursor-pointer uppercase font-sans text-xs tracking-wider ml-1"
            >
              DAFTAR SEKARANG
            </button>
          </p>

        </motion.div>
      </div>

      {/* Bottom Footer Row */}
      <div className="text-center text-[10px] uppercase tracking-widest text-white/30 font-mono mt-8">
        &copy; 2026 TRUKIN LABS. SECURE CREDENTIAL SYSTEM V3.1.
      </div>

    </div>
  );
}
