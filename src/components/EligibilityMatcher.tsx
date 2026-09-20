import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  Sliders, 
  FileCheck, 
  Layers, 
  Info, 
  Percent, 
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import { 
  CompanyAssessmentProfile, 
  FinancingProgram, 
  LegalStructure, 
  TargetStage, 
  Sector, 
  EligibilityResult 
} from '../types';
import { TUNISIAN_GOVERNORATES } from '../data/regions';
import { rankProgramsForProfile } from '../services/matcher';
import { formatTND, getCategoryBadge } from '../utils/formatters';

interface EligibilityMatcherProps {
  programs: FinancingProgram[];
  onOpenDetails: (program: FinancingProgram) => void;
  onToggleCompare: (program: FinancingProgram) => void;
  selectedForCompare: FinancingProgram[];
  onOpenCompare: () => void;
  lang?: 'ar' | 'fr';
}

export const EligibilityMatcher: React.FC<EligibilityMatcherProps> = ({
  programs,
  onOpenDetails,
  onToggleCompare,
  selectedForCompare,
  onOpenCompare,
  lang = 'fr',
}) => {
  const isRtl = lang === 'ar';

  // Assessment Form State
  const [legalForm, setLegalForm] = useState<LegalStructure>('startup_labeled');
  const [stage, setStage] = useState<TargetStage>('seed');
  const [ageYears, setAgeYears] = useState<number>(1);
  const [amountNeededTND, setAmountNeededTND] = useState<number>(75000);
  const [fundingPurpose, setFundingPurpose] = useState<'rd_prototype' | 'working_capital' | 'machinery_equipment' | 'export_international' | 'hiring_expansion'>('rd_prototype');
  const [sector, setSector] = useState<Sector>('tech_digital');
  const [governorate, setGovernorate] = useState<string>('tunis');
  const [hasStartupLabel, setHasStartupLabel] = useState<boolean>(true);
  const [isYouthLed, setIsYouthLed] = useState<boolean>(true);
  const [isWomenLed, setIsWomenLed] = useState<boolean>(false);
  const [isGraduateLed, setIsGraduateLed] = useState<boolean>(true);
  const [isDiasporaTRE, setIsDiasporaTRE] = useState<boolean>(false);

  // Filter state for results
  const [filterResultTab, setFilterResultTab] = useState<'all' | 'highly_eligible' | 'conditional'>('all');

  // Selected Governorate info
  const currentGov = useMemo(() => {
    return TUNISIAN_GOVERNORATES.find(g => g.id === governorate) || TUNISIAN_GOVERNORATES[0];
  }, [governorate]);

  const profile: CompanyAssessmentProfile = useMemo(() => ({
    legalForm,
    stage,
    ageYears,
    amountNeededTND,
    fundingPurpose,
    sector,
    governorate: currentGov.nameFr,
    isZDR: currentGov.isZDR,
    hasStartupActLabel: hasStartupLabel,
    isYouthLed,
    isWomenLed,
    isGraduateLed,
    isDiasporaTRE,
  }), [
    legalForm,
    stage,
    ageYears,
    amountNeededTND,
    fundingPurpose,
    sector,
    currentGov,
    hasStartupLabel,
    isYouthLed,
    isWomenLed,
    isGraduateLed,
    isDiasporaTRE,
  ]);

  const rankedResults = useMemo(() => {
    return rankProgramsForProfile(programs, profile);
  }, [programs, profile]);

  const highlyEligibleCount = rankedResults.filter(r => r.qualificationStatus === 'highly_eligible').length;
  const conditionalCount = rankedResults.filter(r => r.qualificationStatus === 'conditional_match').length;

  const displayResults = useMemo(() => {
    if (filterResultTab === 'highly_eligible') {
      return rankedResults.filter(r => r.qualificationStatus === 'highly_eligible');
    }
    if (filterResultTab === 'conditional') {
      return rankedResults.filter(r => r.qualificationStatus === 'conditional_match');
    }
    return rankedResults;
  }, [rankedResults, filterResultTab]);

  const resetToStandardProfile = () => {
    setLegalForm('sarl');
    setStage('seed');
    setAgeYears(1);
    setAmountNeededTND(100000);
    setFundingPurpose('machinery_equipment');
    setSector('tech_digital');
    setGovernorate('tunis');
    setHasStartupLabel(false);
    setIsYouthLed(true);
    setIsWomenLed(false);
    setIsGraduateLed(true);
    setIsDiasporaTRE(false);
  };

  return (
    <div className="space-y-6 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[#15392B] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#15392B]" />
            {isRtl ? 'محرك مطابقة شروط التمويل اللحظي' : "Moteur de Matching d'Éligibilité en Temps Réel"}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight mb-3 leading-tight">
            {isRtl 
              ? 'قيّم مدى مطابقة مشروعك لبرامج التمويل في تونس' 
              : "Évaluez l'éligibilité de votre entreprise aux guichets tunisiens"}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {isRtl
              ? 'حدد معطيات مؤسستك (المرحلة، الاحتياج المالي، ولاية الانتصاب). خوارزمية ميزان تطبق كراسات الشروط الرسمية (Smart Capital، BFPME، BTS، APII، SOTUGAR) لحساب نسبة التوافق بدقة.'
              : 'Renseignez les paramètres de votre structure (stade, besoin de trésorerie ou d\'investissement, gouvernorat d\'implantation). Notre algorithme applique les critères stricts des cahiers des charges (Smart Capital, BFPME, BTS, APII, SOTUGAR) pour scorer chaque dispositif.'}
          </p>
        </div>
      </div>

      {/* Main Grid: Left Form (Interactive controls) / Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Assessment Profile Parameters */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-5 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#15392B]" />
              {isRtl ? 'ملف المؤسسة' : 'Profil de votre Entreprise'}
            </h2>
            <button
              onClick={resetToStandardProfile}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              {isRtl ? 'إعادة ضبط' : 'Réinitialiser'}
            </button>
          </div>

          {/* 1. Amount Needed with preset buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex justify-between">
              <span>{isRtl ? 'المبلغ المطلوب (د.ت)' : 'Montant recherché (TND)'}</span>
              <span className="text-[#15392B] font-extrabold text-sm">
                {amountNeededTND.toLocaleString('fr-TN')} {isRtl ? 'د.ت' : 'DT'}
              </span>
            </label>
            <input
              type="range"
              min="10000"
              max="2000000"
              step="10000"
              value={amountNeededTND}
              onChange={(e) => setAmountNeededTND(Number(e.target.value))}
              className="w-full accent-[#15392B] cursor-pointer"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[25000, 60000, 150000, 300000, 800000, 1500000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmountNeededTND(amt)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    amountNeededTND === amt 
                      ? 'bg-[#15392B] text-white border-[#15392B]' 
                      : 'bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100'
                  }`}
                >
                  {formatTND(amt, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Legal Structure */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
              {isRtl ? 'الشكل القانوني' : 'Forme Juridique'}
            </label>
            <select
              value={legalForm}
              onChange={(e) => {
                const val = e.target.value as LegalStructure;
                setLegalForm(val);
                if (val === 'startup_labeled') setHasStartupLabel(true);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200/80 text-xs font-semibold text-stone-800 bg-stone-50/60 focus:ring-2 focus:ring-[#15392B]/20 focus:border-[#15392B]"
            >
              <option value="startup_labeled">
                {isRtl ? 'مؤسسة ناشئة حاصلة على Label Startup Act' : 'Labellisée Startup Act (Smart Capital)'}
              </option>
              <option value="suarl">
                {isRtl ? 'شركة ذات مسؤولية محدودة للشخص الواحد (SUARL)' : 'Société Unipersonnelle (SUARL)'}
              </option>
              <option value="sarl">
                {isRtl ? 'شركة ذات مسؤولية محدودة (SARL)' : 'Société à Responsabilité Limitée (SARL)'}
              </option>
              <option value="sa">
                {isRtl ? 'شركة خفية الاسم (SA)' : 'Société Anonyme (SA)'}
              </option>
              <option value="personne_physique">
                {isRtl ? 'مؤسسة فردية (شخص طبيعي)' : 'Entreprise Individuelle (Personne Physique)'}
              </option>
              <option value="artisan">
                {isRtl ? 'حرفي (بطاقة مهنية)' : "Artisan (Carte d'artisan)"}
              </option>
              <option value="in_creation">
                {isRtl ? 'في طور التأسيس / قبل الإحداث' : 'En cours de constitution / Ante-création'}
              </option>
            </select>
          </div>

          {/* 3. Stage & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                {isRtl ? 'المرحلة الحالية' : 'Stade Actuel'}
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as TargetStage)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200/80 text-xs font-semibold text-stone-800 bg-stone-50/60 focus:ring-2 focus:ring-[#15392B]/20 focus:border-[#15392B]"
              >
                <option value="idea">{isRtl ? 'فكرة / دراسة' : 'Idée / Conception'}</option>
                <option value="poc">{isRtl ? 'نموذج أولي / POC' : 'Prototypage / POC'}</option>
                <option value="seed">{isRtl ? 'انطلاق / إطلاق النشاط' : 'Amorçage / Lancement'}</option>
                <option value="growth">{isRtl ? 'نمو تجاري' : 'Croissance commerciale'}</option>
                <option value="scale">{isRtl ? 'توسع وتصدير' : 'Expansion / Export'}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                {isRtl ? 'أقدمية المؤسسة' : 'Ancienneté (ans)'}
              </label>
              <select
                value={ageYears}
                onChange={(e) => setAgeYears(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200/80 text-xs font-semibold text-stone-800 bg-stone-50/60 focus:ring-2 focus:ring-[#15392B]/20 focus:border-[#15392B]"
              >
                <option value={0}>{isRtl ? 'أقل من سنة (جديدة)' : "Moins d'un an (Nouveau)"}</option>
                <option value={1}>{isRtl ? 'سنة كاملة' : '1 an révolu'}</option>
                <option value={2}>{isRtl ? 'سنتان (ميزانية واحدة)' : '2 ans (1 bilan)'}</option>
                <option value={3}>{isRtl ? '3 سنوات (ميزانيتان)' : '3 ans (2 bilans)'}</option>
                <option value={5}>{isRtl ? '5 سنوات فما فوق' : '5 ans et plus'}</option>
              </select>
            </div>
          </div>

          {/* 4. Sector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
              {isRtl ? 'القطاع' : "Secteur d'Activité"}
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as Sector)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200/80 text-xs font-semibold text-stone-800 bg-stone-50/60 focus:ring-2 focus:ring-[#15392B]/20 focus:border-[#15392B]"
            >
              <option value="tech_digital">{isRtl ? 'التكنولوجيا والبرمجيات والذكاء الاصطناعي' : 'Numérique, IA & Logiciel (Tech)'}</option>
              <option value="industry">{isRtl ? 'الصناعة والهندسة الميكانيكية والكهربائية' : 'Industrie & Ingénierie mécanique/électrique'}</option>
              <option value="agritech">{isRtl ? 'الفلاحة والصناعات الغذائية (Agritech)' : 'Agriculture & Agroalimentaire (Agritech)'}</option>
              <option value="green_cleantech">{isRtl ? 'الطاقات المتجددة والاقتصاد الأخضر' : 'Énergies renouvelables & Économie circulaire'}</option>
              <option value="services_commerce">{isRtl ? 'خدمات المؤسسات والتجارة B2B' : 'Services aux entreprises & B2B'}</option>
              <option value="creative_handicraft">{isRtl ? 'الصناعات التقليدية والحرف اليدوية' : "Artisanat & Métiers d'art"}</option>
              <option value="health_pharma">{isRtl ? 'الصحة والمستلزمات الطبية والأدوية' : 'Santé, Dispositifs médicaux & Pharma'}</option>
            </select>
          </div>

          {/* 5. Funding Purpose */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
              {isRtl ? 'الهدف من التمويل' : 'Affectation des Fonds'}
            </label>
            <select
              value={fundingPurpose}
              onChange={(e) => setFundingPurpose(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200/80 text-xs font-semibold text-stone-800 bg-stone-50/60 focus:ring-2 focus:ring-[#15392B]/20 focus:border-[#15392B]"
            >
              <option value="rd_prototype">{isRtl ? 'البحث والتطوير وصناعة النموذج الأولي' : 'R&D, Brevets et Développement Prototype'}</option>
              <option value="machinery_equipment">{isRtl ? 'اقتناء المعدات والآلات الصناعية' : 'Machines, Équipements et Outillage'}</option>
              <option value="working_capital">{isRtl ? 'تمويل التصرف والسيولة (BFR)' : 'Besoin en Fonds de Roulement (BFR) & Trésorerie'}</option>
              <option value="export_international">{isRtl ? 'التطوير التجاري والتصدير نحو الخارج' : "Prospection et Développement à l'Export"}</option>
              <option value="hiring_expansion">{isRtl ? 'انتداب الكفاءات وتوسعة النشاط' : 'Recrutement de talents et Expansion'}</option>
            </select>
          </div>

          {/* 6. Governorate & ZDR Detection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center justify-between">
              <span>{isRtl ? 'ولاية الانتصاب' : "Gouvernorat d'Implantation"}</span>
              {currentGov.isZDR && (
                <span className="text-[11px] font-bold text-[#15392B] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#15392B]" />
                  {isRtl ? 'منطقة تنمية جهوية (ZDR)' : 'Zone ZDR Éligible (Bonus prime)'}
                </span>
              )}
            </label>
            <select
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200/80 text-xs font-semibold text-stone-800 bg-stone-50/60 focus:ring-2 focus:ring-[#15392B]/20 focus:border-[#15392B]"
            >
              {TUNISIAN_GOVERNORATES.map((g) => (
                <option key={g.id} value={g.id}>
                  {isRtl ? `${g.nameAr} (${g.nameFr})` : `${g.nameFr} (${g.nameAr})`} - {g.region} {g.isZDR ? '★ ZDR' : ''}
                </option>
              ))}
            </select>

            {currentGov.isZDR ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-[#15392B] text-xs leading-relaxed font-medium">
                🎉 <strong>{isRtl ? currentGov.nameAr : currentGov.nameFr}</strong> {isRtl 
                  ? 'مصنفة كمنطقة تشجيع تنمية جهوية. مشروعك يستفيد آلياً من منح FOPRODI (حتى 30%) وتيسير ضمانات SOTUGAR.'
                  : 'fait partie des Zones de Développement Régional. Votre entreprise débloque automatiquement les majorations FOPRODI (prime jusqu\'à 30%) et l\'allègement de garanties SOTUGAR.'}
              </div>
            ) : (
              <div className="text-[11px] text-stone-500">
                {isRtl ? 'منطقة ساحلية / تونس الكبرى.' : 'Implantation en région côtière / Grand Tunis.'}
              </div>
            )}
          </div>

          {/* 7. Founder Priority Criteria Checkboxes */}
          <div className="space-y-2.5 pt-2 border-t border-stone-100">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
              {isRtl ? 'شروط الأولوية للباعثين' : 'Critères Prioritaires Porteurs'}
            </span>

            <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasStartupLabel}
                onChange={(e) => setHasStartupLabel(e.target.checked)}
                className="rounded-md text-[#15392B] focus:ring-[#15392B] accent-[#15392B] w-4 h-4 cursor-pointer"
              />
              <span className="font-medium">{isRtl ? 'حاصل على علامة Startup Act الرسمية' : 'Détient le Label Startup Act officiel'}</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isYouthLed}
                onChange={(e) => setIsYouthLed(e.target.checked)}
                className="rounded-md text-[#15392B] focus:ring-[#15392B] accent-[#15392B] w-4 h-4 cursor-pointer"
              />
              <span className="font-medium">{isRtl ? 'باعث شاب (أقل من 35 سنة)' : 'Jeune entrepreneur (< 35 ans)'}</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isWomenLed}
                onChange={(e) => setIsWomenLed(e.target.checked)}
                className="rounded-md text-[#15392B] focus:ring-[#15392B] accent-[#15392B] w-4 h-4 cursor-pointer"
              />
              <span className="font-medium">{isRtl ? 'مؤسسة تديرها أو أسستها امرأة' : 'Entreprise dirigée ou fondée par une femme'}</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isGraduateLed}
                onChange={(e) => setIsGraduateLed(e.target.checked)}
                className="rounded-md text-[#15392B] focus:ring-[#15392B] accent-[#15392B] w-4 h-4 cursor-pointer"
              />
              <span className="font-medium">{isRtl ? 'حامل شهادة جامعية عليا' : "Diplômé de l'enseignement supérieur"}</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isDiasporaTRE}
                onChange={(e) => setIsDiasporaTRE(e.target.checked)}
                className="rounded-md text-[#15392B] focus:ring-[#15392B] accent-[#15392B] w-4 h-4 cursor-pointer"
              />
              <span className="font-medium">{isRtl ? 'تونسي مقيم بالخارج (TRE)' : 'Tunisien Résidant à l\'Étranger (Diaspora TRE)'}</span>
            </label>
          </div>

        </div>

        {/* Right Column: Matched Programs & Scored Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Results Summary Stats Banner */}
          <div className="p-6 rounded-2xl bg-[#15392B] text-white shadow-xs border border-emerald-950 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-emerald-200/80 block font-semibold mb-1">
                {isRtl ? 'نتائج المطابقة المخصصة' : 'Résultats de matching personnalisés'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isRtl 
                  ? `${highlyEligibleCount} برامج ذات توافق عالٍ`
                  : `${highlyEligibleCount} dispositif${highlyEligibleCount > 1 ? 's' : ''} hautement compatible${highlyEligibleCount > 1 ? 's' : ''}`}
              </div>
              <p className="text-xs text-emerald-100/80 mt-1 max-w-md">
                {isRtl
                  ? `من بين ${programs.length} آلية تمويل لاحتياج ${formatTND(amountNeededTND, lang)} في ${currentGov.nameAr}.`
                  : `Sur ${programs.length} guichets vérifiés pour un besoin de ${formatTND(amountNeededTND, lang)} à ${currentGov.nameFr}.`}
              </p>
            </div>

            {selectedForCompare.length > 0 && (
              <button
                onClick={onOpenCompare}
                className="px-4 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#EAB308] text-stone-950 font-bold text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>{isRtl ? `مقارنة المحددة (${selectedForCompare.length})` : `Comparer la sélection (${selectedForCompare.length})`}</span>
              </button>
            )}
          </div>

          {/* Tabs Filter (All, Highly Eligible, Conditional) */}
          <div className="flex items-center gap-2 border-b border-stone-200/80 pb-2 text-xs overflow-x-auto">
            <button
              onClick={() => setFilterResultTab('all')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filterResultTab === 'all'
                  ? 'bg-[#15392B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {isRtl ? `كافة النتائج (${rankedResults.length})` : `Tous les résultats (${rankedResults.length})`}
            </button>

            <button
              onClick={() => setFilterResultTab('highly_eligible')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                filterResultTab === 'highly_eligible'
                  ? 'bg-[#15392B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isRtl ? `توافق مرتفع (${highlyEligibleCount})` : `Forte éligibilité (${highlyEligibleCount})`}</span>
            </button>

            <button
              onClick={() => setFilterResultTab('conditional')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                filterResultTab === 'conditional'
                  ? 'bg-[#15392B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{isRtl ? `بشروط إضافية (${conditionalCount})` : `Sous conditions (${conditionalCount})`}</span>
            </button>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {displayResults.map((result) => {
              const isSelected = selectedForCompare.some(p => p.id === result.program.id);
              const badge = getCategoryBadge(result.program.category, lang);

              return (
                <div
                  key={result.programId}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs hover:shadow-md ${
                    result.qualificationStatus === 'highly_eligible'
                      ? 'border-emerald-200 ring-1 ring-emerald-500/20'
                      : result.qualificationStatus === 'conditional_match'
                      ? 'border-amber-200'
                      : 'border-stone-200 opacity-75'
                  }`}
                >
                  {/* Top Bar: Institution, Name, Match Score Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          {result.program.institution}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-stone-900">
                        {isRtl && result.program.nameAr ? result.program.nameAr : result.program.name}
                      </h3>
                      {result.program.nameAr && (
                        <p className="text-xs text-stone-500 font-arabic mt-0.5">
                          {isRtl ? result.program.name : result.program.nameAr}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`px-3 py-1 rounded-xl font-black text-sm sm:text-base border shadow-xs ${
                        result.matchScore >= 80 
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : result.matchScore >= 60
                          ? 'bg-amber-500 text-stone-950 border-amber-500'
                          : 'bg-stone-200 text-stone-700 border-stone-300'
                      }`}>
                        {result.matchScore}%
                      </div>
                      <span className="text-[10px] text-stone-500 font-medium block mt-0.5">
                        {result.qualificationStatus === 'highly_eligible' 
                          ? (isRtl ? 'توافق ممتاز' : 'Fortement Recommandé')
                          : result.qualificationStatus === 'conditional_match' 
                          ? (isRtl ? 'مؤهل مع شروط' : 'Éligible sous réserve')
                          : (isRtl ? 'توافق محدود' : 'Faible compatibilité')}
                      </span>
                    </div>
                  </div>

                  {/* Financial & Operational specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-stone-50/70 rounded-xl border border-stone-200/60 text-xs mb-3.5">
                    <div>
                      <span className="text-[11px] text-stone-500 block">
                        {isRtl ? 'المبلغ' : 'Fourchette'}
                      </span>
                      <strong className="text-stone-900 font-bold">
                        {formatTND(result.program.minAmountTND, lang)} - {formatTND(result.program.maxAmountTND, lang)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-stone-500 block">
                        {isRtl ? 'التكلفة' : 'Coût du Capital'}
                      </span>
                      <strong className="text-[#15392B] font-semibold truncate block" title={result.program.costTypeLabel}>
                        {result.program.costTypeLabel}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-stone-500 block">
                        {isRtl ? 'المدة' : 'Instruction'}
                      </span>
                      <strong className="text-stone-900 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {isRtl ? `~${result.program.turnaroundTimeWeeks} أسابيع` : `~${result.program.turnaroundTimeWeeks} sem.`}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-stone-500 block">
                        {isRtl ? 'الضمان' : 'Garanties'}
                      </span>
                      <strong className="text-stone-900 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#15392B]" />
                        {result.program.collateralLevel === 'none' 
                          ? (isRtl ? 'بدون ضمان' : 'Aucune') 
                          : result.program.collateralLevel === 'sotugar_supported' 
                          ? 'SOTUGAR' 
                          : (isRtl ? 'التزام' : 'Engagement')}
                      </strong>
                    </div>
                  </div>

                  {/* Strengths & Bonus Factors */}
                  {result.strengths.length > 0 && (
                    <div className="mb-2 text-xs text-stone-700">
                      <span className="font-semibold text-[#15392B] block mb-1">
                        {isRtl ? '✓ شروط الأهلية المستوفاة :' : '✓ Facteurs de compatibilité validés :'}
                      </span>
                      <ul className="space-y-1">
                        {result.strengths.slice(0, 3).map((st, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-stone-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#15392B] shrink-0 mt-0.5" />
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bonus Factors (ZDR, Youth, Women, Diaspora) */}
                  {result.bonusFactors.length > 0 && (
                    <div className="mb-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-[#15392B]">
                      {result.bonusFactors.map((bonus, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-[#15392B] shrink-0" />
                          <span>{bonus}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Potential Roadblocks & Actionable Recommendations */}
                  {result.blockers.length > 0 && (
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950">
                      <span className="font-bold flex items-center gap-1 text-amber-900 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        {isRtl ? 'نقاط تستوجب الانتباه :' : 'Points de vigilance à anticiper :'}
                      </span>
                      <ul className="space-y-0.5 pl-4 list-disc text-stone-700">
                        {result.blockers.map((blk, idx) => (
                          <li key={idx}>{blk}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Card Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => onToggleCompare(result.program)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#15392B] text-white border-[#15392B]'
                          : 'bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>
                        {isSelected 
                          ? (isRtl ? 'محدد في المقارنة' : 'Sélectionné pour comparatif') 
                          : (isRtl ? 'إضافة إلى المقارنة' : 'Ajouter au comparatif')}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenDetails(result.program)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#15392B] hover:bg-emerald-50 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'التفاصيل والوثائق' : 'Fiche détaillée & Documents'}</span>
                      </button>

                      <a
                        href={result.program.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-[#15392B] hover:bg-[#0f2a20] text-white text-xs font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>{isRtl ? 'التقديم' : 'Candidater'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
