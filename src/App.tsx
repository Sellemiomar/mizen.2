import React, { useState } from 'react';
import { Header, AppTab } from './components/Header';
import { HomeOverview } from './components/HomeOverview';
import { CatalogView } from './components/CatalogView';
import { EligibilityMatcher } from './components/EligibilityMatcher';
import { ComparisonView } from './components/ComparisonView';
import { FinancialSimulator } from './components/FinancialSimulator';
import { QuickDossierGenerator } from './components/QuickDossierGenerator';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { VERIFIED_PROGRAMS } from './data/programs';
import { FinancingProgram } from './types';
import { Language, translations } from './utils/i18n';
import { 
  Scale, 
  ShieldCheck, 
  ExternalLink, 
  Layers
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [lang, setLang] = useState<Language>('ar');
  const [catalogCategory, setCatalogCategory] = useState<string | undefined>(undefined);
  
  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Default with 2 programs selected for comparison so the user can test the comparison view right away
  const [selectedForCompare, setSelectedForCompare] = useState<FinancingProgram[]>([
    VERIFIED_PROGRAMS[0], // AIR (Smart Capital)
    VERIFIED_PROGRAMS[2], // BFPME Crédit PME
  ]);

  const [detailModalProgram, setDetailModalProgram] = useState<FinancingProgram | null>(null);
  const [simulatorProgram, setSimulatorProgram] = useState<FinancingProgram>(VERIFIED_PROGRAMS[2]);

  const handleToggleCompare = (program: FinancingProgram) => {
    if (selectedForCompare.some((p) => p.id === program.id)) {
      setSelectedForCompare(selectedForCompare.filter((p) => p.id !== program.id));
    } else {
      if (selectedForCompare.length >= 4) {
        alert(isRtl ? 'يمكن مقارنة 4 برامج كحد أقصى في نفس الوقت' : 'Vous pouvez comparer au maximum 4 programmes à la fois');
        return;
      }
      setSelectedForCompare([...selectedForCompare, program]);
    }
  };

  const handleRemoveFromCompare = (programId: string) => {
    setSelectedForCompare(selectedForCompare.filter((p) => p.id !== programId));
  };

  const handleAddToCompare = (program: FinancingProgram) => {
    if (!selectedForCompare.some((p) => p.id === program.id)) {
      if (selectedForCompare.length >= 4) return;
      setSelectedForCompare([...selectedForCompare, program]);
    }
  };

  const handleSelectForSimulator = (program: FinancingProgram) => {
    setSimulatorProgram(program);
    setActiveTab('simulator');
  };

  const handleOpenCatalogWithCategory = (category?: string) => {
    setCatalogCategory(category);
    setActiveTab('catalog');
  };

  return (
    <div 
      className={`min-h-screen bg-[#E7E3D9] text-[#16150F] flex flex-col ${isRtl ? 'font-arabic' : 'font-sans'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCompareCount={selectedForCompare.length}
        onOpenCompare={() => setActiveTab('compare')}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-14">
        {activeTab === 'home' && (
          <HomeOverview
            onStartMatching={() => setActiveTab('matcher')}
            onOpenCatalog={handleOpenCatalogWithCategory}
            onOpenCompare={() => setActiveTab('compare')}
            onOpenDossier={() => setActiveTab('dossier')}
            onOpenSimulator={() => setActiveTab('simulator')}
            programsCount={VERIFIED_PROGRAMS.length}
            lang={lang}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogView
            programs={VERIFIED_PROGRAMS}
            selectedForCompare={selectedForCompare}
            onToggleCompare={handleToggleCompare}
            onOpenDetails={(p) => setDetailModalProgram(p)}
            onOpenCompare={() => setActiveTab('compare')}
            onStartMatching={() => setActiveTab('matcher')}
            initialCategory={catalogCategory}
            lang={lang}
          />
        )}

        {activeTab === 'matcher' && (
          <EligibilityMatcher
            programs={VERIFIED_PROGRAMS}
            onOpenDetails={(p) => setDetailModalProgram(p)}
            onToggleCompare={handleToggleCompare}
            selectedForCompare={selectedForCompare}
            onOpenCompare={() => setActiveTab('compare')}
            lang={lang}
          />
        )}

        {activeTab === 'compare' && (
          <ComparisonView
            programs={VERIFIED_PROGRAMS}
            selectedPrograms={selectedForCompare}
            onRemoveProgram={handleRemoveFromCompare}
            onAddProgram={handleAddToCompare}
            onOpenDetails={(p) => setDetailModalProgram(p)}
            onSelectForSimulator={handleSelectForSimulator}
            onClearAll={() => setSelectedForCompare([])}
            lang={lang}
          />
        )}

        {activeTab === 'simulator' && (
          <FinancialSimulator
            initialProgram={simulatorProgram}
            programs={VERIFIED_PROGRAMS}
            onOpenDetails={(p) => setDetailModalProgram(p)}
            lang={lang}
          />
        )}

        {activeTab === 'dossier' && (
          <QuickDossierGenerator lang={lang} />
        )}
      </main>

      {/* Floating Compare Tray (in Catalog view when items selected) */}
      {activeTab === 'catalog' && selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4 animate-slideUp">
          <div className="bg-stone-900/95 backdrop-blur-md text-white rounded-2xl px-5 py-3 shadow-xl border border-stone-700/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-x-auto max-w-full">
              <span className="text-xs font-semibold text-stone-300 shrink-0">
                {isRtl ? `المقارنة (${selectedForCompare.length}/4) :` : `Comparateur (${selectedForCompare.length}/4) :`}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {selectedForCompare.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-800 text-stone-200 text-xs border border-stone-700 font-medium"
                  >
                    <span className="truncate max-w-[120px]">
                      {isRtl && p.nameAr ? p.nameAr : p.name}
                    </span>
                    <button
                      onClick={() => handleRemoveFromCompare(p.id)}
                      className="text-stone-400 hover:text-white cursor-pointer px-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedForCompare([])}
                className="px-2.5 py-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                {isRtl ? 'إفراغ' : 'Vider'}
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className="px-4 py-2 rounded-xl bg-[#15392B] hover:bg-[#0f2a20] text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isRtl ? `مقارنة (${selectedForCompare.length})` : `Comparer (${selectedForCompare.length})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Program Details */}
      <ProgramDetailModal
        program={detailModalProgram}
        onClose={() => setDetailModalProgram(null)}
        onToggleCompare={handleToggleCompare}
        isSelectedForCompare={
          detailModalProgram
            ? selectedForCompare.some((p) => p.id === detailModalProgram.id)
            : false
        }
        onSelectForSimulator={handleSelectForSimulator}
        lang={lang}
      />

      {/* Refined Soft Footer */}
      <footer className="bg-[#F7F4EE] text-stone-600 border-t border-stone-200/80 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            <div className="md:col-span-2 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#15392B] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  <Scale className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-lg font-bold text-stone-900 tracking-tight">
                  MIZEN · ميزان
                </span>
                <span className="text-xs text-stone-500 font-medium">Tunisie</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md">
                {t.footerDesc}
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.footerVerified}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3.5">
                {t.footerPortals}
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="https://startup.gov.tn" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 flex items-center gap-1.5 transition-colors">
                    <span>Startup Tunisia (Smart Capital)</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </li>
                <li>
                  <a href="http://www.bfpme.com.tn" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 flex items-center gap-1.5 transition-colors">
                    <span>BFPME (Financement PME)</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </li>
                <li>
                  <a href="https://www.bts.com.tn" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 flex items-center gap-1.5 transition-colors">
                    <span>Banque Tunisienne de Solidarité (BTS)</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </li>
                <li>
                  <a href="http://www.tunisieindustrie.nat.tn" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 flex items-center gap-1.5 transition-colors">
                    <span>APII & FOPRODI</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </li>
                <li>
                  <a href="http://www.sotugar.com.tn" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 flex items-center gap-1.5 transition-colors">
                    <span>SOTUGAR (Société de Garantie)</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3.5">
                {t.footerModules}
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button onClick={() => setActiveTab('catalog')} className="hover:text-stone-900 text-stone-600 transition-colors cursor-pointer">
                    {isRtl ? 'دليل التمويلات (18 آلية)' : 'Catalogue Vérifié (18 guichets)'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('matcher')} className="hover:text-stone-900 text-stone-600 transition-colors cursor-pointer">
                    {isRtl ? 'محرك فحص الأهلية' : 'Moteur de Matching d\'Éligibilité'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('compare')} className="hover:text-stone-900 text-stone-600 transition-colors cursor-pointer">
                    {isRtl ? 'مصفوفة المقارنة المباشرة' : 'Comparateur d\'Instruments (Matrice)'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('simulator')} className="hover:text-stone-900 text-stone-600 transition-colors cursor-pointer">
                    {isRtl ? 'محاكي TMM والتمويل البنكي' : 'Simulateur de Crédit TMM'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('dossier')} className="hover:text-stone-900 text-stone-600 transition-colors cursor-pointer">
                    {isRtl ? 'قائمة وثائق RNE والبنك' : 'Checklist Dossier RNE & Banques'}
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <div>
              {t.footerCopyright}
            </div>
            <div className="flex items-center gap-4 text-stone-600">
              <span>{t.footerCurrency}</span>
              <span>{t.footerTmm}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
