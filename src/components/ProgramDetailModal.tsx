import React from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  Layers, 
  Check, 
  Calculator,
  Calendar,
  Sparkles,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { FinancingProgram } from '../types';
import { formatTND, getCategoryBadge } from '../utils/formatters';
import { Language } from '../utils/i18n';

interface ProgramDetailModalProps {
  program: FinancingProgram | null;
  onClose: () => void;
  onToggleCompare: (program: FinancingProgram) => void;
  isSelectedForCompare: boolean;
  onSelectForSimulator?: (program: FinancingProgram) => void;
  lang?: Language;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  onClose,
  onToggleCompare,
  isSelectedForCompare,
  onSelectForSimulator,
  lang = 'fr',
}) => {
  if (!program) return null;

  const isRtl = lang === 'ar';
  const badge = getCategoryBadge(program.category, lang);

  const getCollateralText = () => {
    if (program.collateralLevel === 'none') {
      return isRtl ? 'بدون ضمانات' : 'Aucune caution';
    }
    if (program.collateralLevel === 'sotugar_supported') {
      return isRtl ? 'ضمان SOTUGAR (60-80%)' : 'SOTUGAR (60-80%)';
    }
    if (program.collateralLevel === 'honor_pledge') {
      return isRtl ? 'التزام شرف' : "Sur l'honneur";
    }
    return isRtl ? 'ضمانات عينية / رهن' : 'Garanties réelles';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#F7F4EE] w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-300/80 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#15392B] text-stone-100 border-b border-emerald-950 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
                {badge.label}
              </span>
              <span className="text-xs text-emerald-200/80 font-medium flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-300" />
                {program.institution}
              </span>
              <span className="text-xs text-amber-300 font-medium">
                · {isRtl ? `موثق ${program.verifiedYear}` : `Vérifié ${program.verifiedYear}`}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isRtl && program.nameAr ? program.nameAr : program.name}
            </h2>
            {program.nameAr && (
              <p className="text-sm text-emerald-200/70 font-arabic mt-1">
                {isRtl ? program.name : program.nameAr}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="px-6 py-6 overflow-y-auto space-y-6 text-stone-800">
          
          {/* Key Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block mb-1">
                {isRtl ? 'مبلغ التمويل' : 'Montant Financement'}
              </span>
              <div className="text-base font-bold text-stone-900">
                {formatTND(program.minAmountTND, lang)} - {formatTND(program.maxAmountTND, lang)}
              </div>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                {isRtl 
                  ? `المبلغ المعتاد : ${program.typicalTicketTND ? formatTND(program.typicalTicketTND, lang) : 'متغير'}`
                  : `Ticket typique : ${program.typicalTicketTND ? formatTND(program.typicalTicketTND, lang) : 'Variable'}`}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block mb-1">
                {isRtl ? 'تكلفة التمويل' : 'Coût du Capital'}
              </span>
              <div className="text-base font-bold text-[#15392B]">
                {program.costTypeLabel}
              </div>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                {program.equityDilutionRange 
                  ? (isRtl ? `نسبة المساهمة : ${program.equityDilutionRange}` : `Dilution : ${program.equityDilutionRange}`) 
                  : (isRtl ? 'بدون تنازل عن رأس المال' : 'Sans cession de capital')}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block mb-1">
                {isRtl ? 'المدة وفترة الإمهال' : 'Durée & Franchise'}
              </span>
              <div className="text-base font-bold text-stone-900">
                {program.repaymentDurationYears > 0 
                  ? (isRtl ? `${program.repaymentDurationYears} سنوات` : `${program.repaymentDurationYears} ans`) 
                  : (isRtl ? 'غير قابل للاسترداد' : 'Non remboursable')}
              </div>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                {program.hasGracePeriod 
                  ? (isRtl ? `إمهال : ${program.gracePeriodMonths} أشهر` : `Franchise : ${program.gracePeriodMonths} mois`) 
                  : (isRtl ? 'بدون فترة إمهال' : 'Sans différé')}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block mb-1">
                {isRtl ? 'الضمانات المطلوبة' : 'Garanties Requises'}
              </span>
              <div className="text-base font-bold text-stone-900 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {getCollateralText()}
              </div>
              <span className="text-[11px] text-stone-500 block mt-0.5 truncate" title={program.collateralDetails}>
                {program.collateralDetails}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-2">
              {isRtl ? 'التعريف ببرنامج التمويل' : 'Présentation du Dispositif'}
            </h3>
            <p className="text-stone-700 leading-relaxed text-sm bg-stone-50/50 p-4 rounded-xl border border-stone-100">
              {program.description}
            </p>
          </div>

          {/* Eligibility & Target criteria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                {isRtl ? 'شروط الأهلية والقبول' : "Critères d'Éligibilité"}
              </h4>
              <ul className="space-y-2 text-xs text-stone-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-stone-900 w-28 shrink-0">
                    {isRtl ? 'المراحل المستهدفة :' : 'Stades visés :'}
                  </span>
                  <span>{program.stages.map(s => s.toUpperCase()).join(', ')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-stone-900 w-28 shrink-0">
                    {isRtl ? 'الشكل القانوني :' : 'Formes juridiques :'}
                  </span>
                  <span>{program.legalForms.join(', ').toUpperCase()}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-stone-900 w-28 shrink-0">
                    {isRtl ? 'القطاعات المعنية :' : 'Secteurs cibles :'}
                  </span>
                  <span>
                    {program.sectors.includes('all') 
                      ? (isRtl ? 'كافة القطاعات الاقتصادية' : 'Tous secteurs marchands') 
                      : program.sectors.join(', ')}
                  </span>
                </li>
                {program.isStartupActExclusive && (
                  <li className="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium">
                    {isRtl 
                      ? '⚠️ يتطلب وجوباً علامة مؤسسة ناشئة (Label Startup Act) المسندة من طرف Smart Capital.' 
                      : '⚠️ Nécessite obligatoirement le Label Startup Act octroyé par Smart Capital.'}
                  </li>
                )}
                {program.isZdrAdvantaged && (
                  <li className="p-2 rounded-lg bg-cyan-50 text-cyan-900 border border-cyan-200 text-xs font-medium flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-700 shrink-0" />
                    {isRtl 
                      ? 'امتيازات معززة ومنح إضافية لمشاريع التنمية الجهوية (ZDR).' 
                      : 'Avantages renforcés et primes majorées pour implantations en Zone de Développement Régional (ZDR).'}
                  </li>
                )}
              </ul>
            </div>

            {/* Pros and Cons */}
            <div className="p-4 rounded-xl bg-white border border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {isRtl ? 'أهم الامتيازات والالتزامات' : 'Atouts Clés & Engagements'}
              </h4>
              <ul className="space-y-2 text-xs text-stone-700">
                {program.keyBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
                {program.keyConditions.map((condition, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-stone-600">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Required Documents Checklist (Tunisian dossier) */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-700" />
              {isRtl ? 'الوثائق المطلوبة لتجهيز الملف' : 'Pièces Justificatives Requises (Dossier Type)'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {program.requiredDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-stone-200">
                  <div className="w-4 h-4 rounded-full bg-[#15392B] text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-stone-800">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Process & Contacts */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-bold text-[#15392B] block mb-1">
                {isRtl ? 'إجراءات إيداع الملف :' : 'Procédure de Dépôt :'}
              </span>
              <p className="text-stone-700 max-w-xl leading-relaxed">{program.applicationProcedure}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-2 text-stone-600">
                {program.contactEmail && (
                  <span className="flex items-center gap-1 text-[#15392B] font-medium">
                    <Mail className="w-3.5 h-3.5" /> {program.contactEmail}
                  </span>
                )}
                {program.contactPhone && (
                  <span className="flex items-center gap-1 text-[#15392B] font-medium">
                    <Phone className="w-3.5 h-3.5" /> {program.contactPhone}
                  </span>
                )}
              </div>
            </div>

            <a
              href={program.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#15392B] hover:bg-[#0f2a20] text-white font-semibold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <span>{isRtl ? 'البوابة الرسمية' : 'Portail Officiel'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-[#F7F4EE] border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onToggleCompare(program)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border cursor-pointer ${
              isSelectedForCompare
                ? 'bg-[#15392B] text-white border-[#15392B]'
                : 'bg-white text-stone-700 border-stone-300/80 hover:bg-stone-50'
            }`}
          >
            {isSelectedForCompare ? (
              <>
                <Check className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? 'محدد في المقارنة' : 'Sélectionné pour comparaison'}</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" />
                <span>{isRtl ? 'إضافة إلى المقارنة' : 'Ajouter au comparateur'}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {onSelectForSimulator && (
              <button
                onClick={() => {
                  onSelectForSimulator(program);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-white border border-stone-300/80 hover:bg-stone-50 text-[#15392B] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-[#15392B]" />
                {isRtl ? 'محاكاة الأقساط' : 'Simuler les échéances'}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              {isRtl ? 'إغلاق' : 'Fermer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
