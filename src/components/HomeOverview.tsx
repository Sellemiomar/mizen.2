import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  FileText, 
  ArrowLeft, 
  ArrowRight,
  Scale, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface HomeOverviewProps {
  onStartMatching: () => void;
  onOpenCatalog: (filterCategory?: string) => void;
  onOpenCompare: () => void;
  onOpenDossier: () => void;
  onOpenSimulator: () => void;
  programsCount: number;
  lang: Language;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  onStartMatching,
  onOpenCatalog,
  onOpenCompare,
  onOpenDossier,
  onOpenSimulator,
  programsCount,
  lang,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div 
      className="max-w-6xl mx-auto space-y-10 sm:space-y-12 pb-20 transition-all"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      
      {/* 1. Main Hero Banner - Deep Calm Forest Emerald */}
      <div className="relative rounded-3xl sm:rounded-[36px] bg-[#15392B] text-white p-8 sm:p-14 lg:p-16 shadow-xl shadow-stone-900/5 overflow-hidden border border-[#1E4A38] text-center">
        {/* Soft radial dot pattern */}
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#4ADE80_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D4A39]/90 border border-[#275D47] text-emerald-300 text-xs font-semibold mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-snug sm:leading-relaxed mb-4">
            {t.heroTitle}
          </h1>

          {/* Golden Balance Scale Emblem */}
          <div className="w-13 h-13 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto my-3 shadow-inner">
            <Scale className="w-6 h-6" />
          </div>

          {/* Subtitle */}
          <p className="text-stone-200/95 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto mb-7 font-normal">
            {t.heroSubtitle}
          </p>

          {/* Verified Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs mb-8">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#1D4A39]/80 border border-[#2B634D] text-stone-200 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.badgeOfficialCriteria}</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-[#1D4A39]/80 border border-[#2B634D] text-stone-200 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>
                {t.badgeUpdatedInfo} ({programsCount} {t.programsCountSuffix})
              </span>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onStartMatching}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#EAB308] text-stone-950 font-bold text-sm shadow-md shadow-amber-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 whitespace-nowrap"
            >
              <span>{t.btnInteractiveEval}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onOpenCatalog()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#1E4938] hover:bg-[#275C47] text-white font-semibold text-sm border border-[#2B634D] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>{t.btnExploreCatalog}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Independence Notice Box - Gentle Soft Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 text-xs sm:text-sm text-stone-600 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start sm:items-center gap-3.5">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-relaxed">
          <strong className="text-stone-900 font-bold mr-1 ml-1">{t.independenceTitle}</strong>
          <span>{t.independenceDesc}</span>
        </div>
      </div>

      {/* 3. Three Core Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Card 1: Official Criteria */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-stone-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-2">
            {t.val1Title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t.val1Desc}
          </p>
        </div>

        {/* Card 2: Islamic & Conventional */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-stone-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-2">
            {t.val2Title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t.val2Desc}
          </p>
        </div>

        {/* Card 3: Document Readiness */}
        <div 
          onClick={onOpenDossier}
          className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-2 group-hover:text-teal-700 transition-colors flex items-center justify-between">
            <span>{t.val3Title}</span>
            <ChevronIcon className="w-4 h-4 text-stone-400 group-hover:text-teal-700 transition-transform group-hover:translate-x-0.5" />
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t.val3Desc}
          </p>
        </div>

      </div>

      {/* 4. Choose Your Project Funding Destination */}
      <div className="space-y-5">
        
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            {t.destinationsHeading}
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            {t.quickFilter}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Création / Start */}
          <div 
            onClick={() => onOpenCatalog('creation')}
            className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-sm hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {t.destCreationTitle}
                </h3>
                <ChevronIcon className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed font-sans">
                {t.destCreationSub}
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>{t.viewMatchingOffers}</span>
              <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Card 2: Expansion & Growth */}
          <div 
            onClick={() => onOpenCatalog('expansion')}
            className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-sm hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {t.destExpansionTitle}
                </h3>
                <ChevronIcon className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed font-sans">
                {t.destExpansionSub}
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>{t.viewMatchingOffers}</span>
              <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Card 3: Machinery & Equipment */}
          <div 
            onClick={() => onOpenCatalog('machinery')}
            className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-sm hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {t.destMachineryTitle}
                </h3>
                <ChevronIcon className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed font-sans">
                {t.destMachinerySub}
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>{t.viewMatchingOffers}</span>
              <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Card 4: Microfinance & Independent work */}
          <div 
            onClick={() => onOpenCatalog('microfinance')}
            className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-sm hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {t.destMicrofinanceTitle}
                </h3>
                <ChevronIcon className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed font-sans">
                {t.destMicrofinanceSub}
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>{t.viewMatchingOffers}</span>
              <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Card 5: Working Capital & Liquidity (BFR) */}
          <div 
            onClick={() => onOpenCatalog('bfr')}
            className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-sm hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {t.destBfrTitle}
                </h3>
                <ChevronIcon className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed font-sans">
                {t.destBfrSub}
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>{t.viewMatchingOffers}</span>
              <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Card 6: Startups & Innovation */}
          <div 
            onClick={() => onOpenCatalog('startup_act')}
            className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-sm hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {t.destStartupsTitle}
                </h3>
                <ChevronIcon className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed font-sans">
                {t.destStartupsSub}
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>{t.viewMatchingOffers}</span>
              <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
