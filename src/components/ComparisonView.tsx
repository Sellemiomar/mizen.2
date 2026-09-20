import React, { useState } from 'react';
import { 
  Layers, 
  X, 
  Plus, 
  Check, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Building2, 
  ExternalLink, 
  Percent, 
  HelpCircle,
  Download,
  Share2,
  Printer,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { FinancingProgram } from '../types';
import { formatTND, getCategoryBadge } from '../utils/formatters';

interface ComparisonViewProps {
  programs: FinancingProgram[];
  selectedPrograms: FinancingProgram[];
  onRemoveProgram: (programId: string) => void;
  onAddProgram: (program: FinancingProgram) => void;
  onOpenDetails: (program: FinancingProgram) => void;
  onSelectForSimulator: (program: FinancingProgram) => void;
  onClearAll: () => void;
  lang?: 'ar' | 'fr';
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  programs,
  selectedPrograms,
  onRemoveProgram,
  onAddProgram,
  onOpenDetails,
  onSelectForSimulator,
  onClearAll,
  lang = 'fr',
}) => {
  const isRtl = lang === 'ar';
  const [highlightDifferences, setHighlightDifferences] = useState<boolean>(true);
  const [isAddPickerOpen, setIsAddPickerOpen] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Available programs that are not yet selected
  const availableToAdd = programs.filter(
    (p) => !selectedPrograms.some((sp) => sp.id === p.id)
  );

  const handleCopySummary = () => {
    const text = selectedPrograms.map(p => 
      `${isRtl && p.nameAr ? p.nameAr : p.name} (${p.institution}) | ${isRtl ? 'المبلغ' : 'Montant'}: ${formatTND(p.minAmountTND, lang)} - ${formatTND(p.maxAmountTND, lang)} | ${isRtl ? 'التكلفة' : 'Coût'}: ${p.costTypeLabel} | ${isRtl ? 'الإمهال' : 'Franchise'}: ${p.gracePeriodMonths} ${isRtl ? 'شهر' : 'mois'} | ${isRtl ? 'الضمانات' : 'Garanties'}: ${p.collateralDetails}`
    ).join('\n\n');

    navigator.clipboard.writeText(`Mizen - ${isRtl ? 'مقارنة آليات التمويل في تونس' : 'Comparatif Financements Tunisie'} :\n\n${text}`);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (selectedPrograms.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-stone-200/80 shadow-xs text-center max-w-2xl mx-auto my-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#15392B] flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <Layers className="w-8 h-8 text-[#15392B]" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">
          {isRtl ? 'لم يتم تحديد أي برنامج للمقارنة' : 'Aucun dispositif sélectionné pour comparaison'}
        </h2>
        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
          {isRtl
            ? 'اختر بين 2 و 4 آليات تمويل من الدليل أو من محرك المطابقة لمقارنة شروطها جنباً إلى جنب (نسبة الفائدة، فترة الإمهال، ضمان SOTUGAR، وآجال الصرف).'
            : 'Sélectionnez entre 2 et 4 dispositifs depuis le Catalogue ou le Moteur d\'éligibilité pour comparer leurs conditions côte à côte (taux d\'intérêt, franchise, garantie SOTUGAR, délais).'}
        </p>

        <div className="space-y-3">
          <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">
            {isRtl ? 'اقتراحات مقارنة شائعة :' : 'Suggestions de comparaisons fréquentes :'}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                const p1 = programs.find(p => p.id === 'startup-act-air');
                const p2 = programs.find(p => p.id === 'reseau-entreprendre-tunisie');
                const p3 = programs.find(p => p.id === 'flat6labs-tunis-fund');
                if (p1) onAddProgram(p1);
                if (p2) onAddProgram(p2);
                if (p3) onAddProgram(p3);
              }}
              className="px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
            >
              🌱 {isRtl 
                ? 'مقارنة مرحلة الانطلاق : منحة AIR vs قرض شرف Réseau Entreprendre vs مساهمة Flat6Labs' 
                : 'Comparatif Amorçage : AIR (Subvention) vs Réseau Entreprendre (Prêt 0%) vs Flat6Labs (Equity)'}
            </button>

            <button
              onClick={() => {
                const p1 = programs.find(p => p.id === 'bfpme-pme-credit');
                const p2 = programs.find(p => p.id === 'foprodi-apii');
                const p3 = programs.find(p => p.id === 'biat-ligne-sme-recovery');
                if (p1) onAddProgram(p1);
                if (p2) onAddProgram(p2);
                if (p3) onAddProgram(p3);
              }}
              className="px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
            >
              🏭 {isRtl 
                ? 'مقارنة المؤسسات الصغرى والمتوسطة : BFPME vs FOPRODI (APII) vs خط تمويل BIAT' 
                : 'Comparatif PME & Usine : BFPME vs FOPRODI (APII) vs BIAT Ligne PME'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Top Header & Actions */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#15392B] text-xs font-bold">
              {isRtl ? 'مقارن الآليات متعدد الأبعاد' : 'Comparateur Multidimensionnel'}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {isRtl 
                ? `${selectedPrograms.length} برامج للمقارنة (أقصى حد 4)`
                : `${selectedPrograms.length} programme${selectedPrograms.length > 1 ? 's' : ''} comparé${selectedPrograms.length > 1 ? 's' : ''} (Max 4)`}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            {isRtl ? 'تحليل مقارن لشروط وآليات التمويل' : 'Analyse comparative des conditions de financement'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Highlight toggle */}
          <button
            onClick={() => setHighlightDifferences(!highlightDifferences)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              highlightDifferences
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isRtl ? 'إبراز الفوارق الرئيسية' : 'Surligner les écarts clés'}</span>
          </button>

          {/* Add more button */}
          {selectedPrograms.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setIsAddPickerOpen(!isAddPickerOpen)}
                className="px-3.5 py-2 rounded-xl bg-[#15392B] hover:bg-[#0f2a20] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إضافة آلية أخرى' : 'Ajouter un dispositif'}</span>
              </button>

              {isAddPickerOpen && (
                <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-2 w-72 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-xl border border-stone-200/80 z-50 p-2 space-y-1`}>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-2 py-1">
                    {isRtl ? 'اختر آلية تمويل :' : 'Choisir un dispositif :'}
                  </div>
                  {availableToAdd.map((prog) => (
                    <button
                      key={prog.id}
                      onClick={() => {
                        onAddProgram(prog);
                        setIsAddPickerOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-stone-800 hover:bg-stone-100 transition-colors flex items-start justify-between gap-2 cursor-pointer"
                    >
                      <div>
                        <div className="font-bold line-clamp-1">{isRtl && prog.nameAr ? prog.nameAr : prog.name}</div>
                        <div className="text-[11px] text-stone-500">{prog.institution}</div>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Copy and Print tools */}
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title={isRtl ? 'نسخ الملخص' : 'Copier le résumé'}
          >
            {copiedNotification ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">{isRtl ? 'تم النسخ !' : 'Copié !'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-stone-500" />
                <span>{isRtl ? 'نسخ' : 'Copier'}</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title={isRtl ? 'طباعة' : 'Imprimer'}
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">{isRtl ? 'طباعة' : 'Imprimer'}</span>
          </button>

          <button
            onClick={onClearAll}
            className="px-3 py-1.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 text-xs font-medium transition-colors cursor-pointer"
          >
            {isRtl ? 'إفراغ' : 'Vider'}
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            
            {/* Table Header: Program Cards */}
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80">
                <th className={`p-4 sm:p-5 w-48 sm:w-60 text-xs font-bold uppercase tracking-wider text-stone-500 bg-stone-100/70 sticky ${isRtl ? 'right-0' : 'left-0'} z-20`}>
                  {isRtl ? 'معايير المقارنة' : "Critères d'analyse"}
                </th>
                {selectedPrograms.map((p) => {
                  const badge = getCategoryBadge(p.category, lang);
                  return (
                    <th key={p.id} className="p-4 sm:p-5 w-72 align-top text-stone-900 border-l border-stone-200">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <button
                          onClick={() => onRemoveProgram(p.id)}
                          className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title={isRtl ? 'حذف من المقارن' : 'Retirer du comparateur'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs font-semibold text-stone-500 mb-0.5 uppercase tracking-wider">
                        {p.institution}
                      </div>
                      <div className="font-bold text-base text-stone-900 leading-snug mb-2">
                        {isRtl && p.nameAr ? p.nameAr : p.name}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-stone-200/60">
                        <button
                          onClick={() => onOpenDetails(p)}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-[#15392B] bg-emerald-50 hover:bg-emerald-100/80 transition-colors cursor-pointer"
                        >
                          {isRtl ? 'بطاقة مفصلة' : 'Fiche complète'}
                        </button>

                        <button
                          onClick={() => onSelectForSimulator(p)}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/80 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Calculator className="w-3 h-3 text-[#15392B]" />
                          {isRtl ? 'محاكاة' : 'Simuler'}
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body Groups */}
            <tbody className="divide-y divide-stone-200 text-xs text-stone-800">
              
              {/* SECTION: MONTANTS & FINANCES */}
              <tr className="bg-stone-100/70">
                <td colSpan={selectedPrograms.length + 1} className="py-2.5 px-4 sm:px-5 font-bold uppercase tracking-wider text-stone-700 text-[11px]">
                  {isRtl ? '1. المؤشرات المالية والتكلفة' : '1. Paramètres Financiers & Coût'}
                </td>
              </tr>

              <tr>
                <td className={`p-4 font-semibold text-stone-700 bg-stone-50/50 sticky ${isRtl ? 'right-0' : 'left-0'}`}>
                  {isRtl ? 'سقف التمويل' : 'Fourchette de Financement'}
                </td>
                {selectedPrograms.map((p) => (
                  <td key={p.id} className="p-4 border-l border-stone-200">
                    <div className="font-bold text-sm text-stone-900">
                      {formatTND(p.minAmountTND, lang)} - {formatTND(p.maxAmountTND, lang)}
                    </div>
                    {p.typicalTicketTND && (
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        {isRtl ? 'المبلغ المعتاد :' : 'Ticket moyen :'} {formatTND(p.typicalTicketTND, lang)}
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              <tr className={highlightDifferences ? 'bg-amber-50/20' : ''}>
                <td className={`p-4 font-semibold text-stone-700 bg-stone-50/50 sticky ${isRtl ? 'right-0' : 'left-0'}`}>
                  {isRtl ? 'تكلفة التمويل / النسبة' : 'Coût du Capital / Taux'}
                </td>
                {selectedPrograms.map((p) => (
                  <td key={p.id} className="p-4 border-l border-stone-200">
                    <div className="font-bold text-cyan-800 text-xs">
                      {p.costTypeLabel}
                    </div>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      {p.category === 'grant' 
                        ? (isRtl ? 'غير قابلة للاسترجاع (بدون أي أعباء مالية)' : 'Non remboursable (0 charge financière)')
                        : p.category === 'honor_loan' 
                        ? (isRtl ? 'قرض شرف بنسبة فائدة 0%' : 'Prêt à taux zéro sans intérêt')
                        : p.category === 'venture_capital' 
                        ? (isRtl ? `نسبة المساهمة : ${p.equityDilutionRange || 'مساهمة أقلية'}` : `Dilution : ${p.equityDilutionRange || 'Cession minoritaire'}`)
                        : (isRtl ? `أساس الحساب : ${p.interestRateNumeric}% سنوياً` : `Base de calcul : ${p.interestRateNumeric}% annuel`)}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className={`p-4 font-semibold text-stone-700 bg-stone-50/50 sticky ${isRtl ? 'right-0' : 'left-0'}`}>
                  {isRtl ? 'فترة الإمهال (Franchise)' : 'Période de Grâce (Franchise)'}
                </td>
                {selectedPrograms.map((p) => (
                  <td key={p.id} className="p-4 border-l border-stone-200">
                    {p.hasGracePeriod ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        {p.gracePeriodMonths} {isRtl ? 'شهراً إمهال' : 'mois de franchise'}
                      </span>
                    ) : (
                      <span className="text-stone-500 font-medium">
                        {isRtl ? 'بدون فترة إمهال (أو منحة)' : 'Aucun différé (ou non remboursable)'}
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className={`p-4 font-semibold text-stone-700 bg-stone-50/50 sticky ${isRtl ? 'right-0' : 'left-0'}`}>
                  {isRtl ? 'مدة السداد' : 'Durée de Remboursement'}
                </td>
                {selectedPrograms.map((p) => (
                  <td key={p.id} className="p-4 border-l border-stone-200">
                    <span className="font-medium text-stone-900">
                      {p.repaymentDurationYears > 0 
                        ? (isRtl ? `${p.repaymentDurationYears} سنوات` : `${p.repaymentDurationYears} ans`) 
                        : (isRtl ? 'لا ينطبق (منحة / مساهمة رأس مال)' : 'Aucun (Don/Equity)')}
                    </span>
                  </td>
                ))}
              </tr>

              {/* SECTION: GARANTIES ET RISQUE */}
              <tr className="bg-stone-100/70">
                <td colSpan={selectedPrograms.length + 1} className="py-2.5 px-4 sm:px-5 font-bold uppercase tracking-wider text-stone-700 text-[11px]">
                  {isRtl ? '2. المخاطر والضمانات البنكية' : '2. Risque, Garanties & Collatéral'}
                </td>
              </tr>

              <tr className={highlightDifferences ? 'bg-teal-50/20' : ''}>
                <td className={`p-4 font-semibold text-stone-700 bg-stone-50/50 sticky ${isRtl ? 'right-0' : 'left-0'}`}>
                  {isRtl ? 'مستوى الضمان المشترط' : 'Niveau de Garantie Exigé'}
                </td>
                {selectedPrograms.map((p) => (
                  <td key={p.id} className="p-4 border-l border-stone-200">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>
                        {p.collateralLevel === 'none' 
                          ? (isRtl ? 'بدون أي رهن عيني (0 ضمان)' : 'Zéro caution (0 collatéral)') 
                          : p.collateralLevel === 'sotugar_supported' 
                          ? (isRtl ? 'تغطية بواسطة SOTUGAR (60-80%)' : 'Couvert par SOTUGAR (60-80%)') 
                          : p.collateralLevel === 'honor_pledge' 
                          ? (isRtl ? 'التزام شرفي بدون رهن' : "Caution morale / Sur l'honneur") 
                          : (isRtl ? 'ضمانات عينية / رهن عقاري' : 'Garanties réelles / Hypothèque')}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {p.collateralDetails}
                    </p>
                  </td>
                ))}
              </tr>

              <tr>
                <td className={`p-4 font-semibold text-stone-700 bg-stone-50/50 sticky ${isRtl ? 'right-0' : 'left-0'}`}>
                  {isRtl ? 'متوسط أجل دراسة الملف' : "Délai Moyen d'Instruction"}
                </td>
                {selectedPrograms.map((p) => (
                  <td key={p.id} className="p-4 border-l border-stone-200">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-stone-400" />
                      {isRtl ? `~${p.turnaroundTimeWeeks} أسابيع` : `~${p.turnaroundTimeWeeks} semaines`}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      {p.turnaroundTimeWeeks <= 2 
                        ? (isRtl ? '⚡ معالجة سريعة' : '⚡ Traitement Express')
                        : p.turnaroundTimeWeeks <= 6 
                        ? (isRtl ? 'أجل عادي' : 'Délai standard') 
                        : (isRtl ? 'لجنة قرار معمقة' : "Comité d'engagement approfondi")}
                    </span>
                  </td>
                ))}
              </tr>

              {/* SECTION: ÉLIGIBILITÉ ET SPÉCIFICITÉS */}
              <tr className="bg-stone-100/70">
                <td colSpan={selectedPrograms.length + 1} className="py-2.5 px-4 sm:px-5 font-bold uppercase tracking-wider text-stone-700 text-[11px]">
                  {isRtl ? '3. شروط الأهلية والخصوصيات' : '3. Spécificités & Éligibilité'}
                </td>
              </tr>

              <tr>
                <td className={`p-4 font-semibold text-stone-700 bg-stone-50/50 sticky ${isRtl ? 'right-0' : 'left-0'}`}>
                  {isRtl ? 'شرط علامة Startup Act' : 'Exigence Startup Act'}
                </td>
                {selectedPrograms.map((p) => (
                  <td key={p.id} className="p-4 border-l border-stone-200">
                    {p.isStartupActExclusive ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                        {isRtl ? 'إجباري (علامة Startup Act)' : 'Obligatoire (Label Startup Act)'}
                      </span>
                    ) : (
                      <span className="text-stone-600 font-medium">
                        {isRtl ? 'غير مشروط (متاح لكافة المؤسسات)' : 'Non requis (Ouvert à toutes entreprises)'}
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className={`p-4 font-semibold text-stone-700 bg-stone-50/50 sticky ${isRtl ? 'right-0' : 'left-0'}`}>
                  {isRtl ? 'امتيازات التنمية الجهوية (ZDR)' : 'Avantages Régions (ZDR)'}
                </td>
                {selectedPrograms.map((p) => (
                  <td key={p.id} className="p-4 border-l border-stone-200">
                    {p.isZdrAdvantaged ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                        {isRtl ? 'منحة إضافية + ضمان ميسر' : 'Bonus Prime + Garantie Bonifiée'}
                      </span>
                    ) : (
                      <span className="text-stone-500">
                        {isRtl ? 'شروط موحدة لكافة أنحاء الجمهورية' : 'Conditions uniformes sur tout le territoire'}
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className={`p-4 font-semibold text-stone-700 bg-stone-50/50 sticky ${isRtl ? 'right-0' : 'left-0'}`}>
                  {isRtl ? 'أبرز المزايا' : 'Atouts Majeurs'}
                </td>
                {selectedPrograms.map((p) => (
                  <td key={p.id} className="p-4 border-l border-stone-200">
                    <ul className="space-y-1">
                      {p.keyBenefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1 text-emerald-900 text-[11px]">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              <tr>
                <td className={`p-4 font-semibold text-stone-700 bg-stone-50/50 sticky ${isRtl ? 'right-0' : 'left-0'}`}>
                  {isRtl ? 'النقاط التي تستوجب الانتباه' : 'Contraintes & Vigilances'}
                </td>
                {selectedPrograms.map((p) => (
                  <td key={p.id} className="p-4 border-l border-stone-200">
                    <ul className="space-y-1">
                      {p.keyConditions.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1 text-stone-600 text-[11px]">
                          <span className="text-amber-500 font-bold">!</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* ACTION FOOTER */}
              <tr className="bg-stone-50/80">
                <td className={`p-4 font-bold text-stone-700 bg-stone-100/70 sticky ${isRtl ? 'right-0' : 'left-0'}`}>
                  {isRtl ? 'الإجراءات والتقديم' : 'Actions & Candidature'}
                </td>
                {selectedPrograms.map((p) => (
                  <td key={p.id} className="p-4 border-l border-stone-200">
                    <a
                      href={p.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-3 py-2 rounded-xl bg-[#15392B] hover:bg-[#0f2a20] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs mb-2 cursor-pointer"
                    >
                      <span>{isRtl ? 'البوابة الرسمية' : 'Portail Officiel'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => onOpenDetails(p)}
                      className="w-full text-center text-xs font-semibold text-[#15392B] hover:underline cursor-pointer"
                    >
                      {isRtl ? 'الاطلاع على كراس الشروط' : 'Consulter le cahier des charges'}
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

