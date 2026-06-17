/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, HelpCircle, Smartphone, Share2, PlusSquare } from 'lucide-react';
import { Language } from '../lib/translations';

interface PwaInstallBannerProps {
  lang: Language;
}

export default function PwaInstallBanner({ lang }: PwaInstallBannerProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Detect if device is iOS (Safari doesn't support beforeinstallprompt but supports manual Add to Home Screen)
    const ua = window.navigator.userAgent;
    const isIPadIPodIPhone = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIPadIPodIPhone);

    // If already installed, don't show native install banner
    // Check matchMedia for standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      console.log('[TrukIn PWA] Running in standalone mode.');
      return;
    }

    // Capture standard beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent automatic browser banner
      e.preventDefault();
      // Store event to trigger later
      setDeferredPrompt(e);
      
      // Determine if dismissed before in this session
      const isDismissed = sessionStorage.getItem('trukin_pwa_dismissed') === 'true';
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if we should show standard iOS help prompt on load (if not dismissed before)
    if (isIPadIPodIPhone && !sessionStorage.getItem('trukin_pwa_dismissed') === true) {
      // Small timeout to not disrupt load sequence
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Expose global callback so custom buttons elsewhere (e.g. Header) can invoke PWA prompt too
  useEffect(() => {
    (window as any).triggerTrukInPwaInstall = () => {
      if (deferredPrompt) {
        handleInstallClick();
      } else if (isIOS) {
        setShowInstructions(true);
        setIsVisible(true);
      } else {
        // Fallback info modal for ordinary browsers where deferredPrompt is inactive
        setShowInstructions(true);
        setIsVisible(true);
      }
    };

    return () => {
      delete (window as any).triggerTrukInPwaInstall;
    };
  }, [deferredPrompt, isIOS]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the browser install option
    deferredPrompt.prompt();

    // Wait for the user response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[TrukIn PWA] User prompt decision: ${outcome}`);

    // Standardize & reset prompt
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('trukin_pwa_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible && !showInstructions) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md w-auto z-[9999]">
      <AnimatePresence>
        <motion.div
          id="pwa-install-banner"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="bg-black/95 text-white border border-[#C5FF00]/40 p-5 shadow-2xl relative backdrop-blur-xl"
        >
          {/* Subtle top loading neon line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C5FF00] via-white to-[#C5FF00]" />

          <button
            onClick={handleDismiss}
            className="absolute top-3.5 right-3.5 text-white/50 hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Dismiss PWA Banner"
          >
            <X className="w-4 h-4" />
          </button>

          {!showInstructions ? (
            <div>
              <div className="flex gap-4 items-start pr-6">
                <div className="bg-[#C5FF00]/10 p-2.5 border border-[#C5FF00]/20 rounded-none flex-shrink-0">
                  <Download className="w-6 h-6 text-[#C5FF00]" />
                </div>
                <div>
                  <h4 className="font-mono text-xs text-[#C5FF00] uppercase tracking-[0.2em] font-black mb-1">
                    {lang === 'id' ? 'PASANG APLIKASI TRUKIN_' : 'INSTALL TRUKIN APP_'}
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed font-medium">
                    {lang === 'id' 
                      ? 'Dapatkan performa offline yang mulus, akses database pengiriman super cepat, dan notifikasi driver real-time langsung dari layar utama Anda.'
                      : 'Get smooth offline capability, instant shipments database access, and real-time driver notifications straight from your homescreen.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-3 justify-end items-center">
                <button
                  onClick={() => setShowInstructions(true)}
                  className="px-3.5 py-2 text-[10px] font-mono tracking-wider font-extrabold text-white/60 hover:text-white transition-all uppercase cursor-pointer"
                >
                  {lang === 'id' ? 'Panduan Manual?' : 'Manual Guide?'}
                </button>
                {deferredPrompt ? (
                  <button
                    onClick={handleInstallClick}
                    className="bg-[#C5FF00] hover:bg-white text-black font-black font-mono text-[10px] tracking-wider uppercase px-5 py-2.5 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {lang === 'id' ? 'PASANG SEKARANG_' : 'INSTALL APP_'}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowInstructions(true)}
                    className="bg-white text-black hover:bg-[#C5FF00] font-black font-mono text-[10px] tracking-wider uppercase px-5 py-1.5 transition-all cursor-pointer"
                  >
                    {lang === 'id' ? 'LIHAT CARANYA_' : 'SHOW HOW_'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-mono text-xs text-[#C5FF00] uppercase tracking-[0.2em] font-black mb-4 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#C5FF00]" />
                {lang === 'id' ? 'PANDUAN PEMASANGAN' : 'INSTALLATION GUIDE'}
              </h4>

              {isIOS ? (
                // iOS Safari Steps
                <div className="space-y-3.5 text-xs text-white/90">
                  <p className="opacity-80">
                    {lang === 'id'
                      ? 'iOS Safari tidak mengizinkan pemesanan instalasi otomatis. Ikuti instruksi mudah ini:'
                      : 'iOS Safari requires manual installation. Please follow these easy steps:'}
                  </p>
                  <div className="space-y-2 bg-white/5 p-3.5 border border-white/10 font-mono">
                    <div className="flex gap-2 items-center">
                      <span className="text-[#C5FF00] font-bold">1.</span>
                      <span>
                        {lang === 'id' ? 'Tekan tombol bagi' : 'Tap the share button'}
                        {' '}<Share2 className="w-3.5 h-3.5 inline inline-block text-[#C5FF00] mx-0.5" />{' '}
                        {lang === 'id' ? 'pada bar navigasi browser.' : 'on the browser navigation bar.'}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-[#C5FF00] font-bold">2.</span>
                      <span>
                        {lang === 'id' ? 'Scroll ke bawah dan ketuk' : 'Scroll down and tap'}
                        {' '}<span className="text-[#C5FF00] font-bold">"{lang === 'id' ? 'Tambah ke Layar Utama' : 'Add to Home Screen'}"</span>
                        {' '}<PlusSquare className="w-3.5 h-3.5 inline inline-block text-white mx-0.5" />_
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-[#C5FF00] font-bold">3.</span>
                      <span>{lang === 'id' ? 'Ketuk "Tambah" di sudut kanan atas.' : 'Tap "Add" at the top right corner.'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Desktop / other browsers guide
                <div className="space-y-3.5 text-xs text-white/90">
                  <p className="opacity-80">
                    {lang === 'id'
                      ? 'Pemasangan aplikasi PWA dapat dilakukan langsung melalui browser Anda:'
                      : 'Quickly install the PWA application via your browser bar:'}
                  </p>
                  <div className="space-y-2.5 bg-white/5 p-3.5 border border-white/10 font-mono text-[11px]">
                    <p>
                      {lang === 'id'
                        ? '• Klik ikon download/pasang di pojok kanan Bilah Alamat (Address Bar)'
                        : '• Click the computer-with-down-arrow icon at the right of the Address Bar'}
                    </p>
                    <p>
                      {lang === 'id'
                        ? '• Atau, klik Menu Tiga Titik Chrome/Edge dan pilih "Pasang TrukIn" atau "Tambah Aplikasi"'
                        : '• Or check the browser menu (vertical dots) and click "Install TrukIn"'}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-5 flex gap-3 justify-end">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="px-4 py-2 border border-white/10 text-[10px] font-mono tracking-wider font-extrabold text-white/70 hover:text-white transition-all uppercase cursor-pointer"
                >
                  {lang === 'id' ? 'Kembali' : 'Back'}
                </button>
                <button
                  onClick={handleDismiss}
                  className="bg-[#C5FF00] hover:bg-white text-black font-black font-mono text-[10px] tracking-wider uppercase px-5 py-2 transition-all cursor-pointer"
                >
                  {lang === 'id' ? 'MENGERTI_' : 'GOT IT_'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
