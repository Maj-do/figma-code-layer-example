import { useState } from 'react';
import { XCircle, CalendarDays, AlertCircle } from 'lucide-react';
import { NavigateFn } from '../types/navigation';

interface OrderTrackingPageProps {
  orderRef: string;
  navigate: NavigateFn;
}

type OrderStatus = 'received' | 'confirmed' | 'preparing' | 'ready' | 'collected';

const STATUSES: { id: OrderStatus; label: string; description: string }[] = [
  { id: 'received', label: 'Reçue', description: 'Votre commande a bien été enregistrée.' },
  { id: 'confirmed', label: 'Confirmée', description: 'Votre commande a été confirmée par notre équipe traiteur.' },
  { id: 'preparing', label: 'En préparation', description: 'Nos cuisiniers préparent votre commande avec soin.' },
  { id: 'ready', label: 'Prête', description: 'Votre commande est prête et attend votre passage.' },
  { id: 'collected', label: 'Retirée / Livrée', description: 'Commande récupérée. Bonne dégustation !' },
];

// Mock: orders are in "confirmed" status by default
const MOCK_STATUS: OrderStatus = 'confirmed';

// Cancellation allowed until D-2 before pickup
const CANCEL_DEADLINE_DAYS = 2;

export default function OrderTrackingPage({ orderRef, navigate }: OrderTrackingPageProps) {
  const [currentStatus] = useState<OrderStatus>(MOCK_STATUS);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelled, setCancelled] = useState(false);

  const currentIndex = STATUSES.findIndex((s) => s.id === currentStatus);

  // Mock pickup date (today + 3 days)
  const pickupDate = new Date();
  pickupDate.setDate(pickupDate.getDate() + 3);
  const pickupLabel = pickupDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  const cancelDeadline = new Date(pickupDate);
  cancelDeadline.setDate(cancelDeadline.getDate() - CANCEL_DEADLINE_DAYS);
  const cancelAllowed = new Date() < cancelDeadline && !['ready', 'collected'].includes(currentStatus);

  const handleCancel = () => {
    setCancelled(true);
    setShowCancelModal(false);
  };

  if (cancelled) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--itm-gray-bg)' }}>
        <div className="max-w-screen-md mx-auto px-3 py-16 text-center">
          <XCircle size={56} strokeWidth={1.25} className="mx-auto mb-4 text-gray-300" />
          <h1 className="typo-page-title mb-2" style={{ color: 'var(--itm-text)' }}>Commande annulée</h1>
          <p className="typo-meta mb-6">La commande <strong>{orderRef}</strong> a bien été annulée. Le remboursement sera effectué sous 3–5 jours ouvrés.</p>
          <button onClick={() => navigate({ type: 'home' })} className="typo-btn px-6 py-3 rounded-lg text-white" style={{ background: 'var(--itm-red)' }}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--itm-gray-bg)' }}>
      <div className="max-w-screen-md mx-auto px-3 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 typo-meta mb-5">
          <button onClick={() => navigate({ type: 'home' })} className="hover:underline">Accueil</button>
          <span>›</span>
          <span style={{ color: 'var(--itm-text)' }} className="font-medium">Suivi de commande</span>
        </nav>

        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="typo-page-title" style={{ color: 'var(--itm-text)' }}>Suivi de commande</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="typo-meta">Réf. :</p>
              <code className="typo-meta font-bold tracking-wider" style={{ fontFamily: 'monospace', color: 'var(--itm-text)' }}>{orderRef}</code>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate({ type: 'confirmation', orderRef })}
              className="typo-caption font-semibold px-3 py-1.5 rounded-lg border hover:bg-gray-50"
              style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-text)' }}>
              Facture
            </button>
            {cancelAllowed && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="typo-caption font-semibold px-3 py-1.5 rounded-lg border hover:bg-red-50 transition-colors"
                style={{ borderColor: '#fca5a5', color: '#dc2626' }}>
                Annuler
              </button>
            )}
          </div>
        </div>

        {/* Pickup info */}
        <div className="bg-white rounded-xl p-4 mb-6 flex items-center gap-4" style={{ border: '1px solid var(--itm-border)' }}>
          <CalendarDays size={24} strokeWidth={1.5} className="flex-shrink-0 text-gray-400" />
          <div className="typo-meta">
            <p className="font-semibold" style={{ color: 'var(--itm-text)' }}>Retrait prévu : {pickupLabel}</p>
            <p>Créneau : 14h00–15h00 · Retrait en magasin</p>
          </div>
        </div>

        {/* Cancellation policy */}
        <div className="rounded-xl p-4 mb-6 typo-caption"
          style={{ background: cancelAllowed ? '#fff8f0' : '#fafafa', border: `1px solid ${cancelAllowed ? '#fde68a' : 'var(--itm-border)'}` }}>
          {cancelAllowed ? (
            <>
              <p className="font-semibold mb-1" style={{ color: '#92400e' }}>⏰ Modification / annulation possible jusqu'au {cancelDeadline.toLocaleDateString('fr-FR')} (J–{CANCEL_DEADLINE_DAYS})</p>
              <p style={{ color: '#92400e' }}>Après cette date, votre commande ne pourra plus être modifiée ni annulée.</p>
            </>
          ) : (
            <p className="text-gray-500 flex items-center gap-1.5"><AlertCircle size={14} strokeWidth={1.75} className="flex-shrink-0" />Le délai de modification/annulation est dépassé pour cette commande.</p>
          )}
        </div>

        {/* Status timeline */}
        <div className="bg-white rounded-xl p-6" style={{ border: '1px solid var(--itm-border)' }}>
          <h2 className="font-black text-base mb-6" style={{ color: 'var(--itm-text)' }}>Statut de votre commande</h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5" style={{ background: 'var(--itm-border)' }} />

            <div className="space-y-6">
              {STATUSES.map((status, i) => {
                const done = i < currentIndex;
                const active = i === currentIndex;
                const future = i > currentIndex;
                return (
                  <div key={status.id} className="flex items-start gap-4 relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg z-10 transition-all"
                      style={{
                        background: done ? '#16a34a' : active ? 'var(--itm-red)' : 'var(--itm-gray-bg)',
                        border: `2px solid ${done ? '#16a34a' : active ? 'var(--itm-red)' : 'var(--itm-border)'}`,
                      }}>
                      {done ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={`text-sm font-bold tabular-nums ${future ? 'opacity-40' : 'text-white'}`}>{i + 1}</span>
                      )}
                    </div>
                    <div className="pt-1.5">
                      <p
                        className="font-bold text-sm"
                        style={{ color: active ? 'var(--itm-red)' : done ? '#16a34a' : 'var(--itm-text-light)' }}>
                        {status.label}
                        {active && <span className="ml-2 text-xs font-normal rounded-full px-2 py-0.5 text-white" style={{ background: 'var(--itm-red)' }}>En cours</span>}
                      </p>
                      <p className="typo-caption mt-0.5" style={{ color: future ? '#ccc' : 'var(--itm-text-light)' }}>
                        {status.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modify link */}
        {cancelAllowed && (
          <p className="text-center mt-6 typo-meta">
            Besoin de modifier votre créneau ?{' '}
            <button className="underline font-semibold" style={{ color: 'var(--itm-red)' }}>
              Contacter le magasin
            </button>
          </p>
        )}
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-black text-lg mb-2" style={{ color: 'var(--itm-text)' }}>Annuler la commande ?</h3>
            <p className="typo-meta mb-4">Le remboursement sera effectué sous 3–5 jours ouvrés sur votre moyen de paiement.</p>
            <label className="block typo-meta font-semibold mb-1">Motif (optionnel)</label>
            <textarea
              placeholder="Ex. : changement de programme..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none mb-4"
              style={{ borderColor: '#c8c8c8' }}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 typo-btn py-2.5 rounded-lg border hover:bg-gray-50" style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-text)' }}>
                Conserver
              </button>
              <button onClick={handleCancel} className="flex-1 typo-btn py-2.5 rounded-lg text-white" style={{ background: '#dc2626' }}>
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
