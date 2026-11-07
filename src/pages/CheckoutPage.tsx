import { useState, useMemo, useEffect } from 'react';
import { UserRound, Sparkles, CalendarDays, Check, CreditCard, Lock } from 'lucide-react';
import { CartItem, CheckoutState, TimeSlot, DeliveryZone, ContactInfo } from '../types/cart';
import { FulfillmentMethod, Store } from '../data/stores';
import { NavigateFn } from '../types/navigation';
import { User } from '../types/auth';
import { products } from '../data/catalogue';
import {
  getSlotsForDate,
  isDateAvailable,
  DELIVERY_ZONES,
  MINIMUM_ORDER,
  VAT_RATE,
  LEAD_TIME_HOURS,
  PUBLIC_HOLIDAYS,
} from '../data/slots';

// ─── Shared helpers ────────────────────────────────────────────────────────────

function cartTotal(cartItems: CartItem[]): number {
  return cartItems.reduce((sum, item) => {
    const p = products.find((x) => x.id === item.productId);
    return sum + (p?.price ?? 0) * item.qty;
  }, 0);
}

function generateOrderRef(): string {
  return 'ITM-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// ─── Persistent slot summary bar (steps 2→3→4) ────────────────────────────────

function SlotSummaryBar({
  state,
  onChangeSlot,
}: {
  state: CheckoutState;
  onChangeSlot: () => void;
}) {
  if (!state.date || !state.slot) return null;

  const methodLabel: Record<FulfillmentMethod, string> = {
    pickup: 'Retrait en magasin',
    drive: 'Drive',
    delivery: 'Livraison',
  };

  const dateLabel = new Date(state.date + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <div className="sticky top-[var(--header-offset)] z-20 border-b" style={{ background: '#fff8f0', borderColor: '#fde68a' }}>
      <div className="max-w-screen-xl mx-auto px-3 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 typo-meta">
          <CalendarDays size={16} strokeWidth={1.75} className="flex-shrink-0 text-amber-600" />
          <span>
            <span className="font-semibold" style={{ color: 'var(--itm-text)' }}>
              {state.method ? methodLabel[state.method] : ''} —{' '}
              {dateLabel} · {state.slot.startTime}–{state.slot.endTime}
            </span>
            {state.method === 'delivery' && state.deliveryZone && (
              <span className="ml-2 text-gray-500">({state.deliveryZone.label.split(' — ')[0]})</span>
            )}
          </span>
        </div>
        <button
          onClick={onChangeSlot}
          className="typo-caption font-semibold flex-shrink-0 hover:underline"
          style={{ color: 'var(--itm-red)' }}>
          Modifier
        </button>
      </div>
    </div>
  );
}

// ─── Step progress indicator ───────────────────────────────────────────────────

const STEPS = ['Livraison', 'Date & heure', 'Vos coordonnées', 'Paiement'];

function StepBar({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex items-center justify-center gap-0 py-5">
      {STEPS.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3 | 4;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all"
                style={{
                  background: done ? '#16a34a' : active ? 'var(--itm-red)' : 'var(--itm-border)',
                  color: done || active ? '#fff' : 'var(--itm-text-light)',
                }}>
                {done ? <Check size={14} strokeWidth={2.5} /> : step}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${active ? 'text-gray-900' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-12 sm:w-20 h-0.5 mx-1 mb-5" style={{ background: done ? '#16a34a' : 'var(--itm-border)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Fulfillment method ────────────────────────────────────────────────

const METHOD_INFO: Record<FulfillmentMethod, { label: string; sub: string; iconPath: string }> = {
  pickup: {
    label: 'Retrait en magasin',
    sub: 'Récupérez votre commande à la caisse traiteur',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  drive: {
    label: 'Drive',
    sub: 'Restez dans votre voiture, nous vous apportons la commande',
    iconPath: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  },
  delivery: {
    label: 'Livraison à domicile',
    sub: 'Recevez votre commande directement chez vous',
    iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 4l6-6',
  },
};

type FieldErrors = Record<string, string>;

function StepMethod({
  store,
  state,
  onNext,
}: {
  store: Store;
  state: CheckoutState;
  onNext: (update: Partial<CheckoutState>) => void;
}) {
  const [method, setMethod] = useState<FulfillmentMethod | undefined>(
    state.method ?? (store.methods.length === 1 ? store.methods[0] : undefined)
  );
  const [zone, setZone] = useState<DeliveryZone | undefined>(state.deliveryZone);
  const [address, setAddress] = useState(state.deliveryAddress ?? { street: '', complement: '', postalCode: '', city: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateAddress = () => {
    const e: FieldErrors = {};
    if (!address.street.trim()) e.street = 'L\'adresse est requise.';
    if (!/^\d{5}$/.test(address.postalCode)) e.postalCode = 'Code postal invalide (5 chiffres).';
    if (!address.city.trim()) e.city = 'La ville est requise.';
    if (!zone) e.zone = 'Veuillez sélectionner une zone de livraison.';
    return e;
  };

  const blur = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const handleNext = () => {
    if (!method) return;
    if (method === 'delivery') {
      const e = validateAddress();
      setTouched({ street: true, postalCode: true, city: true, zone: true });
      if (Object.keys(e).length > 0) { setErrors(e); return; }
    }
    onNext({ method, deliveryAddress: method === 'delivery' ? address : undefined, deliveryZone: method === 'delivery' ? zone : undefined });
  };

  const showField = (field: string) => touched[field] && errors[field];

  return (
    <div>
      <h2 className="typo-page-title mb-1" style={{ color: 'var(--itm-text)' }}>Mode de retrait</h2>
      <p className="typo-meta mb-6">Choisissez comment récupérer votre commande.</p>

      <div className="space-y-3 mb-6">
        {store.methods.map((m) => {
          const info = METHOD_INFO[m];
          const selected = method === m;
          return (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm"
              style={{ borderColor: selected ? 'var(--itm-red)' : 'var(--itm-border)', background: selected ? '#fff5f5' : '#fff' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: selected ? '#fef2f2' : 'var(--itm-gray-bg)' }}>
                <svg className="w-6 h-6" style={{ color: selected ? 'var(--itm-red)' : 'var(--itm-text-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={info.iconPath} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base" style={{ color: selected ? 'var(--itm-red)' : 'var(--itm-text)' }}>{info.label}</p>
                <p className="typo-meta">{info.sub}</p>
                {m === 'delivery' && (
                  <p className="typo-caption mt-0.5" style={{ color: 'var(--itm-red)' }}>Frais selon votre zone — à partir de {DELIVERY_ZONES[0].fee.toFixed(2)} €</p>
                )}
              </div>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: selected ? 'var(--itm-red)' : '#ccc' }}>
                {selected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--itm-red)' }} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Drive info box */}
      {method === 'drive' && (
        <div className="mb-6 rounded-xl p-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <p className="font-semibold text-sm text-green-800 mb-1">Point de retrait Drive</p>
          <p className="typo-meta text-green-700">Voie Drive — {store.address}</p>
          <p className="typo-caption text-green-600 mt-1">Restez dans votre véhicule, notre équipe vous apporte la commande.</p>
        </div>
      )}

      {/* Delivery address form */}
      {method === 'delivery' && (
        <div className="mb-6 space-y-4 rounded-xl p-5" style={{ border: '1px solid var(--itm-border)', background: '#fff' }}>
          <p className="font-bold text-base" style={{ color: 'var(--itm-text)' }}>Adresse de livraison</p>

          <div>
            <label className="block typo-meta font-semibold mb-1">Rue et numéro <span style={{ color: 'var(--itm-red)' }}>*</span></label>
            <input
              type="text"
              placeholder="Ex. : 12 rue de la Paix"
              value={address.street}
              onChange={(e) => { setAddress((a) => ({ ...a, street: e.target.value })); if (errors.street) setErrors((x) => ({ ...x, street: '' })); }}
              onBlur={() => blur('street')}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{ borderColor: showField('street') ? '#e2001a' : '#c8c8c8' }}
            />
            {showField('street') && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.street}</p>}
          </div>

          <div>
            <label className="block typo-meta font-semibold mb-1">Complément (optionnel)</label>
            <input
              type="text"
              placeholder="Ex. : Bât. B, Apt. 3"
              value={address.complement}
              onChange={(e) => setAddress((a) => ({ ...a, complement: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              style={{ borderColor: '#c8c8c8' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block typo-meta font-semibold mb-1">Code postal <span style={{ color: 'var(--itm-red)' }}>*</span></label>
              <input
                type="text"
                placeholder="Ex. : 31000"
                maxLength={5}
                value={address.postalCode}
                onChange={(e) => { setAddress((a) => ({ ...a, postalCode: e.target.value })); if (errors.postalCode) setErrors((x) => ({ ...x, postalCode: '' })); }}
                onBlur={() => blur('postalCode')}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                style={{ borderColor: showField('postalCode') ? '#e2001a' : '#c8c8c8' }}
              />
              {showField('postalCode') && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.postalCode}</p>}
            </div>
            <div>
              <label className="block typo-meta font-semibold mb-1">Ville <span style={{ color: 'var(--itm-red)' }}>*</span></label>
              <input
                type="text"
                placeholder="Ex. : Toulouse"
                value={address.city}
                onChange={(e) => { setAddress((a) => ({ ...a, city: e.target.value })); if (errors.city) setErrors((x) => ({ ...x, city: '' })); }}
                onBlur={() => blur('city')}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                style={{ borderColor: showField('city') ? '#e2001a' : '#c8c8c8' }}
              />
              {showField('city') && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.city}</p>}
            </div>
          </div>

          <div>
            <label className="block typo-meta font-semibold mb-2">Zone de livraison <span style={{ color: 'var(--itm-red)' }}>*</span></label>
            <div className="space-y-2">
              {DELIVERY_ZONES.map((z) => (
                <label key={z.id} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border transition-colors hover:bg-gray-50"
                  style={{ borderColor: zone?.id === z.id ? 'var(--itm-red)' : 'var(--itm-border)', background: zone?.id === z.id ? '#fff5f5' : '' }}>
                  <input type="radio" name="zone" className="mt-0.5 accent-red-600"
                    checked={zone?.id === z.id}
                    onChange={() => { setZone(z); if (errors.zone) setErrors((x) => ({ ...x, zone: '' })); }} />
                  <div>
                    <p className="typo-meta font-semibold" style={{ color: 'var(--itm-text)' }}>{z.label}</p>
                    <p className="typo-caption">Frais : {z.fee.toFixed(2)} € — Commande min. {z.minOrder} € — Délai ~{z.estimatedTime}</p>
                  </div>
                </label>
              ))}
            </div>
            {touched.zone && errors.zone && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.zone}</p>}
          </div>
        </div>
      )}

      <button
        disabled={!method}
        onClick={handleNext}
        className="w-full typo-btn py-3 rounded-lg text-white transition-opacity"
        style={{ background: method ? 'var(--itm-red)' : '#ccc', cursor: method ? 'pointer' : 'not-allowed' }}>
        Continuer →
      </button>
    </div>
  );
}

// ─── Step 2: Date & time slot ──────────────────────────────────────────────────

function StepSlot({
  state,
  onNext,
  onBack,
}: {
  state: CheckoutState;
  onNext: (update: Partial<CheckoutState>) => void;
  onBack: () => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | undefined>(state.date);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>(state.slot);
  const [submitError, setSubmitError] = useState('');

  const slots = useMemo(() => {
    if (!selectedDate || !state.method) return [];
    return getSlotsForDate(selectedDate, state.method);
  }, [selectedDate, state.method]);

  // Calendar grid
  const calDays = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const last = new Date(viewYear, viewMonth + 1, 0);
    const startDow = (first.getDay() + 6) % 7; // Mon=0
    const days: (string | null)[] = Array(startDow).fill(null);
    for (let d = 1; d <= last.getDate(); d++) {
      const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push(iso);
    }
    return days;
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const handleNext = () => {
    if (!selectedDate) { setSubmitError('Veuillez choisir une date.'); return; }
    if (!selectedSlot) { setSubmitError('Veuillez choisir un créneau.'); return; }
    setSubmitError('');
    onNext({ date: selectedDate, slot: selectedSlot });
  };

  const selectDate = (iso: string) => {
    setSelectedDate(iso);
    setSelectedSlot(undefined);
    setSubmitError('');
  };

  return (
    <div>
      <h2 className="typo-page-title mb-1" style={{ color: 'var(--itm-text)' }}>Date & créneau</h2>
      <p className="typo-meta mb-2">
        Délai minimum de {LEAD_TIME_HOURS}h. Les créneaux complets ne sont pas sélectionnables.
      </p>
      {PUBLIC_HOLIDAYS.length > 0 && (
        <p className="typo-caption mb-5" style={{ color: 'var(--itm-text-light)' }}>
          Jours fériés indisponibles : {PUBLIC_HOLIDAYS.map((d) => new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })).join(', ')}.
        </p>
      )}

      {/* Calendar */}
      <div className="bg-white rounded-xl p-4 mb-5" style={{ border: '1px solid var(--itm-border)' }}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <p className="font-bold text-base capitalize" style={{ color: 'var(--itm-text)' }}>{monthLabel}</p>
          <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((d) => (
            <div key={d} className="text-center typo-caption font-semibold py-1 text-gray-400">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calDays.map((iso, i) => {
            if (!iso) return <div key={i} />;
            const available = isDateAvailable(iso);
            const isHoliday = PUBLIC_HOLIDAYS.includes(iso);
            const isSelected = selectedDate === iso;
            return (
              <button
                key={iso}
                disabled={!available}
                onClick={() => available && selectDate(iso)}
                className="aspect-square rounded-lg text-sm font-medium transition-all flex items-center justify-center relative"
                style={{
                  background: isSelected ? 'var(--itm-red)' : available ? '#fff' : 'transparent',
                  color: isSelected ? '#fff' : available ? 'var(--itm-text)' : '#ccc',
                  border: isSelected ? 'none' : available ? '1px solid var(--itm-border)' : 'none',
                  cursor: available ? 'pointer' : 'default',
                }}>
                {iso.split('-')[2].replace(/^0/, '')}
                {isHoliday && !available && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots */}
      {selectedDate && (
        <div className="mb-5">
          <p className="font-bold text-base mb-3" style={{ color: 'var(--itm-text)' }}>
            Créneaux disponibles — {new Date(selectedDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {slots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              return (
                <button
                  key={slot.id}
                  disabled={slot.full}
                  onClick={() => { if (!slot.full) setSelectedSlot(slot); }}
                  className="py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all relative"
                  style={{
                    borderColor: isSelected ? 'var(--itm-red)' : slot.full ? 'var(--itm-border)' : '#c8c8c8',
                    background: isSelected ? '#fff5f5' : slot.full ? '#fafafa' : '#fff',
                    color: isSelected ? 'var(--itm-red)' : slot.full ? '#aaa' : 'var(--itm-text)',
                    cursor: slot.full ? 'not-allowed' : 'pointer',
                  }}>
                  {slot.startTime} – {slot.endTime}
                  {slot.full && (
                    <span className="block typo-caption mt-0.5" style={{ color: 'var(--itm-text-light)' }}>Complet</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {submitError && (
        <p className="typo-meta mb-3 font-medium" style={{ color: 'var(--itm-red)' }}>{submitError}</p>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="typo-btn px-5 py-3 rounded-lg border font-semibold transition-colors hover:bg-gray-50" style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-text)' }}>
          ← Retour
        </button>
        <button
          onClick={handleNext}
          className="flex-1 typo-btn py-3 rounded-lg text-white"
          style={{ background: 'var(--itm-red)' }}>
          Continuer →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Contact & identification ─────────────────────────────────────────

type ContactField = keyof ContactInfo;

// Validate contact fields — defined outside any component so the reference is stable
function validateContactForm(f: ContactInfo): Partial<Record<ContactField, string>> {
  const e: Partial<Record<ContactField, string>> = {};
  if (!f.firstName.trim()) e.firstName = 'Le prénom est requis.';
  if (!f.lastName.trim()) e.lastName = 'Le nom est requis.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Adresse e-mail invalide.';
  if (!/^(\+33|0)[1-9](\d{8})$/.test(f.phone.replace(/\s/g, '')))
    e.phone = 'Numéro invalide — ex. : 06 12 34 56 78.';
  if (f.isProfessional && f.siret && !/^\d{14}$/.test(f.siret.replace(/\s/g, '')))
    e.siret = 'Le SIRET doit comporter 14 chiffres.';
  return e;
}

type AuthMode = 'gate' | 'login' | 'signup';

function StepContact({
  state,
  onNext,
  onBack,
  currentUser,
  onInFlowLogin,
  onInFlowSignup,
}: {
  state: CheckoutState;
  onNext: (update: Partial<CheckoutState>) => void;
  onBack: () => void;
  currentUser: User | null;
  onInFlowLogin: (email: string, password: string) => User | null;
  onInFlowSignup?: (email: string, firstName: string, lastName: string) => User;
}) {
  // If already logged in via App-level auth, start in logged-in mode
  const [authMode, setAuthMode] = useState<AuthMode>('gate');
  const [loggedIn, setLoggedIn] = useState(() => !!currentUser);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [signupTouched, setSignupTouched] = useState<Record<string, boolean>>({});

  // Contact form (populated after login/signup, or pre-filled from currentUser)
  const [form, setForm] = useState<ContactInfo>({
    firstName: state.contact?.firstName ?? currentUser?.firstName ?? '',
    lastName: state.contact?.lastName ?? currentUser?.lastName ?? '',
    email: state.contact?.email ?? currentUser?.email ?? '',
    phone: state.contact?.phone ?? currentUser?.phone ?? '',
    isProfessional: state.contact?.isProfessional ?? false,
    siret: state.contact?.siret ?? '',
    poNumber: state.contact?.poNumber ?? '',
    notes: state.contact?.notes ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});

  // ── Login handler ────────────────────────────────────────────────────────────
  const handleLogin = () => {
    const user = onInFlowLogin(loginEmail.trim(), loginPassword);
    if (!user) {
      setLoginError('E-mail ou mot de passe incorrect.');
      return;
    }
    setLoginError('');
    setForm((f) => ({
      ...f,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    }));
    setLoggedIn(true);
    setAuthMode('gate');
  };

  // ── Signup validation ────────────────────────────────────────────────────────
  const validateSignup = (email: string, pw: string, confirm: string) => {
    const e: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Adresse e-mail invalide.';
    if (pw.length < 8) e.password = 'Au moins 8 caractères requis.';
    if (pw !== confirm) e.confirm = 'Les mots de passe ne correspondent pas.';
    return e;
  };

  const handleSignup = () => {
    const e = validateSignup(signupEmail, signupPassword, signupConfirm);
    setSignupTouched({ email: true, password: true, confirm: true });
    setSignupErrors(e);
    if (Object.keys(e).length > 0) return;
    // Propagate new account to App-level so Header shows the user
    onInFlowSignup?.(signupEmail.trim().toLowerCase(), '', '');
    setForm((f) => ({ ...f, email: signupEmail.trim().toLowerCase() }));
    setLoggedIn(true);
    setAuthMode('gate');
  };

  // ── Contact form helpers ─────────────────────────────────────────────────────
  const blurField = (field: ContactField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validateContactForm(form));
  };

  const setField = (field: ContactField, value: string | boolean) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) setErrors(validateContactForm(next));
  };

  const handleNext = () => {
    const allTouched: Partial<Record<ContactField, boolean>> = {
      firstName: true, lastName: true, email: true, phone: true, siret: true,
    };
    setTouched(allTouched);
    const e = validateContactForm(form);
    setErrors(e);
    if (Object.keys(e).length === 0) onNext({ contact: form });
  };

  // ── Field border color helper ────────────────────────────────────────────────
  const fieldBorder = (field: ContactField) => {
    if (touched[field] && errors[field]) return '#e2001a';
    if (touched[field] && !errors[field] && String(form[field]).length > 0) return '#16a34a';
    return '#c8c8c8';
  };

  const signupBorder = (key: string) => {
    if (signupTouched[key] && signupErrors[key]) return '#e2001a';
    if (signupTouched[key] && !signupErrors[key]) return '#16a34a';
    return '#c8c8c8';
  };

  // ── Auth gate (not yet logged in) ────────────────────────────────────────────
  if (!loggedIn && authMode === 'gate') {
    return (
      <div>
        <h2 className="typo-page-title mb-1" style={{ color: 'var(--itm-text)' }}>Identification</h2>
        <p className="typo-meta mb-6" style={{ color: 'var(--itm-text-light)' }}>Un compte est requis pour passer commande. Connectez-vous ou créez votre compte.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setAuthMode('login')}
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 hover:shadow-sm transition-all text-center"
            style={{ borderColor: 'var(--itm-red)', background: '#fff5f5' }}>
            <UserRound size={28} strokeWidth={1.5} style={{ color: 'var(--itm-red)' }} />
            <p className="font-black text-base" style={{ color: 'var(--itm-red)' }}>Se connecter</p>
            <p className="typo-caption">J'ai déjà un compte</p>
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 hover:shadow-sm transition-all text-center"
            style={{ borderColor: 'var(--itm-border)', background: '#fff' }}>
            <Sparkles size={28} strokeWidth={1.5} style={{ color: 'var(--itm-text)' }} />
            <p className="font-black text-base" style={{ color: 'var(--itm-text)' }}>Créer un compte</p>
            <p className="typo-caption">Première commande</p>
          </button>
        </div>
        <div className="mt-6">
          <button onClick={onBack} className="typo-btn px-5 py-3 rounded-lg border font-semibold hover:bg-gray-50" style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-text)' }}>
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  // ── Login form ───────────────────────────────────────────────────────────────
  if (!loggedIn && authMode === 'login') {
    return (
      <div>
        <button onClick={() => setAuthMode('gate')} className="flex items-center gap-1 typo-meta font-semibold mb-5 hover:underline" style={{ color: 'var(--itm-red)' }}>
          ← Retour
        </button>
        <h2 className="typo-page-title mb-1" style={{ color: 'var(--itm-text)' }}>Connexion</h2>
        <p className="typo-meta mb-6">
          Compte de démo : <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">test@example.com</code> / <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Test1234</code>
        </p>
        <div className="space-y-4">
          <div>
            <label className="block typo-meta font-semibold mb-1">Adresse e-mail <span style={{ color: 'var(--itm-red)' }}>*</span></label>
            <input
              type="email"
              placeholder="Ex. : test@example.com"
              value={loginEmail}
              onChange={(e) => { setLoginEmail(e.target.value); setLoginError(''); }}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              style={{ borderColor: loginError ? '#e2001a' : '#c8c8c8' }}
            />
          </div>
          <div>
            <label className="block typo-meta font-semibold mb-1">Mot de passe <span style={{ color: 'var(--itm-red)' }}>*</span></label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={loginPassword}
              onChange={(e) => { setLoginPassword(e.target.value); setLoginError(''); }}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              style={{ borderColor: loginError ? '#e2001a' : '#c8c8c8' }}
            />
          </div>
          {loginError && <p className="typo-meta font-medium" style={{ color: 'var(--itm-red)' }}>{loginError}</p>}
          <button
            onClick={handleLogin}
            className="w-full typo-btn py-3 rounded-lg text-white"
            style={{ background: 'var(--itm-red)' }}>
            Se connecter
          </button>
          <p className="typo-caption text-center">
            Pas encore de compte ?{' '}
            <button onClick={() => setAuthMode('signup')} className="underline font-semibold" style={{ color: 'var(--itm-red)' }}>
              Créer un compte
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ── Signup form ──────────────────────────────────────────────────────────────
  if (!loggedIn && authMode === 'signup') {
    return (
      <div>
        <button onClick={() => setAuthMode('gate')} className="flex items-center gap-1 typo-meta font-semibold mb-5 hover:underline" style={{ color: 'var(--itm-red)' }}>
          ← Retour
        </button>
        <h2 className="typo-page-title mb-1" style={{ color: 'var(--itm-text)' }}>Créer un compte</h2>
        <p className="typo-meta mb-6">Renseignez votre e-mail et choisissez un mot de passe.</p>
        <div className="space-y-4">
          <div>
            <label className="block typo-meta font-semibold mb-1">Adresse e-mail <span style={{ color: 'var(--itm-red)' }}>*</span></label>
            <div className="relative">
              <input
                type="email"
                placeholder="Ex. : marie.dupont@email.fr"
                value={signupEmail}
                onChange={(e) => { setSignupEmail(e.target.value); if (signupTouched.email) setSignupErrors(validateSignup(e.target.value, signupPassword, signupConfirm)); }}
                onBlur={() => setSignupTouched((t) => ({ ...t, email: true }))}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none pr-8"
                style={{ borderColor: signupBorder('email') }}
              />
              {signupTouched.email && !signupErrors.email && signupEmail && <Check size={14} strokeWidth={2.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600" />}
            </div>
            {signupTouched.email && signupErrors.email && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{signupErrors.email}</p>}
          </div>
          <div>
            <label className="block typo-meta font-semibold mb-1">Mot de passe <span style={{ color: 'var(--itm-red)' }}>*</span></label>
            <div className="relative">
              <input
                type="password"
                placeholder="Au moins 8 caractères"
                value={signupPassword}
                onChange={(e) => { setSignupPassword(e.target.value); if (signupTouched.password) setSignupErrors(validateSignup(signupEmail, e.target.value, signupConfirm)); }}
                onBlur={() => setSignupTouched((t) => ({ ...t, password: true }))}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none pr-8"
                style={{ borderColor: signupBorder('password') }}
              />
              {signupTouched.password && !signupErrors.password && signupPassword && <Check size={14} strokeWidth={2.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600" />}
            </div>
            {signupTouched.password && signupErrors.password && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{signupErrors.password}</p>}
          </div>
          <div>
            <label className="block typo-meta font-semibold mb-1">Confirmer le mot de passe <span style={{ color: 'var(--itm-red)' }}>*</span></label>
            <div className="relative">
              <input
                type="password"
                placeholder="Répétez votre mot de passe"
                value={signupConfirm}
                onChange={(e) => { setSignupConfirm(e.target.value); if (signupTouched.confirm) setSignupErrors(validateSignup(signupEmail, signupPassword, e.target.value)); }}
                onBlur={() => setSignupTouched((t) => ({ ...t, confirm: true }))}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none pr-8"
                style={{ borderColor: signupBorder('confirm') }}
              />
              {signupTouched.confirm && !signupErrors.confirm && signupConfirm && <Check size={14} strokeWidth={2.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600" />}
            </div>
            {signupTouched.confirm && signupErrors.confirm && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{signupErrors.confirm}</p>}
          </div>
          <button
            onClick={handleSignup}
            className="w-full typo-btn py-3 rounded-lg text-white"
            style={{ background: 'var(--itm-red)' }}>
            Créer mon compte
          </button>
          <p className="typo-caption text-center">
            Déjà un compte ?{' '}
            <button onClick={() => setAuthMode('login')} className="underline font-semibold" style={{ color: 'var(--itm-red)' }}>
              Se connecter
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ── Contact form (shown once logged in) ──────────────────────────────────────
  return (
    <div>
      {/* Logged-in indicator */}
      <div className="flex items-center justify-between mb-5 p-3 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <div className="flex items-center gap-2">
          <Check size={16} strokeWidth={2.5} className="text-green-600" />
          <p className="typo-meta font-semibold text-green-800">Connecté en tant que {form.email}</p>
        </div>
        <button
          onClick={() => { setLoggedIn(false); setAuthMode('gate'); }}
          className="typo-caption font-semibold hover:underline text-green-700">
          Changer
        </button>
      </div>

      <h2 className="typo-page-title mb-1" style={{ color: 'var(--itm-text)' }}>Vos coordonnées</h2>
      <p className="typo-meta mb-5">Vérifiez et complétez vos informations avant de passer au paiement.</p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Prénom */}
          <div>
            <label className="block typo-meta font-semibold mb-1">Prénom <span style={{ color: 'var(--itm-red)' }}>*</span></label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex. : Marie"
                value={form.firstName}
                onChange={(e) => setField('firstName', e.target.value)}
                onBlur={() => blurField('firstName')}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none pr-8"
                style={{ borderColor: fieldBorder('firstName') }}
              />
              {touched.firstName && !errors.firstName && form.firstName && <Check size={14} strokeWidth={2.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600" />}
            </div>
            {touched.firstName && errors.firstName && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.firstName}</p>}
          </div>
          {/* Nom */}
          <div>
            <label className="block typo-meta font-semibold mb-1">Nom <span style={{ color: 'var(--itm-red)' }}>*</span></label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex. : Dupont"
                value={form.lastName}
                onChange={(e) => setField('lastName', e.target.value)}
                onBlur={() => blurField('lastName')}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none pr-8"
                style={{ borderColor: fieldBorder('lastName') }}
              />
              {touched.lastName && !errors.lastName && form.lastName && <Check size={14} strokeWidth={2.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600" />}
            </div>
            {touched.lastName && errors.lastName && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.lastName}</p>}
          </div>
        </div>

        {/* E-mail */}
        <div>
          <label className="block typo-meta font-semibold mb-1">Adresse e-mail <span style={{ color: 'var(--itm-red)' }}>*</span></label>
          <div className="relative">
            <input
              type="email"
              placeholder="Ex. : marie.dupont@email.fr"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              onBlur={() => blurField('email')}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none pr-8"
              style={{ borderColor: fieldBorder('email') }}
            />
            {touched.email && !errors.email && form.email && <Check size={14} strokeWidth={2.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600" />}
          </div>
          {touched.email && errors.email && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.email}</p>}
        </div>

        {/* Téléphone */}
        <div>
          <label className="block typo-meta font-semibold mb-1">Téléphone <span style={{ color: 'var(--itm-red)' }}>*</span></label>
          <div className="relative">
            <input
              type="tel"
              placeholder="Ex. : 06 12 34 56 78"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              onBlur={() => blurField('phone')}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none pr-8"
              style={{ borderColor: fieldBorder('phone') }}
            />
            {touched.phone && !errors.phone && form.phone && <Check size={14} strokeWidth={2.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600" />}
          </div>
          {touched.phone && errors.phone && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.phone}</p>}
        </div>

        {/* Professional toggle */}
        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border transition-colors hover:bg-gray-50"
          style={{ borderColor: form.isProfessional ? 'var(--itm-red)' : 'var(--itm-border)' }}>
          <input
            type="checkbox"
            checked={form.isProfessional}
            onChange={(e) => setField('isProfessional', e.target.checked)}
            className="w-4 h-4 accent-red-600 flex-shrink-0"
          />
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--itm-text)' }}>Commande professionnelle</p>
            <p className="typo-caption">Renseignez votre SIRET pour obtenir une facture professionnelle.</p>
          </div>
        </label>

        {form.isProfessional && (
          <div className="space-y-4 pl-4 border-l-2" style={{ borderColor: 'var(--itm-red)' }}>
            {/* SIRET */}
            <div>
              <label className="block typo-meta font-semibold mb-1">SIRET</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex. : 123 456 789 00012"
                  value={form.siret}
                  onChange={(e) => setField('siret', e.target.value)}
                  onBlur={() => blurField('siret')}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none pr-8"
                  style={{ borderColor: fieldBorder('siret') }}
                />
                {touched.siret && !errors.siret && form.siret && <Check size={14} strokeWidth={2.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600" />}
              </div>
              {touched.siret && errors.siret && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.siret}</p>}
            </div>
            {/* PO number */}
            <div>
              <label className="block typo-meta font-semibold mb-1">N° de bon de commande (optionnel)</label>
              <input
                type="text"
                placeholder="Ex. : BC-2026-0042"
                value={form.poNumber}
                onChange={(e) => setField('poNumber', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                style={{ borderColor: '#c8c8c8' }}
              />
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block typo-meta font-semibold mb-1">Allergies ou instructions particulières (optionnel)</label>
          <textarea
            placeholder="Ex. : allergie aux noix, livrer chez le gardien, plats sans porc..."
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none"
            style={{ borderColor: '#c8c8c8' }}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="typo-btn px-5 py-3 rounded-lg border font-semibold hover:bg-gray-50" style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-text)' }}>
          ← Retour
        </button>
        <button onClick={handleNext} className="flex-1 typo-btn py-3 rounded-lg text-white" style={{ background: 'var(--itm-red)' }}>
          Continuer →
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Payment ──────────────────────────────────────────────────────────

// Card validation — defined at module level so the reference is always stable
function validateCardFields(c: { number: string; expiry: string; cvv: string; name: string }): Record<string, string> {
  const e: Record<string, string> = {};
  const num = c.number.replace(/\s/g, '');
  if (!/^\d{16}$/.test(num)) e.number = 'Numéro invalide — 16 chiffres requis (ex. : 4242 4242 4242 4242).';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(c.expiry)) {
    e.expiry = 'Format MM/AA requis (ex. : 12/28).';
  } else {
    const [m, y] = c.expiry.split('/').map(Number);
    const exp = new Date(2000 + y, m, 1); // first day of the month AFTER expiry
    if (exp <= new Date()) e.expiry = 'Cette carte est expirée.';
  }
  if (!/^\d{3,4}$/.test(c.cvv)) e.cvv = 'CVV invalide — 3 ou 4 chiffres (ex. : 123).';
  if (!c.name.trim()) e.name = 'Le nom sur la carte est requis.';
  return e;
}

function formatCardNumber(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
}

function StepPayment({
  cartItems,
  state,
  onConfirm,
  onBack,
}: {
  cartItems: CartItem[];
  state: CheckoutState;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [cgv, setCgv] = useState(false);
  const [cgvError, setCgvError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const cardValues = { number: cardNumber, expiry: cardExpiry, cvv: cardCvv, name: cardName };

  const blurField = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validateCardFields(cardValues));
  };

  const revalidateIfTouched = (field: string, next: typeof cardValues) => {
    if (touched[field]) setErrors(validateCardFields(next));
  };

  const subtotal = cartTotal(cartItems);
  const deliveryFee = state.method === 'delivery' ? (state.deliveryZone?.fee ?? 0) : 0;
  const vat = subtotal * VAT_RATE;
  const total = subtotal + deliveryFee;

  const enriched = cartItems
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((e) => e.product);

  const handleSubmit = async () => {
    // Touch all fields so errors show
    setTouched({ number: true, expiry: true, cvv: true, name: true });
    const e = validateCardFields(cardValues);
    setErrors(e);
    if (!cgv) setCgvError(true);
    // Block if either invalid
    if (Object.keys(e).length > 0 || !cgv) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    onConfirm();
  };

  // Per-field border helper
  const border = (field: string) => {
    if (touched[field] && errors[field]) return '#e2001a';
    const val = cardValues[field as keyof typeof cardValues];
    if (touched[field] && !errors[field] && val.length > 0) return '#16a34a';
    return '#c8c8c8';
  };
  const isValid = (field: string) => {
    const val = cardValues[field as keyof typeof cardValues];
    return touched[field] && !errors[field] && val.length > 0;
  };

  const methodLabel: Record<FulfillmentMethod, string> = {
    pickup: 'Retrait magasin', drive: 'Drive', delivery: 'Livraison',
  };

  // Account info from contact step
  const contact = state.contact;

  return (
    <div>
      <h2 className="typo-page-title mb-1" style={{ color: 'var(--itm-text)' }}>Paiement</h2>
      <p className="typo-meta mb-6">Paiement en ligne sécurisé — carte bancaire uniquement.</p>

      {/* Account confirmation banner */}
      {contact?.email && (
        <div className="flex items-center gap-2 mb-5 p-3 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <Check size={14} strokeWidth={2.5} className="text-green-600 flex-shrink-0" />
          <p className="typo-meta font-semibold text-green-800">
            Commande pour {contact.firstName} {contact.lastName} — {contact.email}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Card form ── */}
        <div>
          <div className="bg-white rounded-xl p-5 mb-4" style={{ border: '1px solid var(--itm-border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} strokeWidth={1.75} style={{ color: 'var(--itm-text-light)' }} />
              <p className="font-bold text-base" style={{ color: 'var(--itm-text)' }}>Carte bancaire</p>
              <div className="flex gap-1 ml-auto">
                {['VISA', 'MC', 'CB'].map((b) => (
                  <span key={b} className="text-xs font-bold px-1.5 py-0.5 rounded border text-gray-500"
                    style={{ borderColor: '#ccc' }}>{b}</span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Cardholder name */}
              <div>
                <label className="block typo-meta font-semibold mb-1">
                  Nom sur la carte <span style={{ color: 'var(--itm-red)' }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex. : MARIE DUPONT"
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value);
                      revalidateIfTouched('name', { ...cardValues, name: e.target.value });
                    }}
                    onBlur={() => blurField('name')}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none pr-8"
                    style={{ borderColor: border('name') }}
                  />
                  {isValid('name') && <Check size={14} strokeWidth={2.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600" />}
                </div>
                {touched.name && errors.name && (
                  <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.name}</p>
                )}
              </div>

              {/* Card number */}
              <div>
                <label className="block typo-meta font-semibold mb-1">
                  Numéro de carte <span style={{ color: 'var(--itm-red)' }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Ex. : 4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => {
                      const next = formatCardNumber(e.target.value);
                      setCardNumber(next);
                      revalidateIfTouched('number', { ...cardValues, number: next });
                    }}
                    onBlur={() => blurField('number')}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none pr-8 tracking-wider font-mono"
                    style={{ borderColor: border('number') }}
                  />
                  {isValid('number') && <Check size={14} strokeWidth={2.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600" />}
                </div>
                {touched.number && errors.number && (
                  <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.number}</p>
                )}
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block typo-meta font-semibold mb-1">
                    Date d'expiration <span style={{ color: 'var(--itm-red)' }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => {
                        const next = formatExpiry(e.target.value);
                        setCardExpiry(next);
                        revalidateIfTouched('expiry', { ...cardValues, expiry: next });
                      }}
                      onBlur={() => blurField('expiry')}
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none pr-8 font-mono"
                      style={{ borderColor: border('expiry') }}
                    />
                    {isValid('expiry') && <Check size={14} strokeWidth={2.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600" />}
                  </div>
                  {touched.expiry && errors.expiry && (
                    <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.expiry}</p>
                  )}
                </div>
                <div>
                  <label className="block typo-meta font-semibold mb-1">
                    CVV <span style={{ color: 'var(--itm-red)' }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Ex. : 123"
                      value={cardCvv}
                      onChange={(e) => {
                        const next = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setCardCvv(next);
                        revalidateIfTouched('cvv', { ...cardValues, cvv: next });
                      }}
                      onBlur={() => blurField('cvv')}
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none pr-8 font-mono"
                      style={{ borderColor: border('cvv') }}
                    />
                    {isValid('cvv') && <Check size={14} strokeWidth={2.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600" />}
                  </div>
                  {touched.cvv && errors.cvv && (
                    <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg typo-caption"
              style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
              <Lock size={12} strokeWidth={2} className="inline mr-1.5 align-text-bottom" />Paiement sécurisé — vos données ne sont pas stockées sur nos serveurs.
            </div>
          </div>

          {/* CGV */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={cgv}
              onChange={(e) => { setCgv(e.target.checked); if (e.target.checked) setCgvError(false); }}
              className="mt-0.5 w-4 h-4 accent-red-600 flex-shrink-0"
            />
            <p className="typo-meta">
              J'accepte les{' '}
              <a href="#" className="underline" style={{ color: 'var(--itm-red)' }}>conditions générales de vente</a>{' '}
              et la politique de confidentialité.
            </p>
          </label>
          {cgvError && (
            <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>
              Vous devez accepter les CGV pour continuer.
            </p>
          )}
        </div>

        {/* ── Order recap ── */}
        <div>
          <div className="bg-white rounded-xl p-5" style={{ border: '1px solid var(--itm-border)' }}>
            <p className="font-black text-base mb-4" style={{ color: 'var(--itm-text)' }}>Récapitulatif de commande</p>

            {/* Date/slot summary — always shown if set */}
            {state.date && state.slot && (
              <div className="mb-3 p-3 rounded-lg typo-meta"
                style={{ background: '#fff8f0', border: '1px solid #fde68a' }}>
                <p className="font-semibold" style={{ color: 'var(--itm-text)' }}>
                  {state.method ? methodLabel[state.method] : ''} —{' '}
                  {new Date(state.date + 'T12:00:00').toLocaleDateString('fr-FR', {
                    weekday: 'short', day: 'numeric', month: 'short',
                  })}
                </p>
                <p style={{ color: 'var(--itm-text-light)' }}>
                  Créneau : {state.slot.startTime} – {state.slot.endTime}
                </p>
                {state.method === 'delivery' && state.deliveryAddress && (
                  <p style={{ color: 'var(--itm-text-light)' }}>
                    {state.deliveryAddress.street}, {state.deliveryAddress.postalCode} {state.deliveryAddress.city}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2 mb-3">
              {enriched.map(({ item, product }) => (
                <div key={`${item.productId}-${item.variant ?? ''}`} className="flex justify-between typo-meta">
                  <span className="truncate mr-2">
                    {product!.name}{item.variant ? ` (${item.variant})` : ''} ×{item.qty}
                  </span>
                  <span className="flex-shrink-0 font-semibold">
                    {(product!.price * item.qty).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-1" style={{ borderColor: 'var(--itm-border)' }}>
              <div className="flex justify-between typo-meta">
                <span>Sous-total HT</span>
                <span>{(subtotal / (1 + VAT_RATE)).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between typo-meta">
                <span>TVA (5,5 %)</span>
                <span>{vat.toFixed(2)} €</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between typo-meta">
                  <span>Frais de livraison</span>
                  <span>{deliveryFee.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between font-black text-base pt-2 border-t"
                style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-text)' }}>
                <span>Total TTC</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="typo-btn px-5 py-3 rounded-lg border font-semibold hover:bg-gray-50"
          style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-text)' }}>
          ← Retour
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 typo-btn py-3 rounded-lg text-white transition-opacity"
          style={{
            background: submitting ? '#aaa' : 'var(--itm-red)',
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}>
          {submitting ? 'Traitement en cours…' : `Confirmer et payer ${total.toFixed(2)} €`}
        </button>
      </div>
    </div>
  );
}

// ─── CheckoutPage shell ────────────────────────────────────────────────────────

interface CheckoutPageProps {
  cartItems: CartItem[];
  navigate: NavigateFn;
  store: Store;
  currentUser: User | null;
  onInFlowLogin: (email: string, password: string) => User | null;
  onInFlowSignup?: (email: string, firstName: string, lastName: string) => User;
  onOrderConfirmed: (orderRef: string) => void;
}

export default function CheckoutPage({ cartItems, navigate, store, currentUser, onInFlowLogin, onInFlowSignup, onOrderConfirmed }: CheckoutPageProps) {
  const [state, setState] = useState<CheckoutState>({ step: 1 });

  const update = (patch: Partial<CheckoutState>) => {
    setState((prev) => ({
      ...prev,
      ...patch,
      step: (Math.min(prev.step + 1, 4)) as 1 | 2 | 3 | 4,
    }));
  };

  const back = () => setState((prev) => ({ ...prev, step: (Math.max(prev.step - 1, 1)) as 1 | 2 | 3 | 4 }));

  const goToSlotStep = () => setState((prev) => ({ ...prev, step: 2 }));

  const confirm = () => {
    const orderRef = generateOrderRef();
    onOrderConfirmed(orderRef);
  };

  // Hard gate: if step 4 is reached without a linked account email, drop back to step 3
  useEffect(() => {
    if (state.step === 4 && !state.contact?.email) {
      setState((prev) => ({ ...prev, step: 3 }));
    }
  }, [state.step, state.contact?.email]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--itm-gray-bg)' }}>
      <div className="max-w-screen-xl mx-auto px-3 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 typo-meta mb-2">
          <button onClick={() => navigate({ type: 'home' })} className="hover:underline">Accueil</button>
          <span>›</span>
          <button onClick={() => navigate({ type: 'cart' })} className="hover:underline">Panier</button>
          <span>›</span>
          <span style={{ color: 'var(--itm-text)' }} className="font-medium">Commande</span>
        </nav>
      </div>

      {/* Persistent slot bar (steps 2-4) */}
      {state.step >= 2 && <SlotSummaryBar state={state} onChangeSlot={goToSlotStep} />}

      <div className="max-w-screen-xl mx-auto px-3 pb-10">
        <StepBar current={state.step} />

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm" style={{ border: '1px solid var(--itm-border)' }}>
            {state.step === 1 && (
              <StepMethod store={store} state={state} onNext={update} />
            )}
            {state.step === 2 && (
              <StepSlot state={state} onNext={update} onBack={back} />
            )}
            {state.step === 3 && (
              <StepContact state={state} onNext={update} onBack={back} currentUser={currentUser} onInFlowLogin={onInFlowLogin} onInFlowSignup={onInFlowSignup} />
            )}
            {state.step === 4 && (
              <StepPayment cartItems={cartItems} state={state} onConfirm={confirm} onBack={back} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
