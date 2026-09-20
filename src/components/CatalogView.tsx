import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Check, 
  Layers, 
  X, 
  Sparkles, 
  RefreshCw,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Percent,
  Compass,
  ArrowRight
} from 'lucide-react';
import { FinancingProgram, FundingType, TargetStage, Sector } from '../types';
import { ProgramCard } from './ProgramCard';
import { formatTND } from '../utils/formatters';
import { Language } from '../utils/i18n';

interface CatalogViewProps {
  programs: FinancingProgram[];
  selectedForCompare: FinancingProgram[];
  onToggleCompare: (program: FinancingProgram) => void;
  onOpenDetails: (program: FinancingProgram) => void;
  onOpenCompare: () => void;
  onStartMatching: () => void;
  initialCategory?: string;
  lang?: Language;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  programs,
  selectedForCompare,
  onToggleCompare,
  onOpenDetails,
  onOpenCompare,
  onStartMatching,
  initialCategory,
  lang = 'ar',
}) => {
  const isRtl = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FundingType | 'all'>(() => {
    if (initialCategory === 'expansion') return 'concessionary_debt';
    if (initialCategory === 'microfinance') return 'microfinance';
    if (initialCategory === 'bfr') return 'commercial_debt';
    return 'all';
  });
  const [selectedStage, setSelectedStage] = useState<TargetStage | 'all'>(() => {
    if (initialCategory === 'creation') return 'seed';
    return 'all';
  });
  const [selectedSector, setSelectedSector] = useState<Sector | 'all'>('all');
  const [onlyStartupAct, setOnlyStartupAct] = useState(() => initialCategory === 'startup_act');
  const [onlyZeroCollateral, setOnlyZeroCollateral] = useState(false);
  const [onlyZdrAdvantaged, setOnlyZdrAdvantaged] = useState(false);
  const [onlyIslamic, setOnlyIslamic] = useState(() => initialCategory === 'machinery');
  const [sortBy, setSortBy] = useState<'featured' | 'amount_desc' | 'amount_asc' | 'speed'>('featured');

  const filteredPrograms = useMemo(() => {
    return programs
      .filter((p) => {
        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchText = 
            p.name.toLowerCase().includes(q) ||
            (p.nameAr && p.nameAr.toLowerCase().includes(q)) ||
            p.institution.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);
          if (!matchText) return false;
        }

        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Stage
        if (selectedStage !== 'all' && !p.stages.includes(selectedStage)) {
          return false;
        }

        // Sector
        if (selectedSector !== 'all' && !p.sectors.includes('all') && !p.sectors.includes(selectedSector)) {
          return false;
        }

        // Toggles
        if (onlyStartupAct && !p.isStartupActExclusive) return false;
        if (onlyZeroCollateral && p.collateralLevel !== 'none' && p.collateralLevel !== 'honor_pledge') return false;
        if (onlyZdrAdvantaged && !p.isZdrAdvantaged) return false;
        if (onlyIslamic && !p.isIslamicCompliant) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'amount_desc') return b.maxAmountTND - a.maxAmountTND;
        if (sortBy === 'amount_asc') return a.minAmountTND - b.minAmountTND;
        if (sortBy === 'speed') return a.turnaroundTimeWeeks - b.turnaroundTimeWeeks;
        // Default featured
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [
    programs,
    searchQuery,
    selectedCategory,
    selectedStage,
    selectedSector,
    onlyStartupAct,
    onlyZeroCollateral,
    onlyZdrAdvantaged,
    onlyIslamic,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStage('all');
    setSelectedSector('all');
    setOnlyStartupAct(false);
    setOnlyZeroCollateral(false);
    setOnlyZdrAdvantaged(false);
    setOnlyIslamic(false);
    setSortBy('featured');
  };

  const hasActiveFilters = 
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedStage !== 'all' ||
    selectedSector !== 'all' ||
    onlyStartupAct ||
    onlyZeroCollateral ||
    onlyZdrAdvantaged ||
    onlyIslamic;

  return (
    <div className="space-y-6 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Clean Intro Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[#15392B] text-xs font-semibold mb-4">
            <Compass className="w-3.5 h-3.5 text-[#15392B]" />
            {isRtl ? 'الدليل الوطني لآليات التمويل · تونس 2026' : 'Référentiel National des Financements · Tunisie 2026'}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 mb-3 leading-tight">
            {isRtl ? 'تمويلات المؤسسات والشركات الناشئة في تونس' : "Financements d'entreprises & startups en Tunisie"}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {isRtl ? (
              <>استعرض <strong className="text-stone-900">18 آلية تمويل رسمية</strong>: منح Startup Act، قروض شرف 0%، قروض مخفضة BFPME و BTS، ضمانات SOTUGAR وصناديق ANAVA.</>
            ) : (
              <>Consultez <strong className="text-stone-900">18 dispositifs vérifiés</strong> : subventions Startup Act, prêts d'honneur à 0%, crédits bonifiés BFPME & BTS, garanties SOTUGAR et fonds souscrits par ANAVA.</>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-5 text-xs text-stone-600">
            <span className="inline-flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/80">
              <span className="font-bold text-stone-900">18</span> {isRtl ? 'برنامج نشط' : 'programmes actifs'}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/80">
              <span className="font-bold text-stone-900">{isRtl ? '10 آلاف إلى 5 مليون د.ت' : '10k à 5M DT'}</span> {isRtl ? 'لكل تذكرة' : 'par ticket'}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15392B]" />
              {isRtl ? 'ضمان SOTUGAR حتى 80%' : "Garantie SOTUGAR jusqu'à 80%"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <button
            onClick={onStartMatching}
            className="px-5 py-3 rounded-2xl bg-[#15392B] hover:bg-[#0f2a20] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? 'فحص الأهلية المبدئية' : 'Tester mon éligibilité'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {selectedForCompare.length > 0 && (
            <button
              onClick={onOpenCompare}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm border border-stone-200/80 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Layers className="w-4 h-4 text-[#15392B]" />
              <span>{isRtl ? `عرض المقارنة (${selectedForCompare.length})` : `Voir le comparatif (${selectedForCompare.length})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
        
        {/* Top search & quick sorts */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? "ابحث بالكلمات المفتاحية (مثل: Smart Capital, AIR, BFPME, SOTUGAR, Enda, منحة...)" : "Rechercher par mot-clé (ex: Smart Capital, AIR, BFPME, SOTUGAR, Enda, subvention...)"}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#15392B]/20 focus:border-[#15392B] bg-stone-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-stone-500 font-medium hidden md:inline">
              {isRtl ? 'ترتيب حسب :' : 'Trier par :'}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-stone-200/80 text-xs font-semibold text-stone-700 bg-stone-50/70 focus:outline-none focus:ring-2 focus:ring-[#15392B]/20 cursor-pointer"
            >
              <option value="featured">{isRtl ? 'الأولوية الموصى بها' : 'Recommandés en priorité'}</option>
              <option value="amount_desc">{isRtl ? 'المبلغ الأقصى تنازلياً' : 'Montant maximal décroissant'}</option>
              <option value="amount_asc">{isRtl ? 'المبلغ الأدنى المتاح' : 'Montant minimal accessible'}</option>
              <option value="speed">{isRtl ? 'سرعة دراسة الملف' : "Délai d'instruction rapide"}</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-1 transition-colors cursor-pointer"
                title={isRtl ? "إلغاء التصفيات" : "Réinitialiser les filtres"}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isRtl ? 'مسح' : 'Effacer'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-stone-400 text-xs font-medium mr-1 shrink-0">
            {isRtl ? 'النوع :' : 'Type :'}
          </span>
          {[
            { id: 'all', label: isRtl ? 'الكل' : 'Tous' },
            { id: 'grant', label: isRtl ? 'منح وهبات' : 'Subventions & Dons' },
            { id: 'concessionary_debt', label: isRtl ? 'قروض ميسرة' : 'Crédits Bonifiés' },
            { id: 'honor_loan', label: isRtl ? 'قروض شرف 0%' : "Prêts d'Honneur 0%" },
            { id: 'venture_capital', label: isRtl ? 'رأس مال مخاطر' : 'Capital-Risque / Equity' },
            { id: 'microfinance', label: isRtl ? 'تمويل أصغر' : 'Microfinance' },
            { id: 'commercial_debt', label: isRtl ? 'قروض بنكية' : 'Crédits Bancaires' },
            { id: 'guarantee', label: isRtl ? 'ضمانات (SOTUGAR)' : 'Garanties (SOTUGAR)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-[#15392B] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Specific Toggles & Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          
          {/* Stage filter */}
          <div className="flex items-center gap-1 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-200">
            <span className="text-stone-500 font-medium">{isRtl ? 'المرحلة :' : 'Stade :'}</span>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value as any)}
              className="bg-transparent font-medium text-stone-800 focus:outline-none"
            >
              <option value="all">{isRtl ? 'جميع المراحل' : 'Tous stades'}</option>
              <option value="idea">{isRtl ? 'فكرة / تصميم' : 'Idée / Conception'}</option>
              <option value="poc">{isRtl ? 'نموذج أولي / بحث' : 'Prototypage / R&D'}</option>
              <option value="seed">{isRtl ? 'انطلاق (Seed)' : 'Amorçage (Seed)'}</option>
              <option value="growth">{isRtl ? 'نمو وتوسع' : 'Croissance'}</option>
              <option value="scale">{isRtl ? 'توسع وتصدير' : 'Expansion / Export'}</option>
            </select>
          </div>

          {/* Sector filter */}
          <div className="flex items-center gap-1 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-200">
            <span className="text-stone-500 font-medium">{isRtl ? 'القطاع :' : 'Secteur :'}</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value as any)}
              className="bg-transparent font-medium text-stone-800 focus:outline-none"
            >
              <option value="all">{isRtl ? 'جميع القطاعات' : 'Tous secteurs'}</option>
              <option value="tech_digital">{isRtl ? 'رقمي وتكنولوجيا' : 'Numérique & Tech'}</option>
              <option value="industry">{isRtl ? 'صناعة وهندسة' : 'Industrie & Ingénierie'}</option>
              <option value="agritech">{isRtl ? 'فلاحة وصناعات غذائية' : 'Agriculture & Agroalimentaire'}</option>
              <option value="green_cleantech">{isRtl ? 'طاقات خضراء وتدوير' : 'Énergies Vertes & Circulaire'}</option>
              <option value="services_commerce">{isRtl ? 'خدمات وتجارة' : 'Services & Commerce'}</option>
              <option value="creative_handicraft">{isRtl ? 'صناعات تقليدية' : "Artisanat & Métiers d'Art"}</option>
              <option value="health_pharma">{isRtl ? 'صحة وأدوية' : 'Santé & Pharma'}</option>
            </select>
          </div>

          {/* Special Toggle Pills */}
          <button
            onClick={() => setOnlyStartupAct(!onlyStartupAct)}
            className={`px-3 py-1.5 rounded-xl font-medium border flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              onlyStartupAct
                ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                : 'bg-white border-stone-200/80 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Label Startup Act</span>
          </button>

          <button
            onClick={() => setOnlyZeroCollateral(!onlyZeroCollateral)}
            className={`px-3 py-1.5 rounded-xl font-medium border flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              onlyZeroCollateral
                ? 'bg-emerald-50 border-emerald-300 text-[#15392B] font-bold'
                : 'bg-white border-stone-200/80 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#15392B]" />
            <span>{isRtl ? 'بدون ضمانات عينية' : 'Sans garantie personnelle'}</span>
          </button>

          <button
            onClick={() => setOnlyZdrAdvantaged(!onlyZdrAdvantaged)}
            className={`px-3 py-1.5 rounded-xl font-medium border flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              onlyZdrAdvantaged
                ? 'bg-emerald-50 border-emerald-300 text-[#15392B] font-bold'
                : 'bg-white border-stone-200/80 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#15392B]" />
            <span>{isRtl ? 'مناطق تنمية جهوية ZDR' : 'Bonus Région ZDR'}</span>
          </button>

          <button
            onClick={() => setOnlyIslamic(!onlyIslamic)}
            className={`px-3 py-1.5 rounded-xl font-medium border flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              onlyIslamic
                ? 'bg-emerald-50 border-emerald-300 text-[#15392B] font-bold'
                : 'bg-white border-stone-200/80 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#15392B]" />
            <span>{isRtl ? 'متوافق مع الشريعة' : 'Finance islamique'}</span>
          </button>

          <div className={`${isRtl ? 'mr-auto' : 'ml-auto'} text-xs text-stone-500 font-medium`}>
            <strong className="text-stone-900">{filteredPrograms.length}</strong> {isRtl ? 'آلية تمويل متاحة' : 'dispositifs trouvés'}
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              isSelectedForCompare={selectedForCompare.some(p => p.id === program.id)}
              onToggleCompare={onToggleCompare}
              onOpenDetails={onOpenDetails}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-8">
          <Filter className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 mb-1">
            {isRtl ? 'لا توجد آليات تطابق معايير البحث الحالية' : 'Aucun dispositif ne correspond à vos filtres actuels'}
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            {isRtl ? 'يرجى توسيع معايير البحث أو إلغاء بعض التصفيات المحددة.' : "Essayez d'élargir la recherche ou réinitialisez les critères sélectionnés."}
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {isRtl ? 'إعادة ضبط كل التصفيات' : 'Réinitialiser tous les filtres'}
          </button>
        </div>
      )}

      {/* Floating Comparison Tray */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-stone-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-800 flex items-center justify-between gap-3 animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#15392B] border border-[#2B634D] flex items-center justify-center font-bold text-xs text-white">
              {selectedForCompare.length}
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {isRtl 
                  ? `${selectedForCompare.length} برنامج تمويلي محدد للمقارنة` 
                  : `${selectedForCompare.length} programme${selectedForCompare.length > 1 ? 's' : ''} sélectionné${selectedForCompare.length > 1 ? 's' : ''}`}
              </div>
              <p className="text-[11px] text-stone-400 truncate max-w-xs sm:max-w-md">
                {selectedForCompare.map(p => (isRtl && p.nameAr ? p.nameAr : p.name)).join(' · ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCompare}
              className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#EAB308] text-stone-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isRtl ? 'فتح المقارنة' : 'Ouvrir le Comparateur'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
