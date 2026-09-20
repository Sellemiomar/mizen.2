export interface GovernorateInfo {
  id: string;
  nameFr: string;
  nameAr: string;
  region: 'Grand Tunis' | 'Nord-Est' | 'Nord-Ouest' | 'Centre-Est' | 'Centre-Ouest' | 'Sud-Est' | 'Sud-Ouest';
  isZDR: boolean; // Zone de Développement Régional
  zdrGroup?: 1 | 2; // Groupe 1 (15% subvention) ou Groupe 2 (30% subvention)
}

export const TUNISIAN_GOVERNORATES: GovernorateInfo[] = [
  // Grand Tunis (Coastal / Capital)
  { id: 'tunis', nameFr: 'Tunis', nameAr: 'تونس', region: 'Grand Tunis', isZDR: false },
  { id: 'ariana', nameFr: 'Ariana', nameAr: 'أريانة', region: 'Grand Tunis', isZDR: false },
  { id: 'ben_arous', nameFr: 'Ben Arous', nameAr: 'بن عروس', region: 'Grand Tunis', isZDR: false },
  { id: 'manouba', nameFr: 'Manouba', nameAr: 'منوبة', region: 'Grand Tunis', isZDR: true, zdrGroup: 1 },

  // Nord-Est
  { id: 'nabeul', nameFr: 'Nabeul', nameAr: 'نابل', region: 'Nord-Est', isZDR: false },
  { id: 'zaghouan', nameFr: 'Zaghouan', nameAr: 'زغوان', region: 'Nord-Est', isZDR: true, zdrGroup: 1 },
  { id: 'bizerte', nameFr: 'Bizerte', nameAr: 'بنزرت', region: 'Nord-Est', isZDR: true, zdrGroup: 1 },

  // Nord-Ouest (Priority ZDR)
  { id: 'beja', nameFr: 'Béja', nameAr: 'باجة', region: 'Nord-Ouest', isZDR: true, zdrGroup: 2 },
  { id: 'jendouba', nameFr: 'Jendouba', nameAr: 'جندوبة', region: 'Nord-Ouest', isZDR: true, zdrGroup: 2 },
  { id: 'le_kef', nameFr: 'Le Kef', nameAr: 'الكاف', region: 'Nord-Ouest', isZDR: true, zdrGroup: 2 },
  { id: 'siliana', nameFr: 'Siliana', nameAr: 'سليانة', region: 'Nord-Ouest', isZDR: true, zdrGroup: 2 },

  // Centre-Est
  { id: 'sousse', nameFr: 'Sousse', nameAr: 'سوسة', region: 'Centre-Est', isZDR: false },
  { id: 'monastir', nameFr: 'Monastir', nameAr: 'المنستير', region: 'Centre-Est', isZDR: false },
  { id: 'mahdia', nameFr: 'Mahdia', nameAr: 'المهدية', region: 'Centre-Est', isZDR: true, zdrGroup: 1 },
  { id: 'sfax', nameFr: 'Sfax', nameAr: 'صفاقس', region: 'Centre-Est', isZDR: false },

  // Centre-Ouest (Priority ZDR)
  { id: 'kairouan', nameFr: 'Kairouan', nameAr: 'القيروان', region: 'Centre-Ouest', isZDR: true, zdrGroup: 2 },
  { id: 'kasserine', nameFr: 'Kasserine', nameAr: 'القصرين', region: 'Centre-Ouest', isZDR: true, zdrGroup: 2 },
  { id: 'sidi_bouzid', nameFr: 'Sidi Bouzid', nameAr: 'سيدي بوزيد', region: 'Centre-Ouest', isZDR: true, zdrGroup: 2 },

  // Sud-Ouest (Priority ZDR)
  { id: 'gafsa', nameFr: 'Gafsa', nameAr: 'قفصة', region: 'Sud-Ouest', isZDR: true, zdrGroup: 2 },
  { id: 'tozeur', nameFr: 'Tozeur', nameAr: 'توزر', region: 'Sud-Ouest', isZDR: true, zdrGroup: 2 },
  { id: 'kebili', nameFr: 'Kébili', nameAr: 'قبلي', region: 'Sud-Ouest', isZDR: true, zdrGroup: 2 },

  // Sud-Est
  { id: 'gabes', nameFr: 'Gabès', nameAr: 'قابس', region: 'Sud-Est', isZDR: true, zdrGroup: 1 },
  { id: 'medenine', nameFr: 'Médenine', nameAr: 'مدنين', region: 'Sud-Est', isZDR: true, zdrGroup: 2 },
  { id: 'tataouine', nameFr: 'Tataouine', nameAr: 'تطاوين', region: 'Sud-Est', isZDR: true, zdrGroup: 2 },
];
