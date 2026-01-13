// SIWF Operationskatalog - Orthopädische Chirurgie und Traumatologie des Bewegungsapparates
// EXACT match to official eLogbuch export (ProzedurenKatalog)
// Stand: 13.01.2026

export interface Procedure {
  id: string;
  name: string;  // EXACT name from eLogbuch
  maximum?: number;  // Some procedures have individual maximums (Teil 5 Gruppe 4)
}

export interface Gruppe {
  id: string;
  gruppeNum: number;  // 1-5 for sorting
  name: string;
  maximum: number;
  verantwortlichSoll: number;  // Operateur minimum
  assistentSoll: number;
  procedures: Procedure[];
}

export interface SubKategorie {
  id: string;
  name: string;
  maximum: number;
  verantwortlichSoll: number;
  assistentSoll: number;
  gruppen: Gruppe[];
}

export interface Teil {
  id: string;
  teilNum: number;  // 1-5 for sorting
  name: string;
  maximum: number;
  verantwortlichSoll: number;  // Operateur minimum
  assistentSoll: number;
  subKategorien?: SubKategorie[];  // Teil 4 has sub-categories
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

// ============================================================================
// Teil 1 Prothetik
// ============================================================================
const teil1Prothetik: Teil = {
  id: 'teil1',
  teilNum: 1,
  name: 'Teil 1 Prothetik',
  maximum: 90,
  verantwortlichSoll: 30,
  assistentSoll: 30,
  gruppen: [
    {
      id: 't1g1',
      gruppeNum: 1,
      name: 'Gruppe 1',
      maximum: 60,
      verantwortlichSoll: 20,
      assistentSoll: 0,
      procedures: [
        { id: 't1g1_htep', name: 'Hüftgelenk: Primäre Totalprothese alle Systeme und Implantationstechniken' },
        { id: 't1g1_ktep', name: 'Kniegelenk: Primäre Totalprothese alle Systeme und Implantationstechniken inkl. unikompartimentale Knieprothesen' },
        { id: 't1g1_step', name: 'Schultergelenk: Primäre Totalprothese alle Systeme und Implantationstechniken inkl. inverse Totalprothesen' },
        { id: 't1g1_wsdiskus', name: 'Wirbelsäule: Diskusprothese alle Systeme und Implantationstechniken' },
      ]
    },
    {
      id: 't1g2',
      gruppeNum: 2,
      name: 'Gruppe 2',
      maximum: 10,
      verantwortlichSoll: 0,
      assistentSoll: 0,
      procedures: [
        { id: 't1g2_ellbogen', name: 'Ellbogengelenk: Primäre Totalprothese alle Systeme und Implantationstechniken' },
        { id: 't1g2_handgelenk', name: 'Handgelenk: Primäre Totalprothese alle Systeme und Implantationstechniken' },
        { id: 't1g2_finger', name: 'Fingergelenke: Primäre Totalprothese alle Systeme und Implantationstechniken' },
        { id: 't1g2_osg', name: 'Oberes Sprunggelenk: Primäre Totalprothese alle Systeme und Implantationstechniken' },
        { id: 't1g2_zehen', name: 'Zehengelenke: Primäre Totalprothese alle Systeme und Implantationstechniken' },
      ]
    },
    {
      id: 't1g3',
      gruppeNum: 3,
      name: 'Gruppe 3',
      maximum: 10,
      verantwortlichSoll: 0,
      assistentSoll: 0,
      procedures: [
        { id: 't1g3_hueftkopf', name: 'Hüftgelenk: Kopfprothese' },
        { id: 't1g3_kniepatella', name: 'Kniegelenk: Sekundäre Patellaprothese' },
        { id: 't1g3_kniefemuro', name: 'Kniegelenk: Femuropatelläre Prothese' },
        { id: 't1g3_schulterkopf', name: 'Schultergelenk: Kopfprothese' },
      ]
    },
    {
      id: 't1g4',
      gruppeNum: 4,
      name: 'Gruppe 4',
      maximum: 10,
      verantwortlichSoll: 1,
      assistentSoll: 0,
      procedures: [
        { id: 't1g4_wechsel', name: 'Alle Regionen: Prothesenwechsel' },
        { id: 't1g4_konv_hemi', name: 'Alle Regionen: Prothesenkonversion - Hemiprothese-Totalprothese' },
        { id: 't1g4_konv_inv', name: 'Alle Regionen: Prothesenkonversion - Standardprothese-inverse Prothese' },
        { id: 't1g4_ausbau', name: 'Alle Regionen: Prothesenausbau, Girdlestone' },
        { id: 't1g4_spacer', name: 'Alle Regionen: Prothesenausbau mit Spacereinbau' },
        { id: 't1g4_wiedereinbau', name: 'Alle Regionen: Prothesenwiedereinbau' },
        { id: 't1g4_spacerwechsel', name: 'Alle Regionen: Spacerwechsel' },
      ]
    }
  ]
};

// ============================================================================
// Teil 2 Osteotomien und Arthrodesen
// ============================================================================
const teil2Osteotomien: Teil = {
  id: 'teil2',
  teilNum: 2,
  name: 'Teil 2 Osteotomien und Arthrodesen',
  maximum: 50,
  verantwortlichSoll: 15,
  assistentSoll: 15,
  gruppen: [
    {
      id: 't2g1',
      gruppeNum: 1,
      name: 'Gruppe 1',
      maximum: 20,
      verantwortlichSoll: 0,
      assistentSoll: 0,
      procedures: [
        { id: 't2g1_pao', name: 'Becken: Periazetabuläre Osteotomie' },
        { id: 't2g1_triple', name: 'Becken: Triple-Osteotomie' },
        { id: 't2g1_salter', name: 'Becken: Salter' },
        { id: 't2g1_pemberton', name: 'Becken: Pemberton' },
        { id: 't2g1_ito', name: 'Femur: Intertrochantere Osteotomie alle Korrekturarten' },
      ]
    },
    {
      id: 't2g2',
      gruppeNum: 2,
      name: 'Gruppe 2',
      maximum: 10,
      verantwortlichSoll: 3,
      assistentSoll: 0,
      procedures: [
        { id: 't2g2_femurdist', name: 'Femur distal: Achsenkorrektur knienahe alle Korrekturarten und Techniken' },
        { id: 't2g2_tibiaprox', name: 'Tibia proximal: Achsenkorrektur knienahe alle Korrekturarten und Techniken' },
        { id: 't2g2_korrektur', name: 'Alle ausser Hand, Fuss: Korrektur-Osteotomie bei Deformität posttraumatisch, angeboren, erworben' },
      ]
    },
    {
      id: 't2g3',
      gruppeNum: 3,
      name: 'Gruppe 3',
      maximum: 10,
      verantwortlichSoll: 5,
      assistentSoll: 0,
      procedures: [
        { id: 't2g3_hand', name: 'Hand: Korrektur-Osteotomie' },
        { id: 't2g3_fuss', name: 'Fuss: Korrektur-Osteotomie' },
        { id: 't2g3_hallux', name: 'Fuss: Osteotomie bei Hallux valgus' },
      ]
    },
    {
      id: 't2g4',
      gruppeNum: 4,
      name: 'Gruppe 4',
      maximum: 10,
      verantwortlichSoll: 1,
      assistentSoll: 0,
      procedures: [
        { id: 't2g4_arthrodese', name: 'Alle: Arthrodese alle Techniken' },
      ]
    }
  ]
};

// ============================================================================
// Teil 3 Rekonstruktive Eingriffe, Arthroskopie
// ============================================================================
const teil3Rekonstruktiv: Teil = {
  id: 'teil3',
  teilNum: 3,
  name: 'Teil 3 Rekonstruktive Eingriffe, Arthroskopie',
  maximum: 140,
  verantwortlichSoll: 70,
  assistentSoll: 70,
  gruppen: [
    {
      id: 't3g1',
      gruppeNum: 1,
      name: 'Gruppe 1',
      maximum: 40,
      verantwortlichSoll: 10,
      assistentSoll: 70,
      procedures: [
        { id: 't3g1_laminektomie', name: 'Wirbelsäule: Laminektomie' },
        { id: 't3g1_diskus', name: 'Wirbelsäule: OP bei Diskushernie' },
        { id: 't3g1_spondylodese', name: 'Wirbelsäule: Spondylodese' },
        { id: 't3g1_skoliose', name: 'Wirbelsäule: Korrektur bei Skoliose, Kyphose' },
        { id: 't3g1_fai', name: 'Hüfte: OP bei femoroazetabulärem Impingement' },
        { id: 't3g1_epiphysiolyse', name: 'Hüfte: OP bei Epiphysiolyse' },
        { id: 't3g1_vkb', name: 'Knie: VKB-Rekonstruktion, -naht' },
        { id: 't3g1_hkb', name: 'Knie: HKB-Rekonstruktion, -naht' },
        { id: 't3g1_meniskusnaht', name: 'Knie: Meniskusnaht' },
        { id: 't3g1_patella', name: 'Knie: OP bei Patella-Maltracking' },
        { id: 't3g1_rmnaht', name: 'Schulter: Rotatorenmanschettennaht' },
        { id: 't3g1_rmrekon', name: 'Schulter: Rotatorenmanschetten-Rekonstruktion' },
        { id: 't3g1_schulterstab', name: 'Schulter: Schulterstabilisation (Glenohumeral, AC-Gelenk)' },
      ]
    },
    {
      id: 't3g2',
      gruppeNum: 2,
      name: 'Gruppe 2',
      maximum: 60,
      verantwortlichSoll: 30,
      assistentSoll: 0,
      procedures: [
        { id: 't3g2_meniskektomie', name: 'Knie: Meniskektomie' },
        { id: 't3g2_knorpel', name: 'Knie: Knorpelrekonstruktion, Microfracture' },
        { id: 't3g2_streck', name: 'Knie: Naht / Rekonstruktion Streckapparat' },
        { id: 't3g2_fusssehne', name: 'Fuss: Sehnenchirurgie' },
        { id: 't3g2_osginstab', name: 'Fuss: OSG Instabilität' },
        { id: 't3g2_halluxweich', name: 'Fuss: Hallux valgus (nur Weichteile)' },
        { id: 't3g2_hohmann', name: 'Fuss: Hohmann' },
        { id: 't3g2_fussganglion', name: 'Fuss: Ganglion' },
        { id: 't3g2_exostosen', name: 'Fuss: Exostosen' },
        { id: 't3g2_akromio', name: 'Schulter: Akromioplastik, AC-Resektion' },
        { id: 't3g2_subakrom', name: 'Schulter: Subakromiale Dekompression' },
        { id: 't3g2_bizeps', name: 'Schulter: Bizeps-Sehnenchirurgie' },
        { id: 't3g2_ellbogenband', name: 'Ellbogen: Bandnaht, -rekonstruktion' },
        { id: 't3g2_epikondylitis', name: 'Ellbogen: Epikondylitis' },
        { id: 't3g2_handsehne', name: 'Handgelenk, Hand: Sehnenchirurgie' },
        { id: 't3g2_handband', name: 'Handgelenk, Hand: Bandchirurgie' },
        { id: 't3g2_tfcc', name: 'Handgelenk, Hand: TFCC' },
        { id: 't3g2_dupuytren', name: 'Handgelenk, Hand: Dupuytren' },
        { id: 't3g2_handganglion', name: 'Handgelenk, Hand: Ganglion' },
      ]
    },
    {
      id: 't3g3',
      gruppeNum: 3,
      name: 'Gruppe 3',
      maximum: 40,
      verantwortlichSoll: 5,
      assistentSoll: 0,
      procedures: [
        { id: 't3g3_freilappen', name: 'Alle Regionen: Freie Lappenplastik' },
        { id: 't3g3_hautlappen', name: 'Alle Regionen: Hautlappen gestielt' },
        { id: 't3g3_hauttransplant', name: 'Alle Regionen: Hauttransplantation' },
      ]
    },
    {
      id: 't3_arthroskopie',
      gruppeNum: 4,
      name: 'Arthroskopie',
      maximum: 60,
      verantwortlichSoll: 40,
      assistentSoll: 0,
      procedures: [
        { id: 't3_arthro', name: 'Arthroskopie' },
      ]
    }
  ]
};

// ============================================================================
// Teil 4 Osteosynthesen
// ============================================================================
const teil4Osteosynthesen: Teil = {
  id: 'teil4',
  teilNum: 4,
  name: 'Teil 4 Osteosynthesen',
  maximum: 240,
  verantwortlichSoll: 65,
  assistentSoll: 65,
  subKategorien: [
    {
      id: 't4_diametaphysaer',
      name: 'Dia-metaphysäre Frakturen (AO-Klassifikation: Segment 2, Segmente 1 und 3 nur Gruppe A)',
      maximum: 110,
      verantwortlichSoll: 30,
      assistentSoll: 30,
      gruppen: [
        {
          id: 't4g1',
          gruppeNum: 1,
          name: 'Gruppe 1',
          maximum: 70,
          verantwortlichSoll: 20,
          assistentSoll: 0,
          procedures: [
            { id: 't4g1_femur', name: 'Femur: Platte, Marknagel, Fixateur externe' },
            { id: 't4g1_tibia', name: 'Tibia: Platte, Marknagel, Fixateur externe' },
            { id: 't4g1_humerus', name: 'Humerus: Platte, Marknagel, Fixateur externe' },
            { id: 't4g1_radiusulna', name: 'Radius, Ulna: Platte, Marknagel, Fixateur externe' },
          ]
        },
        {
          id: 't4g2',
          gruppeNum: 2,
          name: 'Gruppe 2',
          maximum: 40,
          verantwortlichSoll: 10,
          assistentSoll: 0,
          procedures: [
            { id: 't4g2_clavscap', name: 'Cavicula, Scapula:' },
            { id: 't4g2_ac', name: 'AC-Luxation: alle Fixationstechniken' },
            { id: 't4g2_sc', name: 'SC-Luxation: alle Fixationstechniken' },
            { id: 't4g2_hand', name: 'Hand: MC, P1, P2: Alle Fixationstechniken' },
            { id: 't4g2_fuss', name: 'Fuss: MT, P1, P2: Alle Fixationstechniken' },
          ]
        }
      ]
    },
    {
      id: 't4_artikulaer',
      name: 'Artikuläre Frakturen (AO-Klassifikation: Segmente 1 und 3 nur Gruppen B und C)',
      maximum: 110,
      verantwortlichSoll: 30,
      assistentSoll: 30,
      gruppen: [
        {
          id: 't4g3',
          gruppeNum: 3,
          name: 'Gruppe 3',
          maximum: 70,
          verantwortlichSoll: 20,
          assistentSoll: 0,
          procedures: [
            { id: 't4g3_femur', name: 'Femur: Alle Fixationstechniken' },
            { id: 't4g3_patella', name: 'Patella: Alle Fixationstechniken' },
            { id: 't4g3_tibia', name: 'Tibia: Alle Fixationstechniken' },
            { id: 't4g3_glenoid', name: 'Glenoid: Alle Fixationstechniken' },
            { id: 't4g3_humerus', name: 'Humerus: Alle Fixationstechniken' },
            { id: 't4g3_radius', name: 'Radius: Alle Fixationstechniken' },
            { id: 't4g3_ulna', name: 'Ulna: Alle Fixationstechniken' },
          ]
        },
        {
          id: 't4g4',
          gruppeNum: 4,
          name: 'Gruppe 4',
          maximum: 40,
          verantwortlichSoll: 10,
          assistentSoll: 0,
          procedures: [
            { id: 't4g4_malleolar', name: 'Malleolarfraktur: Alle Fixationstechniken' },
            { id: 't4g4_fusswurzel', name: 'Fusswurzel, Fuss: Alle Fixationstechniken' },
            { id: 't4g4_handwurzel', name: 'Handwurzel, Hand: Alle Fixationstechniken' },
          ]
        }
      ]
    },
    {
      id: 't4_stammskelett',
      name: 'Stammskelett (Azetabulum alle Frakturtypen, Azetabulum alle Frakturtypen, Wirbelsäule alle Frakturtypen)',
      maximum: 20,
      verantwortlichSoll: 2,
      assistentSoll: 5,
      gruppen: [
        {
          id: 't4g5',
          gruppeNum: 5,
          name: 'Gruppe 5',
          maximum: 20,
          verantwortlichSoll: 2,
          assistentSoll: 5,
          procedures: [
            { id: 't4g5_azetabulum', name: 'Azetabulum, Beckenring: Alle Fixationstechniken, inkl. C-Clamp, inkl. Fixateur externe' },
            { id: 't4g5_ws', name: 'Wirbelsäule: Alle Fixationstechniken, WK-Ersatz, Vertebro-, Kyphoplastik' },
          ]
        }
      ]
    }
  ],
  gruppen: []  // Gruppen are inside subKategorien for Teil 4
};

// ============================================================================
// Teil 5 Diverses
// ============================================================================
const teil5Diverses: Teil = {
  id: 'teil5',
  teilNum: 5,
  name: 'Teil 5 Diverses',
  maximum: 260,
  verantwortlichSoll: 20,
  assistentSoll: 20,
  gruppen: [
    {
      id: 't5g1',
      gruppeNum: 1,
      name: 'Gruppe 1',
      maximum: 30,
      verantwortlichSoll: 0,
      assistentSoll: 0,
      procedures: [
        { id: 't5g1_maligne', name: 'Alle Regionen: Exzision maligner Tumor' },
        { id: 't5g1_benigne', name: 'Alle Regionen: Exzision benigner Tumor' },
        { id: 't5g1_metastase', name: 'Alle Regionen: OP bei Knochenmetastase' },
        { id: 't5g1_biopsie', name: 'Alle Regionen: Biopsie' },
      ]
    },
    {
      id: 't5g2',
      gruppeNum: 2,
      name: 'Gruppe 2',
      maximum: 20,
      verantwortlichSoll: 5,
      assistentSoll: 0,
      procedures: [
        { id: 't5g2_infekt', name: 'Alle Regionen, Gelenk, Weichteile, Knochen: OP bei Infekt, Débridement, Spüldrainage, arthroskopische Spülung etc.' },
      ]
    },
    {
      id: 't5g3',
      gruppeNum: 3,
      name: 'Gruppe 3',
      maximum: 50,
      verantwortlichSoll: 5,
      assistentSoll: 0,
      procedures: [
        { id: 't5g3_ulnaris', name: 'Ellbogen: Ulnarisverlagerung' },
        { id: 't5g3_medianus', name: 'Hand: Dekompression Medianus, Ulnaris' },
        { id: 't5g3_tibialis', name: 'Fuss: Dekompression Tibialis' },
        { id: 't5g3_nervennaht', name: 'Alle Regionen: Nervennaht, -rekonstruktion' },
      ]
    },
    {
      id: 't5g4',
      gruppeNum: 4,
      name: 'Gruppe 4',
      maximum: 60,
      verantwortlichSoll: 5,
      assistentSoll: 0,
      procedures: [
        { id: 't5g4_pseudarthrose', name: 'Alle Regionen: Knochen Pseudarthrosebehandlung', maximum: 10 },
        { id: 't5g4_knochen', name: 'Alle Regionen: Knochenentnahme', maximum: 20 },
        { id: 't5g4_weichteile', name: 'Alle Regionen: Weichteile, Kompartment, Bursektomie', maximum: 20 },
        { id: 't5g4_amputation', name: 'Alle Regionen: Amputation', maximum: 10 },
      ]
    },
    {
      id: 't5g5',
      gruppeNum: 5,
      name: 'Gruppe 5',
      maximum: 100,
      verantwortlichSoll: 0,
      assistentSoll: 0,
      procedures: [
        { id: 't5g5_zugang', name: 'Alle Regionen: Zugang allein (gemäss Katalog Anatomieprüfung)' },
        { id: 't5g5_me', name: 'Alle Regionen: Zugang mit Metallentfernung' },
      ]
    }
  ]
};

// Implantate (Teil 4 Osteosynthesen) - tracked separately
export interface Implant {
  id: string;
  name: string;
  verantwortlichSoll: number;
}

export const implantTypes: Implant[] = [
  { id: 'marknagel', name: 'Alle: Marknagel', verantwortlichSoll: 10 },
  { id: 'platte', name: 'Alle: Platte', verantwortlichSoll: 20 },
  { id: 'fixateur_kdraht', name: 'Alle: Fixateur externe, K-Draht', verantwortlichSoll: 10 },
];

// Export complete catalog
export const siwfCatalog: Teil[] = [
  teil1Prothetik,
  teil2Osteotomien,
  teil3Rekonstruktiv,
  teil4Osteosynthesen,
  teil5Diverses
];

// ============================================================================
// Helper functions
// ============================================================================

export function getTeilById(teilId: string): Teil | undefined {
  return siwfCatalog.find(t => t.id === teilId);
}

export function getTeilByNum(num: number): Teil | undefined {
  return siwfCatalog.find(t => t.teilNum === num);
}

// Get all gruppen flattened (including from subKategorien)
export function getAllGruppen(): { teil: Teil; subKategorie?: SubKategorie; gruppe: Gruppe }[] {
  const result: { teil: Teil; subKategorie?: SubKategorie; gruppe: Gruppe }[] = [];
  
  for (const teil of siwfCatalog) {
    // Direct gruppen
    for (const gruppe of teil.gruppen) {
      result.push({ teil, gruppe });
    }
    // SubKategorien gruppen (Teil 4)
    if (teil.subKategorien) {
      for (const sub of teil.subKategorien) {
        for (const gruppe of sub.gruppen) {
          result.push({ teil, subKategorie: sub, gruppe });
        }
      }
    }
  }
  
  return result;
}

export function getGruppeById(gruppeId: string): { teil: Teil; subKategorie?: SubKategorie; gruppe: Gruppe } | undefined {
  for (const teil of siwfCatalog) {
    // Check direct gruppen
    const gruppe = teil.gruppen.find(g => g.id === gruppeId);
    if (gruppe) {
      return { teil, gruppe };
    }
    // Check subKategorien
    if (teil.subKategorien) {
      for (const sub of teil.subKategorien) {
        const subGruppe = sub.gruppen.find(g => g.id === gruppeId);
        if (subGruppe) {
          return { teil, subKategorie: sub, gruppe: subGruppe };
        }
      }
    }
  }
  return undefined;
}

export function getProcedureById(procedureId: string): { 
  teil: Teil; 
  subKategorie?: SubKategorie; 
  gruppe: Gruppe; 
  procedure: Procedure 
} | undefined {
  for (const teil of siwfCatalog) {
    // Check direct gruppen
    for (const gruppe of teil.gruppen) {
      const procedure = gruppe.procedures.find(p => p.id === procedureId);
      if (procedure) {
        return { teil, gruppe, procedure };
      }
    }
    // Check subKategorien
    if (teil.subKategorien) {
      for (const sub of teil.subKategorien) {
        for (const gruppe of sub.gruppen) {
          const procedure = gruppe.procedures.find(p => p.id === procedureId);
          if (procedure) {
            return { teil, subKategorie: sub, gruppe, procedure };
          }
        }
      }
    }
  }
  return undefined;
}

export function getRegionById(regionId: string): AnatomicalRegion | undefined {
  return anatomicalRegions.find(r => r.id === regionId);
}

// Get display string for procedure with Teil/Gruppe numbers
export function getProcedureDisplayString(procedureId: string): string {
  const info = getProcedureById(procedureId);
  if (!info) return procedureId;
  
  return `T${info.teil.teilNum}G${info.gruppe.gruppeNum}: ${info.procedure.name}`;
}

// Get Teil/Gruppe code (e.g., "T1G2")
export function getTeilGruppeCode(procedureId: string): string {
  const info = getProcedureById(procedureId);
  if (!info) return '';
  return `T${info.teil.teilNum}G${info.gruppe.gruppeNum}`;
}
