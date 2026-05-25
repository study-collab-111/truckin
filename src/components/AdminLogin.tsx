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
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Cpu
} from 'lucide-react';
import { AppView, Account } from '../types';
import { authenticateAccount } from '../lib/firebase';

interface AdminLoginProps {
  onNavigate: (view: AppView) => void;
  setUserMode: (mode: 'customer' | 'partner' | 'admin') => void;
  onLoginSuccess: (user: Account) => void;
}

export default function AdminLogin({ onNavigate, setUserMode, onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Kredensial Admin wajib diisi.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      const account = await authenticateAccount(email, password, 'admin');
      if (account) {
        onLoginSuccess(account);
        setUserMode('admin');
        onNavigate('dashboard-admin');
      } else {
        setError('Otentikasi Gagal: Kredensial Admin salah atau ditolak.');
      }
    } catch (err) {
      setError('Gagal menghubungi server otentikasi admin.');
    } finally {
      setLoading(false);
    }
  };

  const demoAdminLogin = () => {
    const demoAdmin: Account = {
      email: 'admin.control@trukin.co.id',
      name: 'Central Administrator',
      role: 'admin'
    };
    onLoginSuccess(demoAdmin);
    setUserMode('admin');
    setEmail('admin.control@trukin.co.id');
    setPassword('admin123');
    onNavigate('dashboard-admin');
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
          Beranda Layanan
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#C5FF00] border border-[#C5FF00]/30 rounded-none px-2 py-0.5 tracking-widest font-mono uppercase bg-[#C5FF00]/5">SECURE_ADMIN</span>
          <div className="text-xl font-black tracking-tighter uppercase select-none">
            TRUKIN<span className="text-[#C5FF00]">_</span>
          </div>
        </div>
      </div>

      {/* Admin Central Entry Box */}
      <div className="flex-1 flex items-center justify-center max-w-md mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#121212] p-10 rounded-none border border-white/10 w-full"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-red-500/10 rounded-none flex items-center justify-center text-[#C5FF00] mx-auto mb-4 border border-[#C5FF00]/20">
              <Cpu className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">CENTRAL CONTROL_</h2>
            <p className="text-white/60 text-xs font-mono uppercase tracking-wider">Otoritas kendali operasi dwi-sisi TrukIn</p>
          </div>

          {error && (
            <div className="bg-red-950/40 text-red-400 p-4 rounded-none flex items-start gap-2 text-xs font-mono mb-6 border border-red-900/40">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-white/50 mb-2">Internal E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  placeholder="admin.control@trukin.co.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 focus:border-[#C5FF00] rounded-none py-4 pl-12 pr-4 text-sm font-medium text-white placeholder-white/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-white/50 mb-2">Sandi Rahasia</label>
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
              className={`w-full bg-[#C5FF00] text-black py-4.5 rounded-none font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex justify-center items-center gap-2 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'MEMVERIFIKASI OTORITAS...' : 'MASUK KONSOL CONTROL PANEL'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Admin bypass */}
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <button 
              onClick={demoAdminLogin}
              className="w-full bg-white/5 hover:bg-white/10 text-[#C5FF00] font-black font-sans py-3.5 px-4 rounded-none text-xs transition-all border border-white/10 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <ShieldCheck className="w-4 h-4" />
              MASUK CEPAT DEMO ADMIN
            </button>
          </div>

        </motion.div>
      </div>

      {/* Bottom Footer Row */}
      <div className="text-center text-[10px] font-mono uppercase tracking-widest text-[#a4a7af]/50 mt-8">
        Hak Cipta Dilindungi &copy; 2026 Divisi Keamanan IT TrukIn Indonesia.
      </div>

    </div>
  );
}
