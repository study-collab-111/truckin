import { Globe } from 'lucide-react';
import { Language } from '../lib/translations';

interface LanguageSwitcherProps {
  currentLang: Language;
  onSetLang: (lang: Language) => void;
  className?: string;
}

export default function LanguageSwitcher({ currentLang, onSetLang, className = "" }: LanguageSwitcherProps) {
  return (
    <button
      onClick={() => onSetLang(currentLang === 'id' ? 'en' : 'id')}
      className={`inline-flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] uppercase font-bold tracking-widest transition-all select-none cursor-pointer bg-white/5 border border-white/10 text-white hover:border-[#C5FF00] hover:text-[#C5FF00] rounded-none group ${className}`}
      title={currentLang === 'id' ? 'Switch to English' : 'Ubah ke Bahasa Indonesia'}
    >
      <Globe className="w-4 h-4 text-white/60 group-hover:text-[#C5FF00] transition-colors" />
      <span className="flex items-center gap-1.5">
        <span className={currentLang === 'id' ? 'text-[#C5FF00]' : 'text-white/40'}>ID</span>
        <span className="text-white/20">|</span>
        <span className={currentLang === 'en' ? 'text-[#C5FF00]' : 'text-white/40'}>EN</span>
      </span>
    </button>
  );
}
