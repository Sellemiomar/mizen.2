import { CompanyAssessmentProfile, EligibilityResult, FinancingProgram } from '../types';
import { TUNISIAN_GOVERNORATES } from '../data/regions';

export function evaluateEligibility(
  program: FinancingProgram,
  profile: CompanyAssessmentProfile
): EligibilityResult {
  let score = 100;
  const strengths: string[] = [];
  const blockers: string[] = [];
  const recommendations: string[] = [];
  const bonusFactors: string[] = [];

  // 1. Amount compatibility
  if (profile.amountNeededTND < program.minAmountTND) {
    const penalty = Math.min(30, Math.round(((program.minAmountTND - profile.amountNeededTND) / program.minAmountTND) * 40));
    score -= penalty;
    blockers.push(`Montant demandé (${profile.amountNeededTND.toLocaleString()} TND) inférieur au seuil minimal (${program.minAmountTND.toLocaleString()} TND).`);
    recommendations.push(`Considérez regrouper vos investissements ou solliciter un ticket d\'amorçage adapté.`);
  } else if (profile.amountNeededTND > program.maxAmountTND) {
    const penalty = Math.min(45, Math.round(((profile.amountNeededTND - program.maxAmountTND) / program.maxAmountTND) * 50));
    score -= penalty;
    blockers.push(`Montant demandé (${profile.amountNeededTND.toLocaleString()} TND) dépasse le plafond de ce guichet (${program.maxAmountTND.toLocaleString()} TND).`);
    recommendations.push(`Combinez ce guichet avec un co-financement bancaire ou une ligne BFPME / SOTUGAR.`);
  } else {
    strengths.push(`Montant sollicité (${profile.amountNeededTND.toLocaleString()} TND) parfaitement dans la fourchette du programme (${program.minAmountTND.toLocaleString()} - ${program.maxAmountTND.toLocaleString()} TND).`);
  }

  // 2. Startup Act label requirement
  if (program.isStartupActExclusive) {
    if (!profile.hasStartupActLabel) {
      score -= 40;
      blockers.push(`Dispositif réservé exclusivement aux sociétés ayant obtenu le Label Startup Act.`);
      recommendations.push(`Déposez une demande de labellisation sur le portail national Startup Tunisia (startup.gov.tn) avant de postuler.`);
    } else {
      score += 5;
      strengths.push(`Label Startup Act actif : accès immédiat garanti aux guichets Smart Capital.`);
    }
  }

  // 3. Stage compatibility
  if (program.stages.includes(profile.stage)) {
    strengths.push(`Votre stade de développement actuel (${translateStage(profile.stage)}) correspond aux cibles prioritaires.`);
  } else {
    score -= 25;
    blockers.push(`Ce programme cible principalement les phases : ${program.stages.map(translateStage).join(', ')}.`);
  }

  // 4. Legal Structure compatibility
  const legalCompatible = 
    program.legalForms.includes('any') ||
    program.legalForms.includes(profile.legalForm) ||
    (profile.hasStartupActLabel && program.legalForms.includes('startup_labeled'));

  if (legalCompatible) {
    strengths.push(`Forme juridique (${translateLegal(profile.legalForm)}) acceptée.`);
  } else {
    score -= 20;
    blockers.push(`Structure juridique (${translateLegal(profile.legalForm)}) non prioritaire. Formes recommandées : ${program.legalForms.map(translateLegal).join(', ')}.`);
    if (profile.legalForm === 'in_creation') {
      recommendations.push(`Immatriculez votre société au RNE (SUARL ou SARL recommandée pour ce guichet).`);
    }
  }

  // 5. Sector alignment
  if (program.sectors.includes('all') || program.sectors.includes(profile.sector)) {
    strengths.push(`Secteur d\'activité (${translateSector(profile.sector)}) éligible.`);
  } else {
    score -= 20;
    blockers.push(`Secteur (${translateSector(profile.sector)}) en dehors des priorités d\'intervention.`);
  }

  // 6. Business seniority / years in business
  if (program.minYearsInBusiness && profile.ageYears < program.minYearsInBusiness) {
    score -= 20;
    blockers.push(`Exige au moins ${program.minYearsInBusiness} an(s) d\'existence légale et bilans clôturés (vous avez ${profile.ageYears} an(s)).`);
  }
  if (program.maxYearsInBusiness && profile.ageYears > program.maxYearsInBusiness) {
    score -= 15;
    blockers.push(`Programme d\'amorçage limité aux entreprises de moins de ${program.maxYearsInBusiness} ans.`);
  }

  // 7. ZDR (Zone de Développement Régional) Bonus
  const govInfo = TUNISIAN_GOVERNORATES.find(g => g.nameFr.toLowerCase() === profile.governorate.toLowerCase() || g.id === profile.governorate.toLowerCase());
  const isZdrArea = profile.isZDR || (govInfo && govInfo.isZDR);

  if (program.isZdrAdvantaged) {
    if (isZdrArea) {
      score += 10;
      bonusFactors.push(`Bonus Région Intérieure (ZDR) : Prime majorée et garantie bonifiée pour implantation à ${profile.governorate}.`);
    } else {
      recommendations.push(`Les projets implantés en zone ZDR bénéficient de primes majorées jusqu\'à +15% sur ce programme.`);
    }
  }

  // 8. Founder Profiles Bonuses (Youth, Women, Diaspora, Graduate)
  if (program.isWomenOrYouthPriority && (profile.isYouthLed || profile.isWomenLed)) {
    score += 8;
    bonusFactors.push(`Critère prioritaire satisfait : Entrepreneuriat ${profile.isWomenLed ? 'féminin' : ''} ${profile.isYouthLed ? 'jeunes (<35 ans)' : ''}.`);
  }

  if (program.isDiasporaEligible && profile.isDiasporaTRE) {
    score += 5;
    bonusFactors.push(`Ligne spécifique Diaspora / Tunisiens Résidant à l\'Étranger (TRE) mobilisable.`);
  }

  if (profile.isGraduateLed && (program.id === 'bts-solidarite-credit' || program.id === 'foprodi-apii')) {
    score += 10;
    bonusFactors.push(`Diplômé de l\'enseignement supérieur : exonération de garanties lourdes et primes d\'installation.`);
  }

  // Clamp score
  const finalScore = Math.max(5, Math.min(99, score));

  let status: 'highly_eligible' | 'conditional_match' | 'ineligible' = 'conditional_match';
  if (finalScore >= 75) {
    status = 'highly_eligible';
  } else if (finalScore < 45) {
    status = 'ineligible';
  }

  return {
    programId: program.id,
    program,
    matchScore: finalScore,
    qualificationStatus: status,
    strengths,
    blockers,
    recommendations,
    bonusFactors,
  };
}

export function rankProgramsForProfile(
  programs: FinancingProgram[],
  profile: CompanyAssessmentProfile
): EligibilityResult[] {
  return programs
    .map(p => evaluateEligibility(p, profile))
    .sort((a, b) => b.matchScore - a.matchScore);
}

function translateStage(stage: string): string {
  switch (stage) {
    case 'idea': return 'Idée / Anté-création';
    case 'poc': return 'Prototypage / POC';
    case 'seed': return 'Amorçage / Lancement';
    case 'growth': return 'Croissance';
    case 'scale': return 'Expansion / Export';
    case 'restructuring': return 'Restructuration';
    default: return stage;
  }
}

function translateLegal(form: string): string {
  switch (form) {
    case 'startup_labeled': return 'Labellisée Startup Act';
    case 'suarl': return 'SUARL';
    case 'sarl': return 'SARL';
    case 'sa': return 'SA';
    case 'personne_physique': return 'Personne Physique';
    case 'artisan': return 'Artisan';
    case 'in_creation': return 'En cours de constitution';
    default: return form;
  }
}

function translateSector(sector: string): string {
  switch (sector) {
    case 'tech_digital': return 'Numérique & Tech';
    case 'industry': return 'Industrie & Ingénierie';
    case 'agritech': return 'Agriculture & Agroalimentaire';
    case 'green_cleantech': return 'Énergies Renouvelables & Vert';
    case 'services_commerce': return 'Services & Commerce';
    case 'creative_handicraft': return 'Artisanat & Métiers d\'Art';
    case 'health_pharma': return 'Santé & Biotech';
    default: return sector;
  }
}
