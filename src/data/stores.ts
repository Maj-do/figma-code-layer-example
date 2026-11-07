export type FulfillmentMethod = 'pickup' | 'drive' | 'delivery';

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: { days: string; time: string }[];
  methods: FulfillmentMethod[];
}

export const stores: Store[] = [
  {
    id: 'toulouse-capitole',
    name: 'Intermarché Toulouse Capitole',
    address: '12 Rue du Capitole, 31000 Toulouse',
    city: 'Toulouse',
    phone: '05 61 23 45 67',
    hours: [
      { days: 'Lundi – Samedi', time: '08h00 – 20h00' },
      { days: 'Dimanche', time: '09h00 – 13h00' },
    ],
    methods: ['pickup', 'drive', 'delivery'],
  },
  {
    id: 'bordeaux-lac',
    name: 'Intermarché Bordeaux Lac',
    address: '42 Avenue du Lac, 33300 Bordeaux',
    city: 'Bordeaux',
    phone: '05 56 78 90 12',
    hours: [
      { days: 'Lundi – Samedi', time: '08h30 – 20h30' },
      { days: 'Dimanche', time: 'Fermé' },
    ],
    methods: ['pickup', 'drive'],
  },
];
