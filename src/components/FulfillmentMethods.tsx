import { FulfillmentMethod } from '../data/stores';

interface FulfillmentMethodsProps {
  methods: FulfillmentMethod[];
}

const METHOD_CONFIG: Record<FulfillmentMethod, { label: string; sub: string; iconPath: string }> = {
  pickup: {
    label: 'Retrait en magasin',
    sub: 'Commandez en ligne, retirez en caisse',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  drive: {
    label: 'Drive',
    sub: 'Récupérez votre commande sans descendre de voiture',
    iconPath: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  },
  delivery: {
    label: 'Livraison à domicile',
    sub: 'Recevez votre commande directement chez vous',
    iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 4l6-6',
  },
};

export default function FulfillmentMethods({ methods }: FulfillmentMethodsProps) {
  return (
    <section
      style={{ background: 'var(--itm-gray-bg)', borderColor: 'var(--itm-border)' }}
      className="mt-5 py-8 border-t"
      aria-labelledby="fulfillment-title">
      <div className="max-w-screen-xl mx-auto px-3">
        <h2 id="fulfillment-title" className="typo-section-title mb-4" style={{ color: 'var(--itm-text)' }}>Modes de retrait disponibles</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          {methods.map((method) => {
            const cfg = METHOD_CONFIG[method];
            return (
              <a key={method} href="#"
                className="flex items-center gap-4 px-4 py-3.5 bg-white border rounded-lg hover:shadow-sm transition-shadow flex-1 group"
                style={{ borderColor: 'var(--itm-border)' }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#fef2f2' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--itm-red)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cfg.iconPath} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="method-label">{cfg.label}</p>
                  <p className="method-sub truncate">{cfg.sub}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
