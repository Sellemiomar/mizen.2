import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Percent, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  Info, 
  PieChart, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FinancingProgram } from '../types';
import { formatTND } from '../utils/formatters';

interface FinancialSimulatorProps {
  initialProgram?: FinancingProgram;
  programs: FinancingProgram[];
  onOpenDetails: (program: FinancingProgram) => void;
  lang?: 'ar' | 'fr';
}

export const FinancialSimulator: React.FC<FinancialSimulatorProps> = ({
  initialProgram,
  programs,
  onOpenDetails: _onOpenDetails,
  lang = 'fr',
}) => {
  const isRtl = lang === 'ar';

  // Preset selector
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    initialProgram ? initialProgram.id : 'bfpme-pme-credit'
  );

  // Loan parameters
  const [loanAmountTND, setLoanAmountTND] = useState<number>(200000);
  const [tmmRate, setTmmRate] = useState<number>(7.95); // Current BCT TMM
  const [bankMargin, setBankMargin] = useState<number>(1.5); // Spread over TMM
  const [useFixedRate, setUseFixedRate] = useState<boolean>(false);
  const [fixedAnnualRate, setFixedAnnualRate] = useState<number>(5.0);
  const [durationYears, setDurationYears] = useState<number>(7);
  const [gracePeriodMonths, setGracePeriodMonths] = useState<number>(24);
  const [sotugarFeeRate, setSotugarFeeRate] = useState<number>(0.75); // 0.75% SOTUGAR guarantee fee

  // Dilution comparator parameters
  const [projectedExitValuationMDT, setProjectedExitValuationMDT] = useState<number>(5); // 5 MDT
  const [equityDilutionPct, setEquityDilutionPct] = useState<number>(15); // 15%

  // Handle program preset selection
  const handleSelectProgram = (programId: string) => {
    setSelectedProgramId(programId);
    const p = programs.find(item => item.id === programId);
    if (!p) return;

    if (p.typicalTicketTND) {
      setLoanAmountTND(p.typicalTicketTND);
    } else {
      setLoanAmountTND(Math.round((p.minAmountTND + p.maxAmountTND) / 2));
    }

    if (p.category === 'grant' || p.category === 'honor_loan') {
      setUseFixedRate(true);
      setFixedAnnualRate(0);
      setGracePeriodMonths(p.gracePeriodMonths || 0);
      setDurationYears(p.repaymentDurationYears || 3);
    } else if (p.id === 'bts-solidarite-credit') {
      setUseFixedRate(true);
      setFixedAnnualRate(5.0);
      setGracePeriodMonths(12);
      setDurationYears(7);
    } else if (p.id === 'bfpme-pme-credit') {
      setUseFixedRate(false);
      setBankMargin(1.5);
      setGracePeriodMonths(24);
      setDurationYears(7);
    } else if (p.id === 'biat-ligne-sme-recovery') {
      setUseFixedRate(false);
      setBankMargin(3.0);
      setGracePeriodMonths(18);
      setDurationYears(7);
    } else if (p.category === 'microfinance') {
      setUseFixedRate(true);
      setFixedAnnualRate(p.interestRateNumeric || 17.5);
      setGracePeriodMonths(p.gracePeriodMonths || 0);
      setDurationYears(3);
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    const effectiveAnnualInterestRate = useFixedRate ? fixedAnnualRate : (tmmRate + bankMargin);
    const monthlyRate = (effectiveAnnualInterestRate / 100) / 12;
    const totalMonths = durationYears * 12;
    const amortizingMonths = Math.max(1, totalMonths - gracePeriodMonths);

    // Monthly interest during grace period
    const graceMonthlyInterest = loanAmountTND * monthlyRate;

    // Monthly payment after grace period
    let postGraceMonthlyPayment = 0;
    if (monthlyRate === 0) {
      postGraceMonthlyPayment = loanAmountTND / amortizingMonths;
    } else {
      postGraceMonthlyPayment = 
        (loanAmountTND * monthlyRate) / 
        (1 - Math.pow(1 + monthlyRate, -amortizingMonths));
    }

    // Total interest paid
    const totalInterestGrace = graceMonthlyInterest * gracePeriodMonths;
    const totalInterestPostGrace = (postGraceMonthlyPayment * amortizingMonths) - loanAmountTND;
    const totalInterest = totalInterestGrace + totalInterestPostGrace;

    // SOTUGAR Fee Total
    const totalSotugarFee = (loanAmountTND * (sotugarFeeRate / 100)) * (durationYears * 0.7);

    const totalCostOfDebt = totalInterest + totalSotugarFee;
    const totalCashOutflow = loanAmountTND + totalCostOfDebt;

    // Equity dilution equivalent cost
    const exitValuationTND = projectedExitValuationMDT * 1000000;
    const costOfEquityAtExit = (exitValuationTND * (equityDilutionPct / 100));

    // Simple Amortization schedule sample (yearly summary)
    const yearlySchedule: { year: number; principalPaid: number; interestPaid: number; remainingBalance: number }[] = [];
    let balance = loanAmountTND;

    for (let yr = 1; yr <= durationYears; yr++) {
      let yrPrincipal = 0;
      let yrInterest = 0;

      for (let m = 1; m <= 12; m++) {
        const currentMonthIndex = (yr - 1) * 12 + m;
        if (currentMonthIndex <= gracePeriodMonths) {
          // Grace period: interest only
          yrInterest += balance * monthlyRate;
        } else {
          // Amortization phase
          const interestPart = balance * monthlyRate;
          const principalPart = Math.min(balance, postGraceMonthlyPayment - interestPart);
          yrInterest += interestPart;
          yrPrincipal += principalPart;
          balance = Math.max(0, balance - principalPart);
        }
      }

      yearlySchedule.push({
        year: yr,
        principalPaid: Math.round(yrPrincipal),
        interestPaid: Math.round(yrInterest),
        remainingBalance: Math.round(balance),
      });
    }

    return {
      effectiveAnnualInterestRate,
      graceMonthlyInterest: Math.round(graceMonthlyInterest),
      postGraceMonthlyPayment: Math.round(postGraceMonthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalSotugarFee: Math.round(totalSotugarFee),
      totalCostOfDebt: Math.round(totalCostOfDebt),
      totalCashOutflow: Math.round(totalCashOutflow),
      costOfEquityAtExit: Math.round(costOfEquityAtExit),
      yearlySchedule,
    };
  }, [
    loanAmountTND,
    useFixedRate,
    fixedAnnualRate,
    tmmRate,
    bankMargin,
    durationYears,
    gracePeriodMonths,
    sotugarFeeRate,
    projectedExitValuationMDT,
    equityDilutionPct,
  ]);

  return (
    <div className="space-y-6 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Simulator Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#15392B] text-xs font-semibold mb-2">
            <Calculator className="w-3.5 h-3.5 text-[#15392B]" />
            {isRtl ? 'محاكي الفائدة TMM وجدول الإهلاك البنكي BCT' : 'Simulateur Financier TMM & Amortissement BCT'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-2">
            {isRtl 
              ? 'احسب أقساطك الشهرية وقارن بين الاقتراض والتفريط في رأس المال'
              : 'Calculez vos mensualités et comparez Dette vs Dilution de Capital'}
          </h1>
          <p className="text-stone-600 text-sm leading-relaxed">
            {isRtl
              ? 'في تونس، غالبية القروض المهنية مرتبطة بنسبة الفائدة في السوق النقدية (TMM = 7.95%) أو تتمتع بامتيازات تفاضلية مدعومة من الدولة (BTS بنسبة 5%، BFPME مع فترة إمهال). استخدم هذا المحاكي لتقدير تدفقاتك النقدية.'
              : 'En Tunisie, la majorité des crédits professionnels sont indexés sur le TMM (Taux Moyen Mensuel du Marché Monétaire : 7.95%) ou bénéficient de bonifications étatiques (BTS à 5%, BFPME avec franchise). Utilisez ce simulateur pour calibrer votre trésorerie prévisionnelle.'}
          </p>
        </div>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Controls */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              {isRtl ? 'بيانات التمويل' : 'Paramètres du Financement'}
            </h2>
            <span className="text-[11px] font-mono text-[#15392B] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200">
              {isRtl ? 'TMM البنك المركزي = 7.95%' : 'TMM BCT = 7.95%'}
            </span>
          </div>

          {/* Quick preset selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-600">
              {isRtl ? 'تحميل شروط برنامج معتمد :' : "Charger les conditions d'un programme vérifié :"}
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => handleSelectProgram(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200/80 text-xs font-semibold text-stone-800 bg-stone-50/60 focus:ring-2 focus:ring-[#15392B]/20 focus:border-[#15392B]"
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {isRtl && p.nameAr ? p.nameAr : p.name} ({p.institution}) - {p.costTypeLabel}
                </option>
              ))}
            </select>
          </div>

          {/* Loan Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-bold text-stone-700 uppercase tracking-wider">
                {isRtl ? 'مبلغ التمويل (د.ت)' : 'Montant du Crédit (TND)'}
              </label>
              <span className="text-sm font-black text-[#15392B]">
                {formatTND(loanAmountTND, lang)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="2000000"
              step="10000"
              value={loanAmountTND}
              onChange={(e) => setLoanAmountTND(Number(e.target.value))}
              className="w-full accent-[#15392B] cursor-pointer"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[30000, 70000, 150000, 300000, 600000, 1200000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmountTND(amt)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all cursor-pointer ${
                    loanAmountTND === amt 
                      ? 'bg-[#15392B] text-white border-[#15392B]' 
                      : 'bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100'
                  }`}
                >
                  {formatTND(amt, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate Configuration */}
          <div className="space-y-3 p-3.5 bg-stone-50/60 rounded-xl border border-stone-200/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-800">
                {isRtl ? 'نوع نسبة الفائدة' : 'Indexation du Taux'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setUseFixedRate(false)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-colors ${
                    !useFixedRate ? 'bg-[#15392B] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-200/60'
                  }`}
                >
                  {isRtl ? 'TMM + هامش' : 'TMM + Marge'}
                </button>
                <button
                  type="button"
                  onClick={() => setUseFixedRate(true)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-colors ${
                    useFixedRate ? 'bg-[#15392B] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-200/60'
                  }`}
                >
                  {isRtl ? 'نسبة قارة' : 'Taux Fixe'}
                </button>
              </div>
            </div>

            {!useFixedRate ? (
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <label className="text-stone-500 block mb-1">
                    {isRtl ? 'نسبة TMM المرجعية (%)' : 'TMM Référence (%)'}
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={tmmRate}
                    onChange={(e) => setTmmRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="text-stone-500 block mb-1">
                    {isRtl ? 'هامش البنك (%)' : 'Marge Banque (%)'}
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={bankMargin}
                    onChange={(e) => setBankMargin(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white font-bold text-stone-900"
                  />
                </div>
              </div>
            ) : (
              <div className="pt-1 text-xs">
                <label className="text-stone-500 block mb-1">
                  {isRtl ? 'النسبة السنوية القارة (%)' : 'Taux Annuel Fixe (%)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={fixedAnnualRate}
                  onChange={(e) => setFixedAnnualRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white font-bold text-stone-900"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  {isRtl ? '(0% للمنح وقروض الشرف، 5% لبنك التضامن BTS)' : "(0% pour Subventions & Prêt d'Honneur, 5% pour BTS diplômés)"}
                </span>
              </div>
            )}

            <div className="pt-1 border-t border-stone-200 flex justify-between text-xs font-bold text-stone-900">
              <span>{isRtl ? 'النسبة السنوية الفعلية :' : 'Taux annuel appliqué :'}</span>
              <span className="text-[#15392B] font-extrabold">
                {calculations.effectiveAnnualInterestRate.toFixed(2)}% {isRtl ? '/ سنوياً' : '/ an'}
              </span>
            </div>
          </div>

          {/* Duration & Grace Period */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 text-xs">
              <label className="font-bold text-stone-700">
                {isRtl ? 'المدة الإجمالية (سنوات)' : 'Durée Totale (ans)'}
              </label>
              <select
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200/80 font-semibold text-stone-800 bg-stone-50/60 focus:ring-2 focus:ring-[#15392B]/20 focus:border-[#15392B]"
              >
                <option value={1}>{isRtl ? 'سنة واحدة (قصير المدى)' : '1 an (Court terme)'}</option>
                <option value={2}>{isRtl ? 'سنتان' : '2 ans'}</option>
                <option value={3}>{isRtl ? '3 سنوات (تمويل أصغر)' : '3 ans (Microfinance)'}</option>
                <option value={5}>{isRtl ? '5 سنوات' : '5 ans'}</option>
                <option value={7}>{isRtl ? '7 سنوات (BFPME / بنوك)' : '7 ans (BFPME / Banques)'}</option>
                <option value={10}>{isRtl ? '10 سنوات (صناعي / FOPRODI)' : '10 ans (Industrie / FOPRODI)'}</option>
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-stone-700">
                {isRtl ? 'فترة الإمهال (أشهر)' : 'Franchise (mois)'}
              </label>
              <select
                value={gracePeriodMonths}
                onChange={(e) => setGracePeriodMonths(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200/80 font-semibold text-stone-800 bg-stone-50/60 focus:ring-2 focus:ring-[#15392B]/20 focus:border-[#15392B]"
              >
                <option value={0}>{isRtl ? '0 شهر (بدون تأجيل)' : '0 mois (Sans différé)'}</option>
                <option value={6}>{isRtl ? '6 أشهر' : '6 mois'}</option>
                <option value={12}>{isRtl ? '12 شهراً (سنة)' : '12 mois (1 an)'}</option>
                <option value={18}>{isRtl ? '18 شهراً' : '18 mois'}</option>
                <option value={24}>{isRtl ? '24 شهراً (سنتان - BFPME)' : '24 mois (2 ans - BFPME)'}</option>
                <option value={36}>{isRtl ? '36 شهراً (3 سنوات - FOPRODI)' : '36 mois (3 ans - FOPRODI)'}</option>
              </select>
            </div>
          </div>

          {/* SOTUGAR Fee */}
          <div className="space-y-1 text-xs">
            <label className="font-bold text-stone-700 flex justify-between">
              <span>{isRtl ? 'عمولة ضمان SOTUGAR' : 'Commission Garantie SOTUGAR'}</span>
              <span className="text-stone-500">{sotugarFeeRate}% {isRtl ? 'سنوياً' : 'annuel'}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.25"
              value={sotugarFeeRate}
              onChange={(e) => setSotugarFeeRate(Number(e.target.value))}
              className="w-full accent-[#15392B] cursor-pointer"
            />
          </div>

        </div>

        {/* Right Output: Monthly Breakdown & Trade-Off Analysis */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Key Output Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Grace period payment */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
              <span className="text-[11px] text-stone-500 font-semibold block mb-1">
                {isRtl ? `خلال فترة الإمهال (${gracePeriodMonths} شهر)` : `Pendant la Franchise (${gracePeriodMonths} mois)`}
              </span>
              <div className="text-xl font-black text-amber-800">
                {formatTND(calculations.graceMonthlyInterest, lang)}
              </div>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                {calculations.effectiveAnnualInterestRate === 0 
                  ? (isRtl ? 'بدون أي دفع (0 د.ت)' : 'Aucun paiement (0 DT)')
                  : (isRtl ? 'فوائد فقط / شهرياً' : 'Intérêts seuls / mois')}
              </span>
            </div>

            {/* Post-grace monthly payment */}
            <div className="bg-emerald-50/40 rounded-2xl p-4 border border-emerald-200 ring-1 ring-[#15392B]/10 shadow-xs">
              <span className="text-[11px] text-[#15392B] font-bold block mb-1">
                {isRtl ? 'القسط الشهري بعد الإمهال' : 'Mensualité Post-Franchise'}
              </span>
              <div className="text-xl font-black text-[#15392B]">
                {formatTND(calculations.postGraceMonthlyPayment, lang)}
              </div>
              <span className="text-[11px] text-stone-600 font-medium block mt-0.5">
                {isRtl ? 'الأصل + الفوائد / شهرياً' : 'Principal + Intérêts / mois'}
              </span>
            </div>

            {/* Total Interest & Cost */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
              <span className="text-[11px] text-stone-500 font-semibold block mb-1">
                {isRtl ? 'التكلفة الإجمالية للقرض' : 'Coût Total du Crédit'}
              </span>
              <div className="text-xl font-black text-rose-700">
                {formatTND(calculations.totalCostOfDebt, lang)}
              </div>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                {isRtl ? 'الفوائد فقط :' : 'Intérêts :'} {formatTND(calculations.totalInterest, lang)}
              </span>
            </div>

          </div>

          {/* Yearly Amortization Breakdown Table */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center justify-between">
              <span>{isRtl ? 'جدول الإهلاك السنوي التقديري' : "Tableau d'Amortissement Prévisionnel Annuel"}</span>
              <span className="text-[11px] font-normal text-stone-500">
                {isRtl ? 'المبالغ بالدينار التونسي (TND)' : 'Montants en Dinars Tunisiens (TND)'}
              </span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" dir={isRtl ? 'rtl' : 'ltr'}>
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500">
                    <th className="pb-2 font-semibold">{isRtl ? 'السنة' : 'Année'}</th>
                    <th className="pb-2 font-semibold">{isRtl ? 'أصل القرض المسدد' : 'Principal Remboursé'}</th>
                    <th className="pb-2 font-semibold">{isRtl ? 'الفوائد المسددة' : 'Intérêts Payés'}</th>
                    <th className={`pb-2 font-semibold ${isRtl ? 'text-left' : 'text-right'}`}>
                      {isRtl ? 'المتبقي المستحق' : 'Capital Restant Dû'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {calculations.yearlySchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-stone-50">
                      <td className="py-2 font-bold text-stone-900">
                        {isRtl ? `السنة ${row.year}` : `Année ${row.year}`}
                      </td>
                      <td className="py-2 text-stone-700">{formatTND(row.principalPaid, lang)}</td>
                      <td className="py-2 text-amber-700 font-medium">{formatTND(row.interestPaid, lang)}</td>
                      <td className={`py-2 font-mono ${isRtl ? 'text-left' : 'text-right'} text-stone-900 font-bold`}>
                        {formatTND(row.remainingBalance, lang)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trade-off: Dette vs Cession de Capital (Dilution Equity) */}
          <div className="bg-[#15392B] text-white rounded-2xl p-5 sm:p-6 shadow-xs border border-emerald-950">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {isRtl ? 'المفاضلة : الاقتراض المدعوم مقابل التفريط في رأس المال' : 'Arbitrage : Dette Concessionnaire vs Dilution de Capital'}
              </h3>
            </div>

            <p className="text-xs text-emerald-100/90 mb-4 leading-relaxed">
              {isRtl
                ? `هل الأفضل الحصول على تمويل تفاضلي (مثل BFPME بنسبة ${calculations.effectiveAnnualInterestRate.toFixed(1)}%) أو التنازل عن ${equityDilutionPct}% من أسهم شركتك لصندوق استثماري؟`
                : `Vaut-il mieux contracter une dette bonifiée (ex: BFPME à ${calculations.effectiveAnnualInterestRate.toFixed(1)}%) ou céder ${equityDilutionPct}% de son capital à un fonds d'amorçage ?`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-[11px] text-emerald-200 font-medium flex justify-between">
                  <span>{isRtl ? 'نسبة المساهمة المطلوبة من الصندوق' : 'Dilution demandée par le VC'}</span>
                  <span className="text-amber-300 font-bold">{equityDilutionPct}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={equityDilutionPct}
                  onChange={(e) => setEquityDilutionPct(Number(e.target.value))}
                  className="w-full accent-amber-300 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-emerald-200 font-medium flex justify-between">
                  <span>{isRtl ? 'التقييم المستقبلي المتوقع عند التخارج' : 'Valorisation future estimée (Exit)'}</span>
                  <span className="text-emerald-300 font-bold">
                    {projectedExitValuationMDT} {isRtl ? 'مليون د.ت' : 'MDT'}
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={projectedExitValuationMDT}
                  onChange={(e) => setProjectedExitValuationMDT(Number(e.target.value))}
                  className="w-full accent-emerald-300 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-black/25 rounded-xl border border-emerald-900/50 text-xs">
              <div>
                <span className="text-[11px] text-emerald-200/80 block">
                  {isRtl ? 'التكلفة الإجمالية الفعلية للقرض' : 'Coût total réel de la Dette'}
                </span>
                <span className="text-base font-black text-emerald-300">
                  {formatTND(calculations.totalCostOfDebt, lang)}
                </span>
                <span className="text-[10px] text-emerald-200/60 block">
                  {isRtl ? 'فوائد محددة ومنتهية' : 'Intérêts finis et fixes'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-emerald-200/80 block">
                  {isRtl ? `قيمة الـ ${equityDilutionPct}% عند التخارج` : `Valeur des ${equityDilutionPct}% cédés à l'Exit`}
                </span>
                <span className="text-base font-black text-amber-300">
                  {formatTND(calculations.costOfEquityAtExit, lang)}
                </span>
                <span className="text-[10px] text-emerald-200/60 block">
                  {isRtl ? 'تكلفة فرصة رأس المال' : "Coût d'opportunité actionnarial"}
                </span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-emerald-200/80 italic">
              {isRtl
                ? '💡 توصية ميزان: بالنسبة للشركات الناشئة سريعة النمو، فإن دمج شريحة أولى غير مسببة للتخفيف (منح AIR / قروض شرف) قبل فتح رأس المال يوفر للمؤسسين ما يصل إلى 15% من أسهمهم.'
                : "💡 Recommandation Mizen : Pour les startups technologiques à forte croissance, combiner une première tranche non-dilutive (AIR / Flywheel / Réseau Entreprendre) avant de céder des parts permet de préserver jusqu'à 15% de capital fondateur."}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
