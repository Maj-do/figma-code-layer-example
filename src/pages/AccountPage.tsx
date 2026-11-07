import { useState } from 'react';
import { ShoppingCart, Package, UserRound, MapPin, Check, AlertCircle, type LucideProps } from 'lucide-react';
import { NavigateFn, AccountTab } from '../types/navigation';
import { User } from '../types/auth';

interface AccountPageProps {
  user: User;
  navigate: NavigateFn;
  tab?: AccountTab;
  onLogout: () => void;
  addToCart: (productId: string, variant?: string, qty?: number) => void;
}

// ── Mock order history ────────────────────────────────────────────────────────

interface MockOrderItem {
  name: string;
  productId: string;
  qty: number;
  price: number;
}

interface MockOrder {
  ref: string;
  date: string;
  method: string;
  status: 'collected' | 'ready' | 'confirmed';
  total: number;
  items: MockOrderItem[];
  address?: string;
}

const MOCK_ORDERS: MockOrder[] = [
  {
    ref: 'ITM-2026-04812',
    date: '2026-09-18',
    method: 'Retrait magasin',
    status: 'collected',
    total: 87.40,
    items: [
      { name: 'Verrines saumon fumé (×8)', productId: 'verrines-saumon', qty: 2, price: 18.90 },
      { name: 'Plateau charcuterie tradition', productId: 'plateau-charcuterie', qty: 1, price: 34.90 },
      { name: 'Formule Noël Duo', productId: 'formule-noel-duo', qty: 1, price: 49.60 },
    ],
  },
  {
    ref: 'ITM-2026-03291',
    date: '2026-08-02',
    method: 'Livraison à domicile',
    status: 'collected',
    total: 124.80,
    address: '12 rue des Lilas, 31000 Toulouse',
    items: [
      { name: 'Cocktail dînatoire prestige (×20)', productId: 'cocktail-dinatoire', qty: 1, price: 89.00 },
      { name: 'Formule Famille (×6)', productId: 'formule-famille', qty: 1, price: 64.80 },
    ],
  },
];

const STATUS_LABELS: Record<MockOrder['status'], { label: string; color: string; bg: string }> = {
  collected: { label: 'Récupérée', color: '#166534', bg: '#f0fdf4' },
  ready: { label: 'Prête', color: '#1d4ed8', bg: '#eff6ff' },
  confirmed: { label: 'Confirmée', color: '#92400e', bg: '#fffbeb' },
};

// ── Personal info form ────────────────────────────────────────────────────────

function InfoTab({ user }: { user: User }) {
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block typo-meta font-semibold mb-1">Prénom</label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
            style={{ borderColor: '#c8c8c8' }}
          />
        </div>
        <div>
          <label className="block typo-meta font-semibold mb-1">Nom</label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
            style={{ borderColor: '#c8c8c8' }}
          />
        </div>
      </div>
      <div>
        <label className="block typo-meta font-semibold mb-1">Adresse e-mail</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
          style={{ borderColor: '#c8c8c8' }}
        />
      </div>
      <div>
        <label className="block typo-meta font-semibold mb-1">Téléphone</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
          style={{ borderColor: '#c8c8c8' }}
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="typo-btn px-6 py-2.5 rounded-lg text-white font-bold"
          style={{ background: 'var(--itm-red)' }}>
          Enregistrer les modifications
        </button>
        {saved && (
          <span className="typo-meta text-green-700 font-semibold flex items-center gap-1">
            <Check size={14} strokeWidth={2.5} className="flex-shrink-0" /> Modifications enregistrées
          </span>
        )}
      </div>

      <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--itm-border)' }}>
        <p className="typo-meta font-semibold mb-1" style={{ color: 'var(--itm-text)' }}>Mot de passe</p>
        <p className="typo-caption mb-3" style={{ color: 'var(--itm-text-light)' }}>
          Pour des raisons de sécurité, la modification du mot de passe se fait par e-mail.
        </p>
        <button
          type="button"
          className="typo-meta font-semibold hover:underline"
          style={{ color: 'var(--itm-red)' }}>
          Envoyer un lien de réinitialisation
        </button>
      </div>
    </form>
  );
}

// ── Addresses tab ─────────────────────────────────────────────────────────────

interface SavedAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

function AddressesTab() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    { id: '1', label: 'Domicile', street: '12 rue des Lilas', city: 'Toulouse', postalCode: '31000', isDefault: true },
  ]);
  const [adding, setAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: '', street: '', city: '', postalCode: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.postalCode) return;
    setAddresses((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        label: newAddr.label || 'Adresse',
        street: newAddr.street,
        city: newAddr.city,
        postalCode: newAddr.postalCode,
        isDefault: prev.length === 0,
      },
    ]);
    setNewAddr({ label: '', street: '', city: '', postalCode: '' });
    setAdding(false);
  };

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const remove = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-lg space-y-3">
      {addresses.length === 0 && (
        <p className="typo-meta" style={{ color: 'var(--itm-text-light)' }}>Aucune adresse enregistrée.</p>
      )}
      {addresses.map((addr) => (
        <div key={addr.id} className="bg-white rounded-xl p-4" style={{ border: `1px solid ${addr.isDefault ? 'var(--itm-red)' : 'var(--itm-border)'}` }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="typo-meta font-bold" style={{ color: 'var(--itm-text)' }}>{addr.label}</p>
                {addr.isDefault && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--itm-red)' }}>
                    Par défaut
                  </span>
                )}
              </div>
              <p className="typo-meta" style={{ color: 'var(--itm-text-light)' }}>{addr.street}</p>
              <p className="typo-meta" style={{ color: 'var(--itm-text-light)' }}>{addr.postalCode} {addr.city}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {!addr.isDefault && (
                <button
                  onClick={() => setDefault(addr.id)}
                  className="typo-caption font-semibold hover:underline"
                  style={{ color: 'var(--itm-red)' }}>
                  Définir par défaut
                </button>
              )}
              <button
                onClick={() => remove(addr.id)}
                className="typo-caption font-semibold hover:underline text-red-500">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ))}

      {adding ? (
        <form onSubmit={handleAdd} className="bg-white rounded-xl p-4 space-y-3" style={{ border: '2px dashed var(--itm-border)' }}>
          <p className="typo-meta font-bold mb-2" style={{ color: 'var(--itm-text)' }}>Nouvelle adresse</p>
          <div>
            <label className="block typo-caption font-semibold mb-1">Libellé (ex. : Domicile)</label>
            <input type="text" value={newAddr.label} onChange={(e) => setNewAddr((a) => ({ ...a, label: e.target.value }))}
              placeholder="Domicile, Bureau…" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: '#c8c8c8' }} />
          </div>
          <div>
            <label className="block typo-caption font-semibold mb-1">Rue <span style={{ color: 'var(--itm-red)' }}>*</span></label>
            <input type="text" value={newAddr.street} onChange={(e) => setNewAddr((a) => ({ ...a, street: e.target.value }))}
              placeholder="Ex. : 12 rue des Lilas" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: '#c8c8c8' }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block typo-caption font-semibold mb-1">Code postal <span style={{ color: 'var(--itm-red)' }}>*</span></label>
              <input type="text" value={newAddr.postalCode} onChange={(e) => setNewAddr((a) => ({ ...a, postalCode: e.target.value }))}
                placeholder="31000" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: '#c8c8c8' }} />
            </div>
            <div>
              <label className="block typo-caption font-semibold mb-1">Ville <span style={{ color: 'var(--itm-red)' }}>*</span></label>
              <input type="text" value={newAddr.city} onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))}
                placeholder="Toulouse" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: '#c8c8c8' }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="typo-btn px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ background: 'var(--itm-red)' }}>
              Ajouter
            </button>
            <button type="button" onClick={() => setAdding(false)} className="typo-btn px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-gray-50" style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-text)' }}>
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 typo-meta font-semibold hover:underline"
          style={{ color: 'var(--itm-red)' }}>
          <span className="text-lg leading-none">+</span> Ajouter une adresse
        </button>
      )}
    </div>
  );
}

// ── Orders tab ────────────────────────────────────────────────────────────────

function OrdersTab({ orders, navigate, addToCart }: {
  orders: MockOrder[];
  navigate: NavigateFn;
  addToCart: (productId: string, variant?: string, qty?: number) => void;
}) {
  const handleReorder = (order: MockOrder) => {
    order.items.forEach((item) => addToCart(item.productId, undefined, item.qty));
    navigate({ type: 'cart' });
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const s = STATUS_LABELS[order.status];
        return (
          <div key={order.ref} className="bg-white rounded-xl p-5" style={{ border: '1px solid var(--itm-border)' }}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="typo-meta font-bold" style={{ color: 'var(--itm-text)' }}>
                  Commande{' '}
                  <span className="font-mono tracking-wide">{order.ref}</span>
                </p>
                <p className="typo-caption mt-0.5" style={{ color: 'var(--itm-text-light)' }}>
                  {new Date(order.date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} — {order.method}
                </p>
                {order.address && (
                  <p className="typo-caption" style={{ color: 'var(--itm-text-light)' }}>{order.address}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="typo-caption font-bold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                  {s.label}
                </span>
                <span className="font-black text-base" style={{ color: 'var(--itm-text)' }}>{order.total.toFixed(2)} €</span>
              </div>
            </div>

            <div className="space-y-1 mb-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between typo-caption" style={{ color: 'var(--itm-text-light)' }}>
                  <span>{item.name}</span>
                  <span className="font-semibold">{(item.price * item.qty).toFixed(2)} €</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-3 border-t" style={{ borderColor: 'var(--itm-border)' }}>
              <button
                onClick={() => handleReorder(order)}
                className="typo-btn px-4 py-2 rounded-lg text-white text-sm font-bold"
                style={{ background: 'var(--itm-red)' }}>
                Recommander
              </button>
              <button
                onClick={() => navigate({ type: 'tracking', orderRef: order.ref })}
                className="typo-btn px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-gray-50"
                style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-text)' }}>
                Voir le suivi
              </button>
            </div>
          </div>
        );
      })}

      {orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart size={40} strokeWidth={1.5} className="mx-auto mb-3 text-gray-300" />
          <p className="typo-meta font-semibold" style={{ color: 'var(--itm-text)' }}>Aucune commande pour l'instant</p>
          <p className="typo-caption mt-1" style={{ color: 'var(--itm-text-light)' }}>Votre historique de commandes apparaîtra ici.</p>
        </div>
      )}
    </div>
  );
}

// ── AccountPage shell ─────────────────────────────────────────────────────────

type LucideComponent = React.ComponentType<LucideProps>;
const TABS: { id: AccountTab; label: string; Icon: LucideComponent }[] = [
  { id: 'orders', label: 'Mes commandes', Icon: Package },
  { id: 'info', label: 'Mes informations', Icon: UserRound },
  { id: 'addresses', label: 'Mes adresses', Icon: MapPin },
];

export default function AccountPage({ user, navigate, tab = 'orders', onLogout, addToCart }: AccountPageProps) {
  const [activeTab, setActiveTab] = useState<AccountTab>(tab);

  return (
    <div className="min-h-screen" style={{ background: 'var(--itm-gray-bg)' }}>
      <div className="max-w-screen-xl mx-auto px-3 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 typo-meta mb-4" style={{ color: 'var(--itm-text-light)' }}>
          <button onClick={() => navigate({ type: 'home' })} className="hover:underline">Accueil</button>
          <span>›</span>
          <span style={{ color: 'var(--itm-text)' }} className="font-medium">Mon compte</span>
        </nav>

        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="typo-page-title" style={{ color: 'var(--itm-text)' }}>
              Bonjour, {user.firstName} !
            </h1>
            <p className="typo-meta mt-0.5" style={{ color: 'var(--itm-text-light)' }}>{user.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="typo-btn px-4 py-2 rounded-lg border font-semibold hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-text)' }}>
            Se déconnecter
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid var(--itm-border)' }}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50"
                  style={{
                    borderBottom: '1px solid var(--itm-border)',
                    background: activeTab === t.id ? '#fff5f5' : undefined,
                    borderLeft: activeTab === t.id ? '3px solid var(--itm-red)' : '3px solid transparent',
                  }}>
                  <t.Icon size={16} strokeWidth={1.75} style={{ color: activeTab === t.id ? 'var(--itm-red)' : 'var(--itm-text-light)' }} />
                  <span
                    className="typo-meta font-semibold"
                    style={{ color: activeTab === t.id ? 'var(--itm-red)' : 'var(--itm-text)' }}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl p-6" style={{ border: '1px solid var(--itm-border)' }}>
              <h2 className="section-title mb-5" style={{ color: 'var(--itm-text)' }}>
                {TABS.find((t) => t.id === activeTab)?.label}
              </h2>

              {activeTab === 'orders' && (
                <OrdersTab orders={MOCK_ORDERS} navigate={navigate} addToCart={addToCart} />
              )}
              {activeTab === 'info' && <InfoTab user={user} />}
              {activeTab === 'addresses' && <AddressesTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
