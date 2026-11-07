export interface Category {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  unit: string;
  badge?: string;
  badgeColor?: string;
  categoryId: string;
  bgColor: string;
}

export const categories: Category[] = [
  { id: 'entrees', label: 'Entrées & Apéritifs', emoji: '🥗', color: '#fef3c7' },
  { id: 'plats', label: 'Plats cuisinés', emoji: '🍖', color: '#fee2e2' },
  { id: 'desserts', label: 'Desserts & Pâtisseries', emoji: '🍰', color: '#fce7f3' },
  { id: 'fromages', label: 'Fromages', emoji: '🧀', color: '#fef9c3' },
  { id: 'plateaux', label: 'Plateaux repas', emoji: '🍱', color: '#dcfce7' },
  { id: 'boissons', label: 'Boissons & Vins', emoji: '🍷', color: '#ede9fe' },
];

export const products: Product[] = [
  {
    id: 'plateau-charcuterie',
    name: 'Plateau charcuterie maison',
    description: 'Jambon, saucisson, rillettes – pour 8 personnes',
    price: '24,90',
    unit: 'le plateau',
    badge: 'Nouveauté',
    badgeColor: '#16a34a',
    categoryId: 'entrees',
    bgColor: '#fef3c7',
  },
  {
    id: 'boeuf-bourguignon',
    name: 'Bœuf bourguignon',
    description: 'Mijotée 4h, sauce au vin rouge, carottes fondantes',
    price: '18,50',
    unit: 'la barquette 800g',
    badge: 'Best-seller',
    badgeColor: '#e2001a',
    categoryId: 'plats',
    bgColor: '#fee2e2',
  },
  {
    id: 'buche-praline',
    name: 'Bûche praliné noisette',
    description: 'Ganache praliné, biscuit dacquoise, 8 parts',
    price: '34,00',
    unit: 'la bûche',
    badge: 'Fêtes',
    badgeColor: '#7c3aed',
    categoryId: 'desserts',
    bgColor: '#fce7f3',
  },
  {
    id: 'plateau-fromages',
    name: 'Plateau fromages affinés',
    description: 'Comté 18 mois, Camembert AOP, Roquefort, Cheddar',
    price: '29,90',
    unit: 'pour 6 personnes',
    categoryId: 'fromages',
    bgColor: '#fef9c3',
  },
  {
    id: 'plateau-sushi',
    name: 'Plateau sushi & makis',
    description: '48 pièces – saumon, thon, crevette',
    price: '42,00',
    unit: 'le plateau',
    badge: 'Nouveauté',
    badgeColor: '#16a34a',
    categoryId: 'plateaux',
    bgColor: '#dcfce7',
  },
  {
    id: 'vol-au-vent',
    name: 'Vol-au-vent traiteur',
    description: 'Ris de veau, champignons, sauce suprême',
    price: '21,50',
    unit: 'la barquette x6',
    categoryId: 'entrees',
    bgColor: '#fef3c7',
  },
  {
    id: 'magret-canard',
    name: 'Magret de canard rôti',
    description: 'Sauce aux cerises, purée de butternut',
    price: '27,90',
    unit: 'la barquette 600g',
    badge: 'Premium',
    badgeColor: '#b45309',
    categoryId: 'plats',
    bgColor: '#fee2e2',
  },
  {
    id: 'chablis',
    name: 'Chablis Premier Cru',
    description: 'Domaine Brocard – blanc sec, accords fruits de mer',
    price: '19,90',
    unit: 'la bouteille 75cl',
    categoryId: 'boissons',
    bgColor: '#ede9fe',
  },
];
