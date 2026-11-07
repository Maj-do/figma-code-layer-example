import { CalendarDays, FileText, Package } from 'lucide-react';
import { NavigateFn } from '../types/navigation';

interface ConfirmationPageProps {
  orderRef: string;
  navigate: NavigateFn;
}

function downloadInvoice(orderRef: string) {
  // Mock PDF generation: create a minimal text blob
  const lines = [
    'FACTURE — INTERMARCHÉ TRAITEUR',
    '================================',
    `N° de commande : ${orderRef}`,
    `Date : ${new Date().toLocaleDateString('fr-FR')}`,
    '',
    'Merci pour votre commande.',
    'Ce document est une simulation de facture.',
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `facture-${orderRef}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function addToCalendar(orderRef: string) {
  const now = new Date();
  const start = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Retrait commande Intermarché — ' + orderRef)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent('Commande traiteur Intermarché\nRéf. : ' + orderRef)}`;
  window.open(url, '_blank');
}

export default function ConfirmationPage({ orderRef, navigate }: ConfirmationPageProps) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--itm-gray-bg)' }}>
      <div className="max-w-screen-lg mx-auto px-3 py-10">
        {/* Success hero */}
        <div className="bg-white rounded-2xl p-8 text-center mb-6 shadow-sm" style={{ border: '1px solid var(--itm-border)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#f0fdf4' }}>
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="typo-page-title mb-2" style={{ color: 'var(--itm-text)' }}>Commande confirmée !</h1>
          <p className="typo-meta mb-1">Votre commande a bien été enregistrée et le paiement accepté.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-2" style={{ background: 'var(--itm-gray-bg)', border: '1px solid var(--itm-border)' }}>
            <span className="typo-meta text-gray-500">N° de commande</span>
            <span className="font-black text-base tracking-wider" style={{ color: 'var(--itm-text)', fontFamily: 'monospace' }}>{orderRef}</span>
          </div>
          <p className="typo-caption mt-3" style={{ color: 'var(--itm-text-light)' }}>
            Un e-mail de confirmation vous a été envoyé (simulation).
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => addToCalendar(orderRef)}
            className="bg-white rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow text-left"
            style={{ border: '1px solid var(--itm-border)' }}>
            <CalendarDays size={22} strokeWidth={1.75} className="flex-shrink-0 text-gray-400" />
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--itm-text)' }}>Ajouter au calendrier</p>
              <p className="typo-caption">Google Agenda</p>
            </div>
          </button>

          <button
            onClick={() => downloadInvoice(orderRef)}
            className="bg-white rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow text-left"
            style={{ border: '1px solid var(--itm-border)' }}>
            <FileText size={22} strokeWidth={1.75} className="flex-shrink-0 text-gray-400" />
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--itm-text)' }}>Télécharger la facture</p>
              <p className="typo-caption">Format texte (démo)</p>
            </div>
          </button>

          <button
            onClick={() => navigate({ type: 'tracking', orderRef })}
            className="rounded-xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity text-left text-white"
            style={{ background: 'var(--itm-red)' }}>
            <Package size={22} strokeWidth={1.75} className="flex-shrink-0 text-white" />
            <div>
              <p className="font-bold text-sm">Suivre ma commande</p>
              <p className="typo-caption text-white/80">Statut en temps réel</p>
            </div>
          </button>
        </div>

        {/* Full recap */}
        <div className="bg-white rounded-xl p-6 mb-6" style={{ border: '1px solid var(--itm-border)' }}>
          <h2 className="font-black text-base mb-4" style={{ color: 'var(--itm-text)' }}>Récapitulatif</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 typo-meta">
            <div>
              <p className="font-semibold text-gray-500 uppercase tracking-wider typo-caption mb-2">Commande</p>
              <p style={{ color: 'var(--itm-text)' }}>Réf. <strong>{orderRef}</strong></p>
              <p>Passée le {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 uppercase tracking-wider typo-caption mb-2">Retrait estimé</p>
              <p style={{ color: 'var(--itm-text)' }}>Dans les 48–72h</p>
              <p>Selon le créneau sélectionné</p>
            </div>
          </div>
        </div>

        {/* Return to shop */}
        <div className="text-center">
          <button
            onClick={() => navigate({ type: 'home' })}
            className="typo-btn px-6 py-3 rounded-lg border font-semibold hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-text)' }}>
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
