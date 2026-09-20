import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Download, 
  Printer, 
  ShieldCheck, 
  Building2, 
  HelpCircle, 
  ExternalLink,
  Share2,
  Check
} from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  titleAr?: string;
  institution: string;
  institutionAr?: string;
  authorityUrl?: string;
  description: string;
  descriptionAr?: string;
  importance: 'mandatory' | 'highly_recommended' | 'situational';
  category: 'legal' | 'financial' | 'operational';
}

const TUNISIAN_DOSSIER_ITEMS: DocumentItem[] = [
  {
    id: 'rne',
    title: 'Extrait du Registre National des Entreprises (RNE)',
    titleAr: 'مضمون من السجل الوطني للمؤسسات (RNE)',
    institution: 'Centre National du Registre des Entreprises (RNE)',
    institutionAr: 'المركز الوطني لسجل المؤسسات (RNE)',
    authorityUrl: 'https://www.rne.tn',
    description: 'Document officiel prouvant l\'immatriculation légale. Doit dater de moins de 3 mois lors de la soumission.',
    descriptionAr: 'وثيقة رسمية تثبت التسجيل القانوني للمؤسسة. يجب ألا يتجاوز تاريخ إصدارها 3 أشهر عند تقديم الملف.',
    importance: 'mandatory',
    category: 'legal',
  },
  {
    id: 'statuts',
    title: 'Statuts enregistrés & PV de nomination de la gérance',
    titleAr: 'القانون الأساسي المسجل ومحضر جلسة تعيين الوكيل',
    institution: 'Recette des Finances & RNE',
    institutionAr: 'قباضة المالية والسجل الوطني للمؤسسات',
    description: 'Statuts signés et enregistrés auprès de la recette des finances avec répartition du capital social.',
    descriptionAr: 'القانون الأساسي ممضى ومسجل بالقباضة المالية مع جدول توزيع رأس المال الاجتماعي.',
    importance: 'mandatory',
    category: 'legal',
  },
  {
    id: 'cin',
    title: 'Copies conformes des CIN des fondateurs et dirigeants',
    titleAr: 'نسخ مطابقة للأصل من بطاقات التعريف الوطنية للمؤسسين والمسيرين',
    institution: 'Municipalité / Poste de police',
    institutionAr: 'البلدية أو مركز الأمن',
    description: 'Carte d\'Identité Nationale tunisienne ou passeport en cours de validité des associés majoritaires.',
    descriptionAr: 'بطاقة التعريف الوطنية التونسية أو جواز سفر ساري المفعول للشركاء أصحاب الأغلبية.',
    importance: 'mandatory',
    category: 'legal',
  },
  {
    id: 'startup_label',
    title: 'Attestation de Label Startup Act',
    titleAr: 'شهادة علامة المؤسسة الناشئة (Startup Act)',
    institution: 'Smart Capital / Collège des Startups',
    institutionAr: 'سمارت كابيتال / لجنة المؤسسات الناشئة',
    authorityUrl: 'https://startup.gov.tn',
    description: 'Requis pour tous les guichets Smart Capital (AIR, AIR², Flywheel, bourses). Valable 8 ans.',
    descriptionAr: 'مطلوبة لكافة برامج سمارت كابيتال (AIR، AIR²، Flywheel، المنح). صالحة لمدة 8 سنوات.',
    importance: 'situational',
    category: 'legal',
  },
  {
    id: 'apii_declaration',
    title: 'Déclaration d\'investissement APII',
    titleAr: 'شهادة إيداع تصريح بالاستثمار من وكالة النهوض بالصناعة والتجديد',
    institution: 'APII (Agence de Promotion de l\'Industrie)',
    institutionAr: 'وكالة النهوض بالصناعة والتجديد (APII)',
    authorityUrl: 'http://www.tunisieindustrie.nat.tn',
    description: 'Attestation de dépôt de projet d\'investissement ouvrant droit aux avantages fiscaux et financiers FOPRODI.',
    descriptionAr: 'شهادة إيداع مشروع استثماري تفتح الحق في الامتيازات الجبائية والمالية لصندوق FOPRODI.',
    importance: 'mandatory',
    category: 'operational',
  },
  {
    id: 'bilans',
    title: 'États financiers certifiés des 2 à 3 derniers exercices',
    titleAr: 'القوائم المالية المدققة للسنوات المحاسبية الأخيرة (2 إلى 3 سنوات)',
    institution: 'Expert-comptable / Commissaire aux comptes',
    institutionAr: 'خبير محاسب / مراقب حسابات معتمد',
    description: 'Bilans, état de résultat et balance générale audités. Non requis pour les entreprises en création.',
    descriptionAr: 'الموازنات المالية، جدول النتائج وميزان المراجعة المعتمد. غير مطلوبة للشركات حديثة التأسيس.',
    importance: 'mandatory',
    category: 'financial',
  },
  {
    id: 'bct_risks',
    title: 'État Centrale des Risques BCT',
    titleAr: 'كشف مجمع المخاطر البنكية من البنك المركزي التونسي (BCT)',
    institution: 'Banque Centrale de Tunisie (BCT)',
    institutionAr: 'البنك المركزي التونسي (BCT)',
    authorityUrl: 'https://www.bct.gov.tn',
    description: 'Relevé consolidé des engagements bancaires de l\'entreprise et de ses dirigeants. Doit être sain.',
    descriptionAr: 'كشف موحد للالتزامات والتسهيلات البنكية للمؤسسة ومسيريها. يجب أن يكون سليماً من الديون المصنفة.',
    importance: 'highly_recommended',
    category: 'financial',
  },
  {
    id: 'fiscal_cnss',
    title: 'Attestations de régularité fiscale & quitus CNSS',
    titleAr: 'شهادة إبراء ذمة جبائية وشهادة خلاص من الصندوق الوطني للضمان الاجتماعي (CNSS)',
    institution: 'Recette des Finances & CNSS',
    institutionAr: 'قباضة المالية والصندوق الوطني للضمان الاجتماعي (CNSS)',
    description: 'Preuve du paiement des impôts (déclarations mensuelles) et des cotisations sociales patronales.',
    descriptionAr: 'إثبات خلاص الضرائب الشهرية والمساهمات في الضمان الاجتماعي للمؤجر والأجراء.',
    importance: 'mandatory',
    category: 'financial',
  },
  {
    id: 'business_plan',
    title: 'Business Plan & Plan de Trésorerie prévisionnel sur 3 ans',
    titleAr: 'مخطط الأعمال وجدول السيولة التقديري على 3 سنوات',
    institution: 'Cabinet de conseil ou équipe interne',
    institutionAr: 'مكتب استشارات أو الفريق الداخلي',
    description: 'Étude de marché, compte de résultat prévisionnel, plan de financement équilibré et seuil de rentabilité.',
    descriptionAr: 'دراسة السوق، جدول النتائج التقديري، مخطط تمويل متوازن وحساب نقطة التعادل.',
    importance: 'mandatory',
    category: 'operational',
  },
  {
    id: 'proforma',
    title: 'Devis & Factures Proforma des investissements',
    titleAr: 'فواتير تقديرية وتأشيرات أسعار للتجهيزات والاستثمارات (Factures Proforma)',
    institution: 'Fournisseurs d\'équipements agréés',
    institutionAr: 'مزودو التجهيزات والآلات المعتمدون',
    description: 'Devis récents détaillant les spécifications techniques du matériel, machines ou prestations à financer.',
    descriptionAr: 'عروض أسعار حديثة تفصل المواصفات الفنية للآلات، المعدات أو الخدمات المزمع تمويلها.',
    importance: 'mandatory',
    category: 'operational',
  },
  {
    id: 'local_contract',
    title: 'Contrat de bail ou titre de propriété du local',
    titleAr: 'عقد كراء مسجل أو شهادة ملكية للمقر وموقع النشاط',
    institution: 'Recette des finances',
    institutionAr: 'القباضة المالية',
    description: 'Justificatif du siège social et des ateliers d\'exploitation enregistré auprès de la recette fiscale.',
    descriptionAr: 'إثبات المقر الاجتماعي ومحلات النشاط مسجل قانونياً لدى القباضة المالية.',
    importance: 'mandatory',
    category: 'legal',
  },
];

interface QuickDossierGeneratorProps {
  lang?: 'ar' | 'fr';
}

export const QuickDossierGenerator: React.FC<QuickDossierGeneratorProps> = ({
  lang = 'fr',
}) => {
  const isRtl = lang === 'ar';
  const [checkedItems, setCheckedItems] = useState<string[]>([
    'rne',
    'statuts',
    'cin',
    'business_plan'
  ]);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const progressPct = Math.round(
    (checkedItems.length / TUNISIAN_DOSSIER_ITEMS.length) * 100
  );

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const list = TUNISIAN_DOSSIER_ITEMS.map((item) => {
      const isChecked = checkedItems.includes(item.id);
      const title = isRtl && item.titleAr ? item.titleAr : item.title;
      const inst = isRtl && item.institutionAr ? item.institutionAr : item.institution;
      return `[${isChecked ? 'X' : ' '}] ${title} (${inst})`;
    }).join('\n');

    navigator.clipboard.writeText(`Mizen - ${isRtl ? 'ملف التمويل المعتمد في تونس' : 'Dossier de Financement Tunisie'} :\n\n${list}`);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#15392B] text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-[#15392B]" />
            {isRtl ? 'قائمة الوثائق الإدارية في تونس (سجل المؤسسات، البنك المركزي، SOTUGAR)' : 'Checklist Administrative Tunisie (RNE, BCT, SOTUGAR)'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-2">
            {isRtl ? 'جهّز ملف التمويل المكتمل والمعتمد' : 'Constituez votre Dossier de Financement Homologué'}
          </h1>
          <p className="text-stone-600 text-sm max-w-2xl leading-relaxed">
            {isRtl
              ? '90% من حالات رفض أو تأخر ملفات التمويل في تونس تعود إلى نقص الوثائق (انتهاء صلوحية السجل الوطني RNE، غياب شهادة إبراء ذمة CNSS، أو عدم فحص مجمع المخاطر بالبنك المركزي). حدد الوثائق الجاهزة لديك لتقييم جاهزية ملفك.'
              : '90% des refus ou retards de financement en Tunisie sont causés par des dossiers incomplets (extrait RNE expiré, absence de quitus CNSS, centrale des risques non vérifiée). Cochez vos pièces prêtes pour évaluer la complétude de votre candidature.'}
          </p>
        </div>

        {/* Progress gauge card */}
        <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 shrink-0 w-full sm:w-64 text-center">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
            {isRtl ? 'نسبة اكتمال الملف' : 'Complétude du Dossier'}
          </span>
          <div className="text-3xl font-black text-stone-900 mb-1">
            {progressPct}%
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden mb-2">
            <div 
              className="bg-[#15392B] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-stone-600 font-medium">
            {isRtl
              ? `${checkedItems.length} من أصل ${TUNISIAN_DOSSIER_ITEMS.length} وثائق جاهزة`
              : `${checkedItems.length} / ${TUNISIAN_DOSSIER_ITEMS.length} pièces prêtes`}
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="text-xs text-stone-600">
          {isRtl ? 'الوضعية : ' : 'Statut : '}
          {progressPct >= 80 ? (
            <strong className="text-[#15392B]">
              {isRtl ? 'ملف قوي وجاهز للإيداع لدى المؤسسات المالية' : 'Dossier solide prêt pour soumission institutionnelle'}
            </strong>
          ) : (
            <span className="text-amber-800 font-medium">
              {isRtl ? 'توجد وثائق رئيسية ناقصة يتعين استكمالها' : 'Pièces clés manquantes à finaliser'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl border border-stone-200/80 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedNotification ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#15392B]" />
                <span className="text-[#15392B]">{isRtl ? 'تم النسخ' : 'Copié'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-stone-500" />
                <span>{isRtl ? 'نسخ القائمة' : 'Copier la liste'}</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#15392B] hover:bg-[#0f2a20] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isRtl ? 'طباعة القائمة' : 'Imprimer la checklist'}</span>
          </button>
        </div>
      </div>

      {/* Checklist items list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TUNISIAN_DOSSIER_ITEMS.map((item) => {
          const isChecked = checkedItems.includes(item.id);
          const title = isRtl && item.titleAr ? item.titleAr : item.title;
          const inst = isRtl && item.institutionAr ? item.institutionAr : item.institution;
          const desc = isRtl && item.descriptionAr ? item.descriptionAr : item.description;

          return (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                isChecked
                  ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-[#15392B]/10'
                  : 'bg-white border-stone-200/80 hover:border-stone-300 hover:bg-stone-50/50'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                isChecked 
                  ? 'bg-[#15392B] border-[#15392B] text-white' 
                  : 'border-stone-300 bg-white text-transparent'
              }`}>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`text-sm font-bold ${isChecked ? 'text-[#15392B]' : 'text-stone-900'}`}>
                    {title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    item.importance === 'mandatory' ? 'bg-rose-100 text-rose-800' :
                    item.importance === 'highly_recommended' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {item.importance === 'mandatory' 
                      ? (isRtl ? 'إجباري' : 'Obligatoire') 
                      : item.importance === 'highly_recommended' 
                      ? (isRtl ? 'موصى به بشدة' : 'Fortement Recommandé') 
                      : (isRtl ? 'حسب الشباك' : 'Selon Guichet')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                  <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="truncate">{inst}</span>
                  {item.authorityUrl && (
                    <a
                      href={item.authorityUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#15392B] hover:underline inline-flex items-center gap-0.5 shrink-0 font-medium"
                    >
                      {isRtl ? 'الموقع الرسمي' : 'Portail officiel'} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
