// ── Types ─────────────────────────────────────────────────────────────────────

export interface TeamMember {
  name: string;
  role: string;
  emoji: string;
  avatarColor: string;
  quote?: string;
}

export interface Specialty {
  emoji: string;
  title: string;
  description: string;
  isSignature?: boolean;
  accentColor: string;
}

export interface Partner {
  name: string;
  type: string;
  origin: string;
  description: string;
  emoji: string;
  bgColor: string;
}

export interface Commitment {
  icon: string;
  title: string;
  text: string;
}

export interface GalleryImage {
  emoji: string;
  caption: string;
  color: string;
  aspect: "square" | "wide" | "tall";
}

export interface StoreEditorialContent {
  magasin: {
    heroGradient: string;
    heroEmoji: string;
    title: string;
    tagline: string;
    story: string[];
    highlights: { label: string; value: string }[];
  };
  equipe: {
    intro: string;
    members: TeamMember[];
  };
  savoirFaire: {
    intro: string;
    heroEmoji: string;
    heroGradient: string;
    specialties: Specialty[];
  };
  partenaires: {
    intro: string;
    partners: Partner[];
  };
  engagements: {
    intro: string;
    items: Commitment[];
  };
  galerie: {
    intro: string;
    images: GalleryImage[];
  };
}

// ── Toulouse Capitole ─────────────────────────────────────────────────────────

const TOULOUSE: StoreEditorialContent = {
  magasin: {
    heroGradient: "linear-gradient(135deg, #7c1c1c 0%, #b8001a 60%, #c0392b 100%)",
    heroEmoji: "🏛️",
    title: "Le traiteur du cœur de Toulouse",
    tagline: "Depuis 2008, aux côtés des Toulousains pour chaque moment qui compte.",
    story: [
      "Installé rue du Capitole depuis 2008, notre rayon traiteur est né d'une conviction simple : la bonne cuisine ne devrait pas être réservée aux grandes occasions. En plein cœur de la Ville Rose, nous avons construit une équipe de passionnés dont la journée commence à 5 h du matin, quand les marchés livrent encore leurs cageots.",
      "Seize ans plus tard, nous préparons plusieurs centaines de plats par semaine — des verrines pour les apéritifs d'entreprise du Capitole, des plateaux de fromages pour les familles du Mirail, des buffets entiers pour les mariages du Lauragais. Chaque recette porte la signature du chef Youssef Benali, formé à Lyon avant de revenir au pays.",
      "Notre magasin couvre 3 200 m², dont 420 dédiés au laboratoire traiteur. Côté engagements : 80 % de nos viandes viennent du rayon boucherie maison, et nous refusons tout additif de conservation dans nos préparations maison. Ce que vous mangez, nous le mangerions aussi.",
    ],
    highlights: [
      { label: "Ouverture", value: "2008" },
      { label: "Surface", value: "3 200 m²" },
      { label: "Équipe traiteur", value: "14 personnes" },
      { label: "Plats / semaine", value: "600 +" },
    ],
  },

  equipe: {
    intro: "Quatorze artisans, une seule obsession : que votre repas soit une réussite.",
    members: [
      {
        name: "Youssef Benali",
        role: "Chef traiteur",
        emoji: "👨‍🍳",
        avatarColor: "#7c1c1c",
        quote: "Un buffet réussi, c'est un buffet dont personne ne voit la cuisine derrière.",
      },
      {
        name: "Camille Rouquette",
        role: "Chef pâtissière",
        emoji: "👩‍🍳",
        avatarColor: "#b05020",
        quote: "Je passe plus de temps sur les finitions que sur la recette elle-même.",
      },
      {
        name: "Théo Marchand",
        role: "Boucher-charcutier",
        emoji: "🥩",
        avatarColor: "#5a2020",
        quote: "Je connais les éleveurs par leur prénom.",
      },
      {
        name: "Aïcha Diallo",
        role: "Responsable commandes",
        emoji: "📋",
        avatarColor: "#8a3030",
      },
      {
        name: "Marc Soubirous",
        role: "Traiteur événementiel",
        emoji: "🎉",
        avatarColor: "#6b1515",
        quote: "J'ai coordonné des buffets pour 800 couverts. Chaque fois c'est un défi.",
      },
      {
        name: "Lucie Garnier",
        role: "Fromagère",
        emoji: "🧀",
        avatarColor: "#7a4020",
        quote: "L'affinage, c'est une conversation entre le fromage et le temps.",
      },
    ],
  },

  savoirFaire: {
    intro: "Des techniques de cuisine traditionnelle française, adaptées à l'exigence du volume sans jamais sacrifier la qualité.",
    heroEmoji: "🫕",
    heroGradient: "linear-gradient(135deg, #3d1a0a 0%, #7c3010 100%)",
    specialties: [
      {
        emoji: "🫕",
        title: "Cuisines mijotées",
        description: "Bœuf bourguignon, daube provençale, cassoulet maison — nos braisés partent à 6 h et finissent après 8 heures de cuisson lente au four à sole.",
        isSignature: true,
        accentColor: "#7c1c1c",
      },
      {
        emoji: "🐟",
        title: "Terrines et galantines",
        description: "Montées à la main dans notre laboratoire, sans gélatine industrielle. Recettes transmises de chef en chef depuis l'ouverture.",
        accentColor: "#1a4060",
      },
      {
        emoji: "🧀",
        title: "Cave à fromages",
        description: "Sélection de 40 AOP françaises affinées sur place. Notre fromagère, Lucie, effectue des tournées chez les producteurs chaque quinzaine.",
        accentColor: "#6b4a10",
      },
      {
        emoji: "🎂",
        title: "Pâtisserie événementielle",
        description: "Entremets, macarons, pièces montées sur commande. Notre pâtissière travaille exclusivement avec du beurre AOP Charentes-Poitou et des œufs plein air.",
        accentColor: "#8a2060",
      },
      {
        emoji: "🥗",
        title: "Salades de saison",
        description: "Renouvelées chaque semaine selon les arrivages du marché. Zéro vinaigrette prête à l'emploi — tout est assemblé le matin même.",
        accentColor: "#1a6030",
      },
      {
        emoji: "🍱",
        title: "Buffets sur-mesure",
        description: "De 10 à 500 couverts, livrés montés ou prêts à assembler. Formules cocktail, déjeuner d'affaires ou dîner de gala. Devis sous 24 h.",
        accentColor: "#2a1060",
      },
    ],
  },

  partenaires: {
    intro: "Nous privilégions des approvisionnements courts — moins de 200 km pour la grande majorité de nos produits frais.",
    partners: [
      {
        name: "Ferme Larroque",
        type: "Élevage",
        origin: "L'Isle-Jourdain (32)",
        description: "Poulets et pintades élevés en plein air sur 12 hectares. Abattage à la ferme, livraison bi-hebdomadaire.",
        emoji: "🐔",
        bgColor: "#fef9c3",
      },
      {
        name: "Moulin de la Garonne",
        type: "Meunerie",
        origin: "Moissac (82)",
        description: "Farine de blé ancien T65 moulue sur meule de pierre. Utilisée pour toutes nos pâtes feuilletées et brioches maison.",
        emoji: "🌾",
        bgColor: "#fef3c7",
      },
      {
        name: "Fromagerie des Pyrénées",
        type: "Fromagerie artisanale",
        origin: "Lavelanet (09)",
        description: "Tomme noire et brebis fermier. Affinage sur planches de sapin dans leur cave à 1 050 m d'altitude.",
        emoji: "🧀",
        bgColor: "#fff7ed",
      },
      {
        name: "Maraîchage Soulié",
        type: "Légumes et herbes",
        origin: "Verfeil (31)",
        description: "Légumes anciens, herbes fraîches et fleurs comestibles. Culture sans pesticides, livraison trois fois par semaine.",
        emoji: "🥬",
        bgColor: "#f0fdf4",
      },
      {
        name: "Vignoble Château Bellevue",
        type: "Vin",
        origin: "Fronton (31)",
        description: "AOC Fronton rouge et rosé, sélectionnés pour accompagner nos plateaux fromages et nos buffets.",
        emoji: "🍷",
        bgColor: "#fdf2f8",
      },
      {
        name: "Pêcherie Atlantique Sud",
        type: "Poissonnerie",
        origin: "Arcachon (33)",
        description: "Bar, daurade et crustacés issus de la pêche artisanale du Bassin. Arrivage quotidien, mardi et vendredi.",
        emoji: "🐟",
        bgColor: "#eff6ff",
      },
    ],
  },

  engagements: {
    intro: "Des engagements concrets, pas des slogans. Nous les mesurons et les affichons chaque trimestre.",
    items: [
      {
        icon: "♻️",
        title: "Zéro gaspillage alimentaire",
        text: "Nos invendus de fin de journée sont donnés chaque soir à une association partenaire. En 2025, 4,2 tonnes redistribuées.",
      },
      {
        icon: "🌿",
        title: "Approvisionnement local",
        text: "Plus de 78 % de nos produits frais viennent de moins de 200 km. Objectif 85 % en 2026.",
      },
      {
        icon: "🐄",
        title: "Élevage responsable",
        text: "Zéro élevage en batterie dans nos sélections. Viandes labellisées Label Rouge ou issues d'éleveurs partenaires certifiés.",
      },
      {
        icon: "🧪",
        title: "Sans additifs maison",
        text: "Nos préparations maison (terrines, plats cuisinés, pâtisseries) ne contiennent aucun additif E-xxx de conservation ou de texture.",
      },
      {
        icon: "📦",
        title: "Emballages biosourcés",
        text: "Transition vers barquettes en bagasse et couverts en PLA depuis 2024. Objectif 100 % plastique pétrosourcé éliminé en 2026.",
      },
      {
        icon: "💧",
        title: "Réduction des consommations",
        text: "Récupération des eaux de nettoyage, minuteries sur la chambre froide, solaire en toiture. -18 % de consommation d'eau vs 2022.",
      },
    ],
  },

  galerie: {
    intro: "Les coulisses de notre cuisine, nos réalisations, l'équipe au quotidien.",
    images: [
      { emoji: "👨‍🍳", caption: "Youssef en pleine dressage d'un plateau cocktail", color: "#3d1a0a", aspect: "tall" },
      { emoji: "🥩", caption: "La boucherie maison un mardi matin", color: "#5a2020", aspect: "square" },
      { emoji: "🎂", caption: "Pièce montée pour un mariage de 200 couverts", color: "#8a2060", aspect: "wide" },
      { emoji: "🫕", caption: "Cassolettes de brandade sortant du four", color: "#7c3010", aspect: "square" },
      { emoji: "🧀", caption: "Cave à fromages — plateau Lucie", color: "#6b4a10", aspect: "square" },
      { emoji: "🥗", caption: "Salades du marché, assemblage 6 h du matin", color: "#1a6030", aspect: "wide" },
      { emoji: "🎉", caption: "Buffet d'entreprise — 350 couverts, Capitole", color: "#6b1515", aspect: "tall" },
      { emoji: "🌾", caption: "Livraison du moulin Larroque, vendredi matin", color: "#6b5a10", aspect: "square" },
    ],
  },
};

// ── Bordeaux Lac ──────────────────────────────────────────────────────────────

const BORDEAUX: StoreEditorialContent = {
  magasin: {
    heroGradient: "linear-gradient(135deg, #1a2d4a 0%, #0f4c7a 60%, #1565a0 100%)",
    heroEmoji: "🍷",
    title: "Le traiteur du Bordelais, au bord du Lac",
    tagline: "Depuis 2013, cuisine du terroir girondin pour les événements qui méritent le meilleur.",
    story: [
      "Le magasin Bordeaux Lac a ouvert ses portes en 2013 avec une ambition précise : apporter la gastronomie girondine au quotidien des familles et entreprises du quartier. Notre rayon traiteur est pensé comme une table d'hôtes permanente, où chaque produit raconte un terroir, un producteur, une saison.",
      "Notre chef, Isabelle Morin, a travaillé dix ans en salle étoilée avant de choisir de nourrir au quotidien plutôt qu'à l'exception. Sa cuisine porte l'empreinte du Bassin d'Arcachon — iode, herbes des prés salés, canard landais — avec une précision technique que l'on ne s'attendrait pas à trouver dans un magasin de quartier.",
      "Ici, nous ne faisons pas la différence entre un buffet de 20 personnes et une livraison pour deux. Chaque commande reçoit le même soin. Notre laboratoire de 280 m² tourne six jours sur sept, et nos équipes refusent systématiquement de préparer à l'avance ce qui peut être fait le jour même.",
    ],
    highlights: [
      { label: "Ouverture", value: "2013" },
      { label: "Surface", value: "2 400 m²" },
      { label: "Équipe traiteur", value: "9 personnes" },
      { label: "Plats / semaine", value: "350 +" },
    ],
  },

  equipe: {
    intro: "Neuf professionnels qui partagent le même refus du compromis sur la qualité.",
    members: [
      {
        name: "Isabelle Morin",
        role: "Chef traiteur",
        emoji: "👩‍🍳",
        avatarColor: "#0f4c7a",
        quote: "Je choisis mes produits comme si je cuisinais pour ma famille.",
      },
      {
        name: "Florent Lacaze",
        role: "Second de cuisine",
        emoji: "👨‍🍳",
        avatarColor: "#1a3d60",
        quote: "La rigueur, c'est ce qui fait la différence entre bon et très bon.",
      },
      {
        name: "Nathalie Brun",
        role: "Pâtissière-chocolatière",
        emoji: "🍫",
        avatarColor: "#5a2020",
        quote: "Le chocolat ne pardonne pas la précipitation.",
      },
      {
        name: "Damien Souchard",
        role: "Poissonnier traiteur",
        emoji: "🐟",
        avatarColor: "#1a4060",
        quote: "Je n'achète que ce que j'aurais servi à table hier soir.",
      },
      {
        name: "Sophie Arnaud",
        role: "Responsable commandes",
        emoji: "📋",
        avatarColor: "#2a4060",
      },
      {
        name: "Tom Verdier",
        role: "Boucher-charcutier",
        emoji: "🥩",
        avatarColor: "#3d1a0a",
      },
    ],
  },

  savoirFaire: {
    intro: "Une cuisine du Bordelais et des Landes, ancrée dans les saisons et les marées du Bassin.",
    heroEmoji: "🐟",
    heroGradient: "linear-gradient(135deg, #0a1a2d 0%, #0f3d60 100%)",
    specialties: [
      {
        emoji: "🦪",
        title: "Huîtres et plateaux de fruits de mer",
        description: "Huîtres du Bassin d'Arcachon en direct de Gujan-Mestras. Plateau mixte, déclinaisons au champagne ou vinaigrette maison. Réservation 48 h.",
        isSignature: true,
        accentColor: "#0f4c7a",
      },
      {
        emoji: "🦆",
        title: "Canard landais",
        description: "Confit, magret fumé au sarment, foie gras mi-cuit selon la disponibilité. Approvisionnement exclusif chez l'éleveur Denis Bordes à Soustons.",
        accentColor: "#5a2a00",
      },
      {
        emoji: "🍷",
        title: "Accords mets et vins",
        description: "Chaque plateau traiteur est pensé avec une sélection de vins girondins associés. Notre sommelier amateur, Florent, propose une fiche accord avec chaque commande événementielle.",
        accentColor: "#6b0a20",
      },
      {
        emoji: "🍫",
        title: "Chocolats et ganaches artisanales",
        description: "Nathalie travaille le chocolat grand cru (Valrhona, Menakao) pour nos bouchées, tablettes personnalisées et entremets. Aucun édulcorant, aucune lécithine de soja ajoutée.",
        accentColor: "#3d1a0a",
      },
      {
        emoji: "🫙",
        title: "Conserves maison",
        description: "Rillettes, confits et pâtés en bocaux stérilisés à la maison. Idéals pour les paniers cadeaux entreprise ou les commandes emportées pour les vacances.",
        accentColor: "#4a3010",
      },
      {
        emoji: "🥗",
        title: "Cuisine végétale de saison",
        description: "Tarte fine de légumes du marché, salade tiède de lentilles vertes, gaspacho — notre offre végétale représente aujourd'hui 30 % du catalogue et est renouvelée chaque semaine.",
        accentColor: "#1a5020",
      },
    ],
  },

  partenaires: {
    intro: "La Gironde regorge de producteurs d'exception. Nous travaillons avec ceux qui partagent nos exigences.",
    partners: [
      {
        name: "Maison Bordes",
        type: "Élevage canard et oie",
        origin: "Soustons (40)",
        description: "Denis Bordes élève ses canards en plein air dans les Landes depuis 1994. Foie gras, magrets et confits livrés chaque semaine.",
        emoji: "🦆",
        bgColor: "#fff7ed",
      },
      {
        name: "Ostréiculture Belin",
        type: "Huîtres",
        origin: "Gujan-Mestras (33)",
        description: "Trois générations d'ostréiculteurs sur le Bassin. Huîtres fines et spéciales, ramassées la nuit pour la livraison du matin.",
        emoji: "🦪",
        bgColor: "#eff6ff",
      },
      {
        name: "Vignobles Château Meyney",
        type: "Vin rouge",
        origin: "Saint-Estèphe (33)",
        description: "Médoc classé, sélection spéciale pour notre rayon. Accords viandeux et accord plateau de fromages affichés sur chaque étiquette.",
        emoji: "🍷",
        bgColor: "#fdf2f8",
      },
      {
        name: "Boulangerie Péroz",
        type: "Boulangerie artisanale",
        origin: "Bruges (33)",
        description: "Pain au levain naturel, baguettes tradition et brioches du dimanche. Fournisseur exclusif de nos buffets petit-déjeuner.",
        emoji: "🥖",
        bgColor: "#fef9c3",
      },
      {
        name: "Maraîchage Castera",
        type: "Légumes bio",
        origin: "Mérignac (33)",
        description: "Maraîchage en biodynamie sur 8 hectares. Livraison deux fois par semaine : légumes racines en hiver, tomates et courgettes en été.",
        emoji: "🥕",
        bgColor: "#f0fdf4",
      },
      {
        name: "Chocolaterie Auzat",
        type: "Cacao et épices",
        origin: "Bordeaux (33)",
        description: "Importateur direct de fèves de cacao. Nathalie s'y approvisionne en masse pour ses ganaches et couvertures grand cru.",
        emoji: "🍫",
        bgColor: "#fef3e2",
      },
    ],
  },

  engagements: {
    intro: "Moins de jolis mots, plus d'actes mesurables. Voici où nous en sommes.",
    items: [
      {
        icon: "🌊",
        title: "Produits de la mer responsables",
        text: "Nos poissons et coquillages suivent les recommandations MCC (Meilleurs Choix de Consommation). Zéro espèce en surpêche dans notre rayon.",
      },
      {
        icon: "♻️",
        title: "Anti-gaspillage",
        text: "Partenariat avec Too Good To Go depuis 2021. Nos invendus du soir sont proposés à -60 % chaque jour via l'application, l'excédent donné à la Croix-Rouge girondine.",
      },
      {
        icon: "🌿",
        title: "Agriculture de proximité",
        text: "74 % de nos légumes viennent d'un rayon de 150 km. Objectif 80 % pour fin 2026, avec 3 nouveaux maraîchers en cours de référencement.",
      },
      {
        icon: "🧴",
        title: "Produits de nettoyage écoresponsables",
        text: "Détergents certifiés Ecolabel dans tout le laboratoire depuis 2023. Réduit de 35 % notre charge en COV (composés organiques volatils).",
      },
      {
        icon: "🚲",
        title: "Livraisons bas carbone",
        text: "Livraisons dans un rayon de 5 km assurées par vélo-cargo électrique depuis 2024. 62 % de nos livraisons en zone urbaine sont désormais décarbonées.",
      },
      {
        icon: "🧑‍🤝‍🧑",
        title: "Emploi local",
        text: "Recrutement prioritaire dans un rayon de 15 km. 8 de nos 9 employés vivent à moins de 20 minutes du magasin. Deux alternants chaque année.",
      },
    ],
  },

  galerie: {
    intro: "Du laboratoire à votre table — les images de notre quotidien.",
    images: [
      { emoji: "🦪", caption: "Plateau huîtres Bassin d'Arcachon — livraison du matin", color: "#0f3d60", aspect: "wide" },
      { emoji: "👩‍🍳", caption: "Isabelle dressant un plateau de charcuterie landaise", color: "#1a2d4a", aspect: "tall" },
      { emoji: "🍫", caption: "Ganaches Grand Cru de Nathalie, pralinés noisette", color: "#3d1a0a", aspect: "square" },
      { emoji: "🥖", caption: "Livraison boulangerie Péroz, 6 h du matin", color: "#6b4a10", aspect: "square" },
      { emoji: "🦆", caption: "Confits de canard Maison Bordes — cuisson longue", color: "#5a2a00", aspect: "square" },
      { emoji: "🍷", caption: "Sélection Meyney pour un dîner de gala — 80 couverts", color: "#6b0a20", aspect: "wide" },
      { emoji: "🥗", caption: "Assortiment végétal de saison, semaine 38", color: "#1a5020", aspect: "square" },
      { emoji: "🎉", caption: "Buffet cocktail dînatoire — anniversaire d'entreprise", color: "#0f2a4a", aspect: "tall" },
    ],
  },
};

// ── Export ────────────────────────────────────────────────────────────────────

export const EDITORIAL_CONTENT: Record<string, StoreEditorialContent> = {
  "toulouse-capitole": TOULOUSE,
  "bordeaux-lac": BORDEAUX,
};

export function getEditorialContent(storeId: string): StoreEditorialContent {
  return EDITORIAL_CONTENT[storeId] ?? TOULOUSE;
}
