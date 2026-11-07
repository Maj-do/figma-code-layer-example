import { TimeSlot, DeliveryZone } from '../types/cart';

// Minimum lead time in hours
export const LEAD_TIME_HOURS = 48;

// Public holidays (unavailable for pickup/delivery)
export const PUBLIC_HOLIDAYS = ['2026-11-01', '2026-11-11', '2026-12-25'];

// Days closed: 0=Sunday
export const CLOSED_DAYS = [0]; // Sunday closed

// Slots available per day for pickup/drive
const PICKUP_SLOTS: Omit<TimeSlot, 'full'>[] = [
  { id: 'am1', startTime: '09:00', endTime: '10:00' },
  { id: 'am2', startTime: '10:00', endTime: '11:00' },
  { id: 'am3', startTime: '11:00', endTime: '12:00' },
  { id: 'pm1', startTime: '14:00', endTime: '15:00' },
  { id: 'pm2', startTime: '15:00', endTime: '16:00' },
  { id: 'pm3', startTime: '16:00', endTime: '17:00' },
  { id: 'pm4', startTime: '17:00', endTime: '18:00' },
];

const DELIVERY_SLOTS: Omit<TimeSlot, 'full'>[] = [
  { id: 'd-am', startTime: '09:00', endTime: '12:00' },
  { id: 'd-pm1', startTime: '14:00', endTime: '17:00' },
  { id: 'd-pm2', startTime: '17:00', endTime: '20:00' },
];

// Deterministically mark some slots full based on date hash
function isSlotFull(dateStr: string, slotId: string): boolean {
  const hash = dateStr.split('-').reduce((acc, p) => acc + parseInt(p, 10), 0);
  const fullPattern: Record<string, boolean> = {
    'am1': hash % 5 === 0,
    'am2': hash % 7 === 1,
    'pm2': hash % 4 === 0,
    'd-am': hash % 6 === 2,
  };
  return fullPattern[slotId] ?? false;
}

export function getSlotsForDate(dateStr: string, method: 'pickup' | 'drive' | 'delivery'): TimeSlot[] {
  const base = method === 'delivery' ? DELIVERY_SLOTS : PICKUP_SLOTS;
  return base.map((s) => ({ ...s, full: isSlotFull(dateStr, s.id) }));
}

export function isDateAvailable(dateStr: string): boolean {
  const date = new Date(dateStr + 'T12:00:00');
  const day = date.getDay();
  if (CLOSED_DAYS.includes(day)) return false;
  if (PUBLIC_HOLIDAYS.includes(dateStr)) return false;
  // Enforce lead time
  const now = new Date();
  const cutoff = new Date(now.getTime() + LEAD_TIME_HOURS * 60 * 60 * 1000);
  return date >= cutoff;
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'zone-1', label: 'Zone 1 — Centre-ville (< 5 km)', fee: 4.90, minOrder: 30, estimatedTime: '2h' },
  { id: 'zone-2', label: 'Zone 2 — Proche banlieue (5–15 km)', fee: 7.90, minOrder: 50, estimatedTime: '3h' },
  { id: 'zone-3', label: 'Zone 3 — Périphérie (15–25 km)', fee: 12.90, minOrder: 80, estimatedTime: '4h' },
];

export const MINIMUM_ORDER = 25; // euros
export const VAT_RATE = 0.055; // 5.5% food VAT
