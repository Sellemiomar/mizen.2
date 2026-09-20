import React from 'react';
import { 
  Search, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Calculator, 
  Sparkles,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';

export type AppTab = 'home' | 'catalog' | 'matcher' | 'compare' | 'simulator' | 'dossier';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedCompareCount: number;
  onOpenCompare: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCompareCount,
  onOpenCompare,
  lang,
  setLang,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EE]/95 backdrop-blur-xs border-b border-stone-200/80 text-stone-900 transition-colors">
      
      {/* 1. Top Amber Disclaimer Strip */}
      <div 
        className="bg-[#FFFDF5] border-b border-[#FDE68A]/60 px-4 py-2 text-xs text-[#92400E]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 max-w-4xl">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px] sm:text-xs font-medium leading-normal">
              {t.disclaimerBanner}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-[11px] font-semibold">
              {t.independentPlatform}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="flex items-center justify-between h-16 sm:h-18 gap-3"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Brand Logo & Identification */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0"
          >
            {/* Soft Dark Green Emblem */}
            <div className="w-10 h-10 rounded-2xl bg-[#15392B] text-white flex items-center justify-center font-bold text-xl shadow-xs group-hover:bg-[#1A4435] transition-all">
              <span className="font-arabic pb-0.5">م</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-stone-900 font-sans">
                  {t.brandName}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#F59E0B] text-stone-950 font-bold text-xs">
                  {t.brandNameAr}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-normal hidden md:block whitespace-nowrap">
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-stone-200/60 p-0.5 rounded-xl border border-stone-200/80 text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setLang('ar')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  lang === 'ar'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  lang === 'fr'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                FR
              </button>
            </div>

            {/* Dashboard button */}
            <button
              onClick={() => setActiveTab('home')}
              className={`h-9 px-3.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-[#15392B] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50 bg-white border border-stone-200/80'
              }`}
            >
              <span>{t.navDashboard}</span>
            </button>

            {/* Catalog button */}
            <button
              onClick={() => setActiveTab('catalog')}
              className={`h-9 px-3.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'bg-[#15392B] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50 bg-white border border-stone-200/80'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <span>{t.navCatalog}</span>
            </button>

            {/* Matcher Button */}
            <button
              onClick={() => setActiveTab('matcher')}
              className={`hidden md:flex h-9 px-3 rounded-xl text-xs sm:text-[13px] font-semibold transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'matcher'
                  ? 'bg-[#15392B] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50 bg-white border border-stone-200/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.navMatcher}</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={() => setActiveTab('compare')}
              className={`hidden md:flex h-9 px-3 rounded-xl text-xs sm:text-[13px] font-semibold transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'compare'
                  ? 'bg-[#15392B] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50 bg-white border border-stone-200/80'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {t.navCompare} {selectedCompareCount > 0 && `(${selectedCompareCount})`}
              </span>
            </button>

            {/* Simulator Button */}
            <button
              onClick={() => setActiveTab('simulator')}
              className={`hidden lg:flex h-9 px-3 rounded-xl text-xs sm:text-[13px] font-semibold transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'simulator'
                  ? 'bg-[#15392B] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50 bg-white border border-stone-200/80'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.navSimulator}</span>
            </button>

            {/* Dossier Button */}
            <button
              onClick={() => setActiveTab('dossier')}
              className={`hidden lg:flex h-9 px-3 rounded-xl text-xs sm:text-[13px] font-semibold transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'dossier'
                  ? 'bg-[#15392B] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50 bg-white border border-stone-200/80'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.navDossier}</span>
            </button>

          </div>

        </div>
      </div>

      {/* 3. Mobile Secondary Quick Nav Bar */}
      <div 
        className="md:hidden border-t border-stone-200/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto bg-[#F7F4EE]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <button
          onClick={() => setActiveTab('matcher')}
          className={`h-8 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
            activeTab === 'matcher'
              ? 'bg-[#15392B] text-white'
              : 'text-stone-700 bg-white border border-stone-200/80'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{t.navMatcher}</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`h-8 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
            activeTab === 'compare'
              ? 'bg-[#15392B] text-white'
              : 'text-stone-700 bg-white border border-stone-200/80'
          }`}
        >
          <Layers className="w-3 h-3 text-emerald-700" />
          <span>{t.navCompare} {selectedCompareCount > 0 && `(${selectedCompareCount})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`h-8 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-[#15392B] text-white'
              : 'text-stone-700 bg-white border border-stone-200/80'
          }`}
        >
          <Calculator className="w-3 h-3 text-stone-500" />
          <span>{t.navSimulator}</span>
        </button>

        <button
          onClick={() => setActiveTab('dossier')}
          className={`h-8 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
            activeTab === 'dossier'
              ? 'bg-[#15392B] text-white'
              : 'text-stone-700 bg-white border border-stone-200/80'
          }`}
        >
          <FileText className="w-3 h-3 text-stone-500" />
          <span>{t.navDossier}</span>
        </button>
      </div>

    </header>
  );
};
