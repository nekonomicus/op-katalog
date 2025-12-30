// SIWF Operationskatalog - Orthopädische Chirurgie und Traumatologie
// Based on Weiterbildungsprogramm vom 1. Juli 2022

export interface Procedure {
  id: string;
  name: string;
  nameShort?: string;
}

export interface Gruppe {
  id: string;
  name: string;
  minimum: number;
  maximum: number;
  assistenzMax: number;
  procedures: Procedure[];
}

export interface Teil {
  id: string;
  name: string;
  nameShort: string;
  minimum: number;
  maximum: number;
  assistenzMin: number;
  gruppen: Gruppe[];
}

export interface AnatomicalRegion {
  id: string;
  name: string;
  nameShort: string;
  minimumOperateur: number;
  category: 'upper' | 'lower' | 'axial';
}

// Anatomische Regionen (Nebenkriterium)
export const anatomicalRegions: AnatomicalRegion[] = [
  // Axial
  { id: 'azetabulum', name: 'Azetabulum', nameShort: 'Azetabulum', minimumOperateur: 2, category: 'axial' },
  { id: 'beckenring', name: 'Beckenring', nameShort: 'Becken', minimumOperateur: 2, category: 'axial' },
  { id: 'wirbelsaeule', name: 'Wirbelsäule', nameShort: 'WS', minimumOperateur: 2, category: 'axial' },
  
  // Upper Extremity
  { id: 'schulterguertel', name: 'Schultergürtel (Clavicula, Scapula, AC- und SC-Gelenk)', nameShort: 'Schultergürtel', minimumOperateur: 5, category: 'upper' },
  { id: 'schultergelenk', name: 'Schultergelenk', nameShort: 'Schulter', minimumOperateur: 10, category: 'upper' },
  { id: 'oberarm', name: 'Oberarm', nameShort: 'Oberarm', minimumOperateur: 5, category: 'upper' },
  { id: 'ellbogengelenk', name: 'Ellbogengelenk', nameShort: 'Ellbogen', minimumOperateur: 10, category: 'upper' },
  { id: 'vorderarm', name: 'Vorderarm', nameShort: 'Vorderarm', minimumOperateur: 10, category: 'upper' },
  { id: 'handgelenk', name: 'Handgelenk, Karpus', nameShort: 'Handgelenk', minimumOperateur: 20, category: 'upper' },
  { id: 'hand', name: 'Hand MC, P1-3', nameShort: 'Hand', minimumOperateur: 20, category: 'upper' },
  
  // Lower Extremity
  { id: 'hueftgelenk', name: 'Hüftgelenk', nameShort: 'Hüfte', minimumOperateur: 15, category: 'lower' },
  { id: 'oberschenkel', name: 'Oberschenkel', nameShort: 'Oberschenkel', minimumOperateur: 10, category: 'lower' },
  { id: 'kniegelenk', name: 'Kniegelenk', nameShort: 'Knie', minimumOperateur: 30, category: 'lower' },
  { id: 'unterschenkel', name: 'Unterschenkel', nameShort: 'Unterschenkel', minimumOperateur: 10, category: 'lower' },
  { id: 'osg_usg_tarsus', name: 'OSG, USG, Tarsus', nameShort: 'OSG/USG', minimumOperateur: 10, category: 'lower' },
  { id: 'fuss', name: 'Fuss MT, P1-3', nameShort: 'Fuss', minimumOperateur: 15, category: 'lower' },
];

// Teil 1: Prothetik
const teil1Prothetik: Teil = {
  id: 'teil1',
  name: 'Teil 1 Prothetik',
  nameShort: 'Prothetik',
  minimum: 30,
  maximum: 90,
  assistenzMin: 30,
  gruppen: [
    {
      id: 'teil1_gruppe1',
      name: 'Gruppe 1',
      minimum: 20,
      maximum: 60,
      assistenzMax: 0,
      procedures: [
        { id: 'htep', name: 'Hüftgelenk: Primäre Totalprothese alle Systeme und Implantationstechniken', nameShort: 'Hüft-TEP' },
        { id: 'ktep', name: 'Kniegelenk: Primäre Totalprothese alle Systeme und Implantationstechniken inkl. unikompartimentale Knieprothesen', nameShort: 'Knie-TEP' },
        { id: 'steptotal', name: 'Schultergelenk: Primäre Totalprothese alle Systeme und Implantationstechniken inkl. inverse Totalprothesen', nameShort: 'Schulter-TEP' },
        { id: 'wsdiskus', name: 'Wirbelsäule: Diskusprothese alle Systeme und Implantationstechniken', nameShort: 'WS-Diskusprothese' },
      ]
    },
    {
      id: 'teil1_gruppe2',
      name: 'Gruppe 2',
      minimum: 0,
      maximum: 10,
      assistenzMax: 0,
      procedures: [
        { id: 'ellbogentep', name: 'Ellbogengelenk: Primäre Totalprothese alle Systeme und Implantationstechniken', nameShort: 'Ellbogen-TEP' },
        { id: 'handtep', name: 'Handgelenk: Primäre Totalprothese alle Systeme und Implantationstechniken', nameShort: 'Handgelenk-TEP' },
        { id: 'fingertep', name: 'Fingergelenke: Primäre Totalprothese alle Systeme und Implantationstechniken', nameShort: 'Finger-TEP' },
        { id: 'osgtep', name: 'Oberes Sprunggelenk: Primäre Totalprothese alle Systeme und Implantationstechniken', nameShort: 'OSG-TEP' },
        { id: 'zehentep', name: 'Zehengelenke: Primäre Totalprothese alle Systeme und Implantationstechniken', nameShort: 'Zehen-TEP' },
      ]
    },
    {
      id: 'teil1_gruppe3',
      name: 'Gruppe 3',
      minimum: 0,
      maximum: 10,
      assistenzMax: 0,
      procedures: [
        { id: 'hueftkopf', name: 'Hüftgelenk: Kopfprothese', nameShort: 'Hüft-Hemiprothese' },
        { id: 'kniepatella', name: 'Kniegelenk: Sekundäre Patellaprothese', nameShort: 'Knie-Patella' },
        { id: 'kniefemuropat', name: 'Kniegelenk: Femuropatellare Prothese', nameShort: 'Knie-Femuropat' },
        { id: 'schulterkopf', name: 'Schultergelenk: Kopfprothese', nameShort: 'Schulter-Hemiprothese' },
      ]
    },
    {
      id: 'teil1_gruppe4',
      name: 'Gruppe 4',
      minimum: 0,
      maximum: 10,
      assistenzMax: 0,
      procedures: [
        { id: 'prothesenwechsel', name: 'Alle Regionen: Prothesenwechsel', nameShort: 'Prothesenwechsel' },
        { id: 'prothesenkonversion_hemi_total', name: 'Alle Regionen: Prothesenkonversion - Hemiprothese-Totalprothese', nameShort: 'Konversion Hemi→Total' },
        { id: 'prothesenkonversion_std_inv', name: 'Alle Regionen: Prothesenkonversion - Standardprothese-inverse Prothese', nameShort: 'Konversion Std→Invers' },
        { id: 'prothesenausbau', name: 'Alle Regionen: Prothesenausbau, Girdlestone', nameShort: 'Prothesenausbau' },
        { id: 'prothesenausbau_spacer', name: 'Alle Regionen: Prothesenausbau mit Spacereinbau', nameShort: 'Ausbau + Spacer' },
        { id: 'prothesenwiedereinbau', name: 'Alle Regionen: Prothesenwiedereinbau', nameShort: 'Prothesenwiedereinbau' },
        { id: 'spacerwechsel', name: 'Alle Regionen: Spacerwechsel', nameShort: 'Spacerwechsel' },
      ]
    }
  ]
};

// Teil 2: Osteotomien und Arthrodesen
const teil2Osteotomien: Teil = {
  id: 'teil2',
  name: 'Teil 2 Osteotomien und Arthrodesen',
  nameShort: 'Osteotomien/Arthrodesen',
  minimum: 15,
  maximum: 50,
  assistenzMin: 15,
  gruppen: [
    {
      id: 'teil2_gruppe1',
      name: 'Gruppe 1',
      minimum: 0,
      maximum: 20,
      assistenzMax: 0,
      procedures: [
        { id: 'pao', name: 'Becken: Periazetabuläre Osteotomie', nameShort: 'PAO' },
        { id: 'triple', name: 'Becken: Triple-Osteotomie', nameShort: 'Triple-Osteotomie' },
        { id: 'salter', name: 'Becken: Salter', nameShort: 'Salter' },
        { id: 'pemberton', name: 'Becken: Pemberton', nameShort: 'Pemberton' },
        { id: 'femur_ito', name: 'Femur: Intertrochantere Osteotomie alle Korrekturarten', nameShort: 'Femur ITO' },
        { id: 'femur_derot', name: 'Femur: Derotations-, Varisierungs-, Valgisierungsosteotomie', nameShort: 'Femur Derot/Var/Valg' },
        { id: 'femur_verlaeng', name: 'Femur: Verlängerungs-/Verkürzungsosteotomie', nameShort: 'Femur Verlängerung' },
      ]
    },
    {
      id: 'teil2_gruppe2',
      name: 'Gruppe 2',
      minimum: 0,
      maximum: 30,
      assistenzMax: 0,
      procedures: [
        { id: 'tibia_hto', name: 'Tibia: HTO valgisierend/varisierend', nameShort: 'HTO' },
        { id: 'tibia_derot', name: 'Tibia: Derotationsosteotomie, supramalleolar', nameShort: 'Tibia Derot' },
        { id: 'tibia_verlaeng', name: 'Tibia: Verlängerungs-/Verkürzungsosteotomie', nameShort: 'Tibia Verlängerung' },
        { id: 'calcaneus', name: 'Calcaneus: Valgisierung/Varisierung, Verlängerung', nameShort: 'Calcaneus Osteotomie' },
        { id: 'metatarsale', name: 'Metatarsale: alle Osteotomiearten', nameShort: 'MT-Osteotomie' },
        { id: 'hallux', name: 'Hallux valgus: Korrektur mit/ohne Osteotomie', nameShort: 'Hallux Korrektur' },
      ]
    },
    {
      id: 'teil2_gruppe3',
      name: 'Gruppe 3',
      minimum: 0,
      maximum: 20,
      assistenzMax: 0,
      procedures: [
        { id: 'humerus_ost', name: 'Humerus: Korrekturosteotomie', nameShort: 'Humerus Osteotomie' },
        { id: 'radius_ost', name: 'Radius: Korrekturosteotomie', nameShort: 'Radius Osteotomie' },
        { id: 'ulna_ost', name: 'Ulna: Korrekturosteotomie, Verlängerung, Verkürzung', nameShort: 'Ulna Osteotomie' },
        { id: 'mc_ost', name: 'Metakarpale: alle Osteotomiearten', nameShort: 'MC Osteotomie' },
        { id: 'phalanx_ost', name: 'Phalanx: alle Osteotomiearten', nameShort: 'Phalanx Osteotomie' },
      ]
    },
    {
      id: 'teil2_gruppe4',
      name: 'Gruppe 4',
      minimum: 0,
      maximum: 10,
      assistenzMax: 0,
      procedures: [
        { id: 'ws_spondylodese', name: 'Wirbelsäule: Spondylodese alle Techniken', nameShort: 'WS Spondylodese' },
        { id: 'ws_dekompression', name: 'Wirbelsäule: Dekompression, Laminektomie', nameShort: 'WS Dekompression' },
      ]
    },
    {
      id: 'teil2_gruppe5',
      name: 'Gruppe 5 Arthrodesen',
      minimum: 5,
      maximum: 30,
      assistenzMax: 0,
      procedures: [
        { id: 'arthrodese_schulter', name: 'Schultergelenk: Arthrodese', nameShort: 'Schulter-Arthrodese' },
        { id: 'arthrodese_ellbogen', name: 'Ellbogengelenk: Arthrodese', nameShort: 'Ellbogen-Arthrodese' },
        { id: 'arthrodese_handgelenk', name: 'Handgelenk: Arthrodese', nameShort: 'Handgelenk-Arthrodese' },
        { id: 'arthrodese_finger', name: 'Fingergelenke: Arthrodese', nameShort: 'Finger-Arthrodese' },
        { id: 'arthrodese_huefte', name: 'Hüftgelenk: Arthrodese', nameShort: 'Hüft-Arthrodese' },
        { id: 'arthrodese_knie', name: 'Kniegelenk: Arthrodese', nameShort: 'Knie-Arthrodese' },
        { id: 'arthrodese_osg', name: 'OSG: Arthrodese offen/arthroskopisch', nameShort: 'OSG-Arthrodese' },
        { id: 'arthrodese_usg', name: 'USG: Arthrodese', nameShort: 'USG-Arthrodese' },
        { id: 'arthrodese_triplefoot', name: 'Fuss: Triple-Arthrodese', nameShort: 'Triple-Fuss' },
        { id: 'arthrodese_tarsometatarsal', name: 'Tarsometatarsalgelenke: Arthrodese', nameShort: 'TMT-Arthrodese' },
        { id: 'arthrodese_mtp', name: 'MTP-Gelenk: Arthrodese', nameShort: 'MTP-Arthrodese' },
        { id: 'arthrodese_zehen', name: 'Zehengelenke: Arthrodese', nameShort: 'Zehen-Arthrodese' },
      ]
    }
  ]
};

// Teil 3: Rekonstruktive Eingriffe
const teil3Rekonstruktiv: Teil = {
  id: 'teil3',
  name: 'Teil 3 Rekonstruktive Eingriffe',
  nameShort: 'Rekonstruktiv',
  minimum: 70,
  maximum: 140,
  assistenzMin: 70,
  gruppen: [
    {
      id: 'teil3_gruppe1',
      name: 'Gruppe 1 Kreuzbandrekonstruktionen',
      minimum: 10,
      maximum: 50,
      assistenzMax: 0,
      procedures: [
        { id: 'vkb', name: 'Kniegelenk: VKB-Plastik alle Techniken', nameShort: 'VKB-Plastik' },
        { id: 'hkb', name: 'Kniegelenk: HKB-Plastik alle Techniken', nameShort: 'HKB-Plastik' },
        { id: 'vkb_revision', name: 'Kniegelenk: VKB-Revision', nameShort: 'VKB-Revision' },
        { id: 'hkb_revision', name: 'Kniegelenk: HKB-Revision', nameShort: 'HKB-Revision' },
        { id: 'multiligament', name: 'Kniegelenk: Multiligamentäre Rekonstruktion', nameShort: 'Multiligament Knie' },
      ]
    },
    {
      id: 'teil3_gruppe2',
      name: 'Gruppe 2 Meniskus',
      minimum: 0,
      maximum: 20,
      assistenzMax: 0,
      procedures: [
        { id: 'meniskusnaht', name: 'Kniegelenk: Meniskusnaht/Refixation', nameShort: 'Meniskusnaht' },
        { id: 'meniskustransplant', name: 'Kniegelenk: Meniskustransplantation', nameShort: 'Meniskustransplantation' },
      ]
    },
    {
      id: 'teil3_gruppe3',
      name: 'Gruppe 3 Schulterrekonstruktionen',
      minimum: 10,
      maximum: 40,
      assistenzMax: 0,
      procedures: [
        { id: 'bankart', name: 'Schultergelenk: Bankart-Repair offen/arthroskopisch', nameShort: 'Bankart' },
        { id: 'latarjet', name: 'Schultergelenk: Latarjet/Knochenblock', nameShort: 'Latarjet' },
        { id: 'rotatorenmanschette', name: 'Schultergelenk: Rotatorenmanschettenrekonstruktion offen/arthroskopisch', nameShort: 'RM-Rekonstruktion' },
        { id: 'bicepstenodese', name: 'Schultergelenk: Bicepstenodese/-tenotomie', nameShort: 'Biceps-Tenodese' },
        { id: 'ac_rekonstruktion', name: 'Schultergelenk: AC-Gelenk-Rekonstruktion', nameShort: 'AC-Rekonstruktion' },
        { id: 'slap', name: 'Schultergelenk: SLAP-Repair', nameShort: 'SLAP-Repair' },
      ]
    },
    {
      id: 'teil3_gruppe4',
      name: 'Gruppe 4 Sonstige Rekonstruktionen',
      minimum: 10,
      maximum: 50,
      assistenzMax: 0,
      procedures: [
        { id: 'patellastabilisierung', name: 'Kniegelenk: Patellastabilisierung (MPFL etc.)', nameShort: 'Patella-Stabilisierung' },
        { id: 'knorpelchirurgie', name: 'Kniegelenk: Knorpelchirurgie (Mikrofrakturierung, OATS, ACI, AMIC)', nameShort: 'Knorpelchirurgie' },
        { id: 'hueftlabrum', name: 'Hüftgelenk: Labrumrekonstruktion/-refixation arthroskopisch', nameShort: 'Hüft-Labrum' },
        { id: 'sehnennaht_achilles', name: 'Achillessehne: Naht/Rekonstruktion', nameShort: 'Achillessehnennaht' },
        { id: 'sehnennaht_patella', name: 'Patellasehne: Naht/Rekonstruktion', nameShort: 'Patellasehnennaht' },
        { id: 'sehnennaht_quadriceps', name: 'Quadricepssehne: Naht/Rekonstruktion', nameShort: 'Quadricepssehnennaht' },
        { id: 'sehnennaht_biceps', name: 'Distale Bicepssehne: Naht/Rekonstruktion', nameShort: 'Bicepssehnennaht distal' },
        { id: 'laterales_band_osg', name: 'OSG: Laterale Bandrekonstruktion', nameShort: 'OSG Bandrekonstruktion' },
        { id: 'ellbogen_band', name: 'Ellbogengelenk: Kollateralbandrekonstruktion', nameShort: 'Ellbogen Band' },
      ]
    },
    {
      id: 'teil3_gruppe5',
      name: 'Gruppe 5 Fuss',
      minimum: 5,
      maximum: 30,
      assistenzMax: 0,
      procedures: [
        { id: 'plattfuss', name: 'Fuss: Plattfusskorrektur (Sehneneingriffe)', nameShort: 'Plattfusskorrektur' },
        { id: 'hohlfuss', name: 'Fuss: Hohlfusskorrektur', nameShort: 'Hohlfusskorrektur' },
        { id: 'hammerzehe', name: 'Fuss: Hammerzehen-/Krallenzehenkorrektur', nameShort: 'Hammerzehe' },
        { id: 'fussweichteil', name: 'Fuss: Sonstige Weichteileingriffe', nameShort: 'Fuss-Weichteil' },
      ]
    }
  ]
};

// Teil 4: Osteosynthesen
const teil4Osteosynthesen: Teil = {
  id: 'teil4',
  name: 'Teil 4 Osteosynthesen',
  nameShort: 'Osteosynthesen',
  minimum: 65,
  maximum: 240,
  assistenzMin: 65,
  gruppen: [
    {
      id: 'teil4_gruppe1',
      name: 'Gruppe 1 Obere Extremität artikulär',
      minimum: 10,
      maximum: 50,
      assistenzMax: 10,
      procedures: [
        { id: 'clavicula_fx', name: 'Clavicula: alle Fixationstechniken', nameShort: 'Clavicula-Fraktur' },
        { id: 'scapula_fx', name: 'Scapula: alle Fixationstechniken', nameShort: 'Scapula-Fraktur' },
        { id: 'prox_humerus_fx', name: 'Proximaler Humerus: alle Fixationstechniken', nameShort: 'Prox. Humerus-Fraktur' },
        { id: 'dist_humerus_fx', name: 'Distaler Humerus: alle Fixationstechniken', nameShort: 'Dist. Humerus-Fraktur' },
        { id: 'olekranon_fx', name: 'Olekranon: alle Fixationstechniken', nameShort: 'Olekranon-Fraktur' },
        { id: 'radiuskopf_fx', name: 'Radiuskopf: alle Fixationstechniken', nameShort: 'Radiuskopf-Fraktur' },
        { id: 'dist_radius_fx', name: 'Distaler Radius: alle Fixationstechniken', nameShort: 'Dist. Radius-Fraktur' },
        { id: 'dist_ulna_fx', name: 'Distale Ulna: alle Fixationstechniken', nameShort: 'Dist. Ulna-Fraktur' },
        { id: 'carpus_fx', name: 'Karpus: alle Fixationstechniken', nameShort: 'Carpus-Fraktur' },
        { id: 'mc_fx', name: 'Metakarpale: alle Fixationstechniken', nameShort: 'MC-Fraktur' },
        { id: 'phalanx_hand_fx', name: 'Phalangen Hand: alle Fixationstechniken', nameShort: 'Phalanx-Hand-Fraktur' },
      ]
    },
    {
      id: 'teil4_gruppe2',
      name: 'Gruppe 2 Untere Extremität artikulär',
      minimum: 15,
      maximum: 70,
      assistenzMax: 25,
      procedures: [
        { id: 'schenkelhals_fx', name: 'Schenkelhals: alle Fixationstechniken (DHS, Schrauben, Hemiprothese)', nameShort: 'Schenkelhals-Fraktur' },
        { id: 'pertro_fx', name: 'Pertrochantär: alle Fixationstechniken', nameShort: 'Pertrochantäre Fraktur' },
        { id: 'subtro_fx', name: 'Subtrochantär: alle Fixationstechniken', nameShort: 'Subtrochantäre Fraktur' },
        { id: 'dist_femur_fx', name: 'Distales Femur: alle Fixationstechniken', nameShort: 'Dist. Femur-Fraktur' },
        { id: 'patella_fx', name: 'Patella: alle Fixationstechniken', nameShort: 'Patella-Fraktur' },
        { id: 'tibiakopf_fx', name: 'Tibiakopf: alle Fixationstechniken', nameShort: 'Tibiakopf-Fraktur' },
        { id: 'pilon_fx', name: 'Pilon tibiale: alle Fixationstechniken', nameShort: 'Pilon-Fraktur' },
        { id: 'talus_fx', name: 'Talus: alle Fixationstechniken', nameShort: 'Talus-Fraktur' },
        { id: 'calcaneus_fx', name: 'Calcaneus: alle Fixationstechniken', nameShort: 'Calcaneus-Fraktur' },
      ]
    },
    {
      id: 'teil4_gruppe3',
      name: 'Gruppe 3 Diaphysär',
      minimum: 20,
      maximum: 70,
      assistenzMax: 30,
      procedures: [
        { id: 'femurschaft_fx', name: 'Femur: alle Fixationstechniken', nameShort: 'Femurschaft-Fraktur' },
        { id: 'patella_schaft', name: 'Patella: alle Fixationstechniken', nameShort: 'Patella-Fraktur' },
        { id: 'tibiaschaft_fx', name: 'Tibia: alle Fixationstechniken', nameShort: 'Tibiaschaft-Fraktur' },
        { id: 'glenoid_fx', name: 'Glenoid: alle Fixationstechniken', nameShort: 'Glenoid-Fraktur' },
        { id: 'humerusschaft_fx', name: 'Humerus: alle Fixationstechniken', nameShort: 'Humerusschaft-Fraktur' },
        { id: 'radiusschaft_fx', name: 'Radius: alle Fixationstechniken', nameShort: 'Radiusschaft-Fraktur' },
        { id: 'ulnaschaft_fx', name: 'Ulna: alle Fixationstechniken', nameShort: 'Ulnaschaft-Fraktur' },
      ]
    },
    {
      id: 'teil4_gruppe4',
      name: 'Gruppe 4 Malleolar/Hand/Fuss',
      minimum: 10,
      maximum: 40,
      assistenzMax: 0,
      procedures: [
        { id: 'malleolar_fx', name: 'Malleolarfraktur: alle Fixationstechniken', nameShort: 'Malleolar-Fraktur' },
        { id: 'fusswurzel_fx', name: 'Fusswurzel: alle Fixationstechniken', nameShort: 'Fusswurzel-Fraktur' },
        { id: 'mt_fx', name: 'Metatarsale: alle Fixationstechniken', nameShort: 'MT-Fraktur' },
        { id: 'phalanx_fuss_fx', name: 'Phalangen Fuss: alle Fixationstechniken', nameShort: 'Phalanx-Fuss-Fraktur' },
        { id: 'handwurzel_fx', name: 'Handwurzel: alle Fixationstechniken', nameShort: 'Handwurzel-Fraktur' },
      ]
    },
    {
      id: 'teil4_gruppe5',
      name: 'Gruppe 5 Stammskelett',
      minimum: 2,
      maximum: 20,
      assistenzMax: 5,
      procedures: [
        { id: 'azetabulum_fx', name: 'Azetabulum: alle Fixationstechniken', nameShort: 'Azetabulum-Fraktur' },
        { id: 'beckenring_fx', name: 'Beckenring: alle Fixationstechniken inkl. C-Clamp, Fixateur externe', nameShort: 'Beckenring-Fraktur' },
        { id: 'ws_fx', name: 'Wirbelsäule: alle Fixationstechniken, WK-Ersatz, Vertebro-/Kyphoplastik', nameShort: 'WS-Fraktur' },
      ]
    }
  ]
};

// Teil 5: Diverses
const teil5Diverses: Teil = {
  id: 'teil5',
  name: 'Teil 5 Diverses',
  nameShort: 'Diverses',
  minimum: 15,
  maximum: 260,
  assistenzMin: 20,
  gruppen: [
    {
      id: 'teil5_gruppe1',
      name: 'Gruppe 1 Tumoren',
      minimum: 0,
      maximum: 30,
      assistenzMax: 20,
      procedures: [
        { id: 'tumor_maligne', name: 'Alle Regionen: Exzision maligner Tumor', nameShort: 'Maligner Tumor' },
        { id: 'tumor_benigne', name: 'Alle Regionen: Exzision benigner Tumor', nameShort: 'Benigner Tumor' },
        { id: 'metastase', name: 'Alle Regionen: OP bei Knochenmetastase', nameShort: 'Knochenmetastase' },
        { id: 'biopsie', name: 'Alle Regionen: Biopsie', nameShort: 'Biopsie' },
      ]
    },
    {
      id: 'teil5_gruppe2',
      name: 'Gruppe 2 Infekt',
      minimum: 5,
      maximum: 20,
      assistenzMax: 0,
      procedures: [
        { id: 'infekt_debridement', name: 'Alle Regionen: Débridement, Spüldrainage', nameShort: 'Débridement' },
        { id: 'infekt_arthro', name: 'Alle Regionen: Arthroskopische Spülung', nameShort: 'Arthroskopische Spülung' },
        { id: 'infekt_septisch', name: 'Alle Regionen: Septische Revision', nameShort: 'Septische Revision' },
      ]
    },
    {
      id: 'teil5_gruppe3',
      name: 'Gruppe 3 Nerven',
      minimum: 5,
      maximum: 50,
      assistenzMax: 0,
      procedures: [
        { id: 'cts', name: 'Hand: Dekompression Medianus (CTS)', nameShort: 'CTS' },
        { id: 'sulcus_ulnaris', name: 'Ellbogen: Ulnarisverlagerung/Dekompression', nameShort: 'Sulcus ulnaris' },
        { id: 'guyon', name: 'Hand: Dekompression Ulnaris (Guyon)', nameShort: 'Guyon' },
        { id: 'tts', name: 'Fuss: Dekompression Tibialis (TTS)', nameShort: 'TTS' },
        { id: 'nervennaht', name: 'Alle Regionen: Nervennaht/-rekonstruktion', nameShort: 'Nervennaht' },
      ]
    },
    {
      id: 'teil5_gruppe4',
      name: 'Gruppe 4 Diverses',
      minimum: 5,
      maximum: 40,
      assistenzMax: 0,
      procedures: [
        { id: 'pseudarthrose', name: 'Knochen: Pseudarthrosebehandlung', nameShort: 'Pseudarthrose' },
        { id: 'knochenentnahme', name: 'Knochen: Knochenentnahme (Beckenkamm etc.)', nameShort: 'Knochenentnahme' },
        { id: 'kompartment', name: 'Weichteile: Kompartmentspaltung', nameShort: 'Kompartmentspaltung' },
        { id: 'bursektomie', name: 'Weichteile: Bursektomie', nameShort: 'Bursektomie' },
        { id: 'amputation', name: 'Alle Regionen: Amputation', nameShort: 'Amputation' },
      ]
    },
    {
      id: 'teil5_gruppe5',
      name: 'Gruppe 5 Zugänge/ME',
      minimum: 0,
      maximum: 100,
      assistenzMax: 0,
      procedures: [
        { id: 'zugang_ohne_me', name: 'Alle Regionen: Chirurgischer Zugang ohne ME', nameShort: 'Zugang ohne ME' },
        { id: 'me', name: 'Alle Regionen: Metallentfernung', nameShort: 'ME' },
        { id: 'zugang_mit_me', name: 'Alle Regionen: Chirurgischer Zugang mit ME', nameShort: 'Zugang + ME' },
      ]
    }
  ]
};

// Export complete catalog
export const siwfCatalog: Teil[] = [
  teil1Prothetik,
  teil2Osteotomien,
  teil3Rekonstruktiv,
  teil4Osteosynthesen,
  teil5Diverses
];

// Helper functions
export function getTeilById(teilId: string): Teil | undefined {
  return siwfCatalog.find(t => t.id === teilId);
}

export function getGruppeById(gruppeId: string): { teil: Teil; gruppe: Gruppe } | undefined {
  for (const teil of siwfCatalog) {
    const gruppe = teil.gruppen.find(g => g.id === gruppeId);
    if (gruppe) {
      return { teil, gruppe };
    }
  }
  return undefined;
}

export function getProcedureById(procedureId: string): { teil: Teil; gruppe: Gruppe; procedure: Procedure } | undefined {
  for (const teil of siwfCatalog) {
    for (const gruppe of teil.gruppen) {
      const procedure = gruppe.procedures.find(p => p.id === procedureId);
      if (procedure) {
        return { teil, gruppe, procedure };
      }
    }
  }
  return undefined;
}

export function getRegionById(regionId: string): AnatomicalRegion | undefined {
  return anatomicalRegions.find(r => r.id === regionId);
}

// Implant types for Teil 4
export const implantTypes = [
  { id: 'marknagel', name: 'Marknagel', minimum: 10 },
  { id: 'platte', name: 'Platte', minimum: 20 },
  { id: 'fixateur_kdraht', name: 'Fixateur externe / K-Draht', minimum: 10 },
];

