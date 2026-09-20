export type FundingType = 
  | 'grant' // Subvention non remboursable
  | 'concessionary_debt' // Crédit bonifié / public
  | 'commercial_debt' // Crédit bancaire classique
  | 'venture_capital' // Capital risque / Equity
  | 'microfinance' // Microcrédit
  | 'honor_loan' // Prêt d'honneur à 0%
  | 'guarantee'; // Fonds de garantie (SOTUGAR)

export type TargetStage = 
  | 'idea' // Idée / Anté-création
  | 'poc' // Prototype / R&D
  | 'seed' // Amorçage / Lancement
  | 'growth' // Croissance / Développement commercial
  | 'scale' // Expansion & Export
  | 'restructuring'; // Restructuration / Sauvegarde

export type LegalStructure = 
  | 'any'
  | 'startup_labeled' // Labellisée Startup Act
  | 'suarl' // SUARL
  | 'sarl' // SARL
  | 'sa' // SA
  | 'personne_physique' // Entreprise individuelle / Personne physique
  | 'artisan' // Carte d'artisan
  | 'in_creation'; // En cours de création

export type Sector = 
  | 'all'
  | 'tech_digital' // Numérique, SaaS, IA, DeepTech
  | 'industry' // Industrie mécanique, électrique, textile, etc.
  | 'agritech' // Agriculture & Agroalimentaire
  | 'green_cleantech' // Énergies renouvelables & Économie circulaire
  | 'services_commerce' // Services aux entreprises & Commerce
  | 'creative_handicraft' // Artisanat & Métiers d'art
  | 'health_pharma'; // Santé, dispositifs médicaux & pharma

export type CollateralLevel = 
  | 'none' // Aucune garantie personnelle requise
  | 'honor_pledge' // Engagement sur l'honneur / Cautions morales
  | 'sotugar_supported' // Couverture SOTUGAR (60% à 80%)
  | 'standard_hypothec'; // Garanties réelles / Hypothèque / Cautions personnelles

export interface FinancingProgram {
  id: string;
  name: string;
  nameAr?: string;
  institution: string;
  institutionType: 'public_agency' | 'development_bank' | 'vc_fund' | 'microfinance' | 'ngo_incubator' | 'commercial_bank';
  category: FundingType;
  tagline: string;
  description: string;
  minAmountTND: number;
  maxAmountTND: number;
  typicalTicketTND?: number;
  
  // Financial mechanics
  costTypeLabel: string; // e.g. "0% Non remboursable", "TMM + 2%", "Prise de participation 10-25%"
  interestRateNumeric: number; // for calculator: 0 for grants/honor, ~9.5 for BFPME, ~12.5 for commercial
  hasGracePeriod: boolean;
  gracePeriodMonths: number;
  repaymentDurationYears: number;
  equityDilutionRange?: string;
  
  // Guarantees & speed
  collateralLevel: CollateralLevel;
  collateralDetails: string;
  turnaroundTimeWeeks: number;
  disbursementSchedule: 'instant_lump_sum' | 'tranches_milestones' | 'reimbursement_post_expense';
  
  // Eligibility criteria
  stages: TargetStage[];
  legalForms: LegalStructure[];
  sectors: Sector[];
  isStartupActExclusive: boolean;
  isZdrAdvantaged: boolean; // Zone de Développement Régional bonus (e.g. FOPRODI 30% grant)
  isWomenOrYouthPriority: boolean;
  isDiasporaEligible: boolean;
  isIslamicCompliant?: boolean; // Zitouna Tamkeen, etc.
  minYearsInBusiness?: number;
  maxYearsInBusiness?: number;
  
  // Highlights
  keyBenefits: string[];
  keyConditions: string[];
  requiredDocs: string[];
  
  // Practical links & verification
  officialPortalUrl: string;
  applicationProcedure: string;
  contactEmail?: string;
  contactPhone?: string;
  verifiedYear: string;
  featured?: boolean;
}

export interface CompanyAssessmentProfile {
  legalForm: LegalStructure;
  stage: TargetStage;
  ageYears: number;
  amountNeededTND: number;
  fundingPurpose: 'rd_prototype' | 'working_capital' | 'machinery_equipment' | 'export_international' | 'hiring_expansion';
  sector: Sector;
  governorate: string;
  isZDR: boolean; // Governorats de l'intérieur (Kasserine, Gafsa, Siliana, Sidi Bouzid, etc.)
  hasStartupActLabel: boolean;
  isYouthLed: boolean; // < 35 ans
  isWomenLed: boolean;
  isGraduateLed: boolean; // Diplômé supérieur
  isDiasporaTRE: boolean; // Tunisien Résidant à l'Étranger
}

export interface EligibilityResult {
  programId: string;
  program: FinancingProgram;
  matchScore: number; // 0 - 100
  qualificationStatus: 'highly_eligible' | 'conditional_match' | 'ineligible';
  strengths: string[];
  blockers: string[];
  recommendations: string[];
  bonusFactors: string[];
}

export interface ComparisonMetric {
  key: string;
  label: string;
  category: 'overview' | 'financial' | 'requirements' | 'governance';
}
