import { useState } from 'react';
import { stores, Store } from '../data/stores';

interface DemoPanelProps {
  activeStore: Store;
  onStoreChange: (store: Store) => void;
  viewport: string;
  onViewportChange: (v: string) => void;
}

export const VIEWPORTS = [
  { id: 'mobile', label: 'Mobile', width: '375px' },
  { id: 'tablet', label: 'Tablette', width: '768px' },
  { id: 'desktop', label: 'Desktop', width: '100%' },
];

export default function DemoPanel({ activeStore, onStoreChange, viewport, onViewportChange }: DemoPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {open && (
        <div className="mb-2 bg-white rounded-2xl shadow-2xl border p-4 w-64"
          style={{ borderColor: 'var(--itm-border)' }}>
          <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">PDV actif</p>
          <div className="space-y-2 mb-4">
            {stores.map((store) => (
              <button key={store.id}
                onClick={() => onStoreChange(store)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                  activeStore.id === store.id
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}>
                <p className="font-semibold leading-tight">{store.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{store.address}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {store.methods.map((m) => (
                    <span key={m} className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {m === 'pickup' ? 'Retrait' : m === 'drive' ? 'Drive' : 'Livraison'}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Viewport</p>
          <div className="flex gap-1">
            {VIEWPORTS.map((vp) => (
              <button key={vp.id}
                onClick={() => onViewportChange(vp.id)}
                className={`flex-1 text-center text-xs py-1.5 rounded-lg border font-medium transition-all ${
                  viewport === vp.id
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {vp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-white text-xs font-semibold px-3 py-2.5 rounded-full shadow-lg transition-all hover:opacity-90 active:scale-95"
        style={{ background: 'var(--itm-red)' }}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Démo
      </button>
    </div>
  );
}

