import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Plus, 
  Check, 
  Award, 
  MapPin, 
  Percent, 
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { FinancingProgram } from '../types';
import { formatTND, getCategoryBadge } from '../utils/formatters';
import { Language } from '../utils/i18n';

interface ProgramCardProps {
  program: FinancingProgram;
  isSelectedForCompare: boolean;
  onToggleCompare: (program: FinancingProgram) => void;
  onOpenDetails: (program: FinancingProgram) => void;
  eligibilityScore?: number;
  lang?: Language;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  isSelectedForCompare,
  onToggleCompare,
  onOpenDetails,
  eligibilityScore,
  lang = 'fr',
}) => {
  const isRtl = lang === 'ar';
  const badge = getCategoryBadge(program.category, lang);

  const getCollateralLabel = () => {
    if (program.collateralLevel === 'none') {
      return isRtl ? 'بدون ضمانات' : 'Aucune';
    }
    if (program.collateralLevel === 'sotugar_supported') {
      return isRtl ? 'ضمان SOTUGAR' : 'SOTUGAR';
    }
    if (program.collateralLevel === 'honor_pledge') {
      return isRtl ? 'التزام شرف' : "Sur l'honneur";
    }
    return isRtl ? 'ضمان عيني / رهن' : 'Réelle / Hypoth.';
  };

  return (
    <div 
      className={`group relative bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
        isSelectedForCompare 
          ? 'border-[#15392B] ring-2 ring-[#15392B]/20' 
          : 'border-stone-200/80 hover:border-stone-300'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top micro badges */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
              {badge.label}
            </span>

            {program.isStartupActExclusive && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {isRtl ? 'ستارتاب آكت' : 'Startup Act'}
              </span>
            )}

            {program.isZdrAdvantaged && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#15392B] border border-emerald-200/80 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-700" />
                {isRtl ? 'تنمية جهوية ZDR' : 'Bonus ZDR'}
              </span>
            )}

            {program.isIslamicCompliant && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/80">
                {isRtl ? 'متوافق مع الشريعة' : "Chari'a Compatible"}
              </span>
            )}
          </div>

          {/* Compare toggle button */}
          <button
            onClick={() => onToggleCompare(program)}
            className={`p-1.5 px-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 border cursor-pointer ${
              isSelectedForCompare
                ? 'bg-[#15392B] text-white border-[#15392B]'
                : 'bg-stone-50 text-stone-600 border-stone-200/80 hover:bg-stone-100 hover:text-stone-900'
            }`}
            title={isSelectedForCompare ? (isRtl ? "إلغاء المقارنة" : "Retirer du comparateur") : (isRtl ? "إضافة للمقارنة" : "Ajouter au comparateur")}
          >
            {isSelectedForCompare ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">{isRtl ? 'تمت الإضافة' : 'Comparé'}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span className="text-[11px]">{isRtl ? 'مقارنة' : 'Comparer'}</span>
              </>
            )}
          </button>
        </div>

        {/* Institution & Title */}
        <div className="mb-2">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-0.5 flex items-center justify-between">
            <span>{program.institution}</span>
            {eligibilityScore !== undefined && (
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                eligibilityScore >= 75 ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                eligibilityScore >= 50 ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-rose-100 text-rose-900 border border-rose-200'
              }`}>
                {isRtl ? `نسبة التوافق : ${eligibilityScore}%` : `Score : ${eligibilityScore}%`}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-stone-900 leading-snug group-hover:text-[#15392B] transition-colors">
            {isRtl && program.nameAr ? program.nameAr : program.name}
          </h3>
          {program.nameAr && (
            <p className="text-xs text-stone-500 font-arabic mt-0.5 line-clamp-1">
              {isRtl ? program.name : program.nameAr}
            </p>
          )}
        </div>

        {/* Tagline */}
        <p className="text-xs text-stone-600 mb-4 line-clamp-2 leading-relaxed">
          {program.tagline}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 p-3.5 bg-stone-50/70 rounded-2xl border border-stone-200/60 mb-4 text-xs">
          <div>
            <span className="text-[11px] text-stone-500 block">
              {isRtl ? 'مبلغ التمويل' : 'Ticket Financement'}
            </span>
            <span className="font-bold text-stone-900">
              {formatTND(program.minAmountTND, lang)} - {formatTND(program.maxAmountTND, lang)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-stone-500 block">
              {isRtl ? 'تكلفة التمويل' : 'Coût du Capital'}
            </span>
            <span className="font-semibold text-stone-900 truncate block" title={program.costTypeLabel}>
              {program.costTypeLabel}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-stone-500 block">
              {isRtl ? 'مدة دراسة الملف' : "Délai d'Instruction"}
            </span>
            <span className="font-medium text-stone-800 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {isRtl ? `~${program.turnaroundTimeWeeks} أسابيع` : `~${program.turnaroundTimeWeeks} sem.`}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-stone-500 block">
              {isRtl ? 'الضمان المطلوب' : 'Garantie exigée'}
            </span>
            <span className="font-medium text-stone-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#15392B]" />
              {getCollateralLabel()}
            </span>
          </div>
        </div>

        {/* Key Benefits Bullets */}
        <ul className="space-y-1.5 mb-4 text-xs text-stone-600">
          {program.keyBenefits.slice(0, 2).map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#15392B] shrink-0 mt-0.5" />
              <span className="line-clamp-1">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3.5 bg-stone-50/70 border-t border-stone-200/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
          <CheckCircle className="w-3.5 h-3.5 text-[#15392B]" />
          <span>{isRtl ? `موثق ${program.verifiedYear}` : `Vérifié ${program.verifiedYear}`}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDetails(program)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#15392B] hover:text-[#0f2a20] hover:bg-emerald-50 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            {isRtl ? 'تفاصيل الآلية' : 'Fiche complète'}
          </button>

          <a
            href={program.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer"
            title={isRtl ? "البوابة الرسمية" : "Accéder au portail officiel"}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
