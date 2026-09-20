import { FundingType } from '../types';
import { Language } from './i18n';

export function formatTND(amount: number, lang: Language = 'fr'): string {
  const isRtl = lang === 'ar';
  if (amount >= 1000000) {
    const millions = amount / 1000000;
    const formattedNum = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
    return isRtl ? `${formattedNum} مليون د.ت` : `${formattedNum} MDT`;
  }
  return isRtl ? `${amount.toLocaleString('fr-TN')} د.ت` : `${amount.toLocaleString('fr-TN')} TND`;
}

export function getCategoryBadge(category: FundingType, lang: Language = 'fr'): { label: string; bg: string; text: string; border: string } {
  const isRtl = lang === 'ar';

  switch (category) {
    case 'grant':
      return {
        label: isRtl ? 'منحة / هبة' : 'Subvention / Don',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        text: 'text-emerald-700',
        border: 'border-emerald-300',
      };
    case 'concessionary_debt':
      return {
        label: isRtl ? 'قرض عمومي ميسر' : 'Crédit Public Bonifié',
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        text: 'text-blue-700',
        border: 'border-blue-300',
      };
    case 'venture_capital':
      return {
        label: isRtl ? 'رأس مال مخاطر / استثمار' : 'Capital-Risque / Equity',
        bg: 'bg-purple-50 text-purple-800 border-purple-200',
        text: 'text-purple-700',
        border: 'border-purple-300',
      };
    case 'microfinance':
      return {
        label: isRtl ? 'تمويل أصغر' : 'Micro-Finance',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        text: 'text-amber-700',
        border: 'border-amber-300',
      };
    case 'honor_loan':
      return {
        label: isRtl ? 'قرض شرف 0%' : "Prêt d'Honneur 0%",
        bg: 'bg-teal-50 text-teal-800 border-teal-200',
        text: 'text-teal-700',
        border: 'border-teal-300',
      };
    case 'commercial_debt':
      return {
        label: isRtl ? 'قرض بنكي تقليدي' : 'Crédit Bancaire Classique',
        bg: 'bg-sky-50 text-sky-800 border-sky-200',
        text: 'text-sky-700',
        border: 'border-sky-300',
      };
    case 'guarantee':
      return {
        label: isRtl ? 'ضمان عمومي (SOTUGAR)' : 'Garantie Publique (SOTUGAR)',
        bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        text: 'text-indigo-700',
        border: 'border-indigo-300',
      };
    default:
      return {
        label: isRtl ? 'آلية تمويل' : 'Financement',
        bg: 'bg-stone-100 text-stone-800 border-stone-200',
        text: 'text-stone-700',
        border: 'border-stone-300',
      };
  }
}
