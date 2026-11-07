import { ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { products } from '../data/catalogue';
import { CartItem } from '../types/cart';
import { NavigateFn } from '../types/navigation';
import { MINIMUM_ORDER, VAT_RATE } from '../data/slots';
import { Store } from '../data/stores';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQty: (productId: string, variant: string | undefined, qty: number) => void;
  onRemove: (productId: string, variant: string | undefined) => void;
  navigate: NavigateFn;
  store: Store;
}

function CartLineItem({
  item,
  onUpdateQty,
  onRemove,
}: {
  item: CartItem;
  onUpdateQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const product = products.find((p) => p.id === item.productId);
  if (!product) return null;
  const lineTotal = (product.price * item.qty).toFixed(2);

  return (
    <div className="flex gap-4 py-4 border-b" style={{ borderColor: 'var(--itm-border)' }}>
      {/* Product thumbnail */}
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy"  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="typo-card-title leading-tight mb-0.5 truncate">{product.name}</p>
        {item.variant && (
          <p className="typo-meta mb-1">
            <span className="font-medium">{product.variant?.label} :</span> {item.variant}
          </p>
        )}
        <p className="typo-caption text-gray-400">{product.unit}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQty(Math.max(0, item.qty - 1))}
            aria-label="Diminuer la quantité"
            className="w-7 h-7 rounded-full border flex items-center justify-center font-bold text-sm transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-1"
            style={{ borderColor: 'var(--itm-red)', color: 'var(--itm-red)', outlineColor: 'var(--itm-red)' }}>
            −
          </button>
          <span className="w-6 text-center font-bold text-sm" aria-live="polite">{item.qty}</span>
          <button
            onClick={() => onUpdateQty(item.qty + 1)}
            aria-label="Augmenter la quantité"
            className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm focus-visible:outline-2 focus-visible:outline-offset-1"
            style={{ background: 'var(--itm-red)', outlineColor: 'var(--itm-red)' }}>
            +
          </button>
        </div>
      </div>

      {/* Price + remove */}
      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <button
          onClick={onRemove}
          className="text-gray-300 hover:text-gray-500 transition-colors p-1"
          aria-label="Supprimer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-right">
          <p className="typo-meta text-gray-400 line-through">{product.priceLabel} € <span className="text-xs">/ unité</span></p>
          <p className="price-number" style={{ color: 'var(--itm-text)' }}>{lineTotal} <span className="price-unit">€</span></p>
        </div>
      </div>
    </div>
  );
}

export default function CartPage({ cartItems, onUpdateQty, onRemove, navigate, store }: CartPageProps) {
  const enriched = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { item, product };
  }).filter((e) => e.product);

  const subtotal = enriched.reduce((sum, { item, product }) => sum + product!.price * item.qty, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal;
  const meetsMinimum = subtotal >= MINIMUM_ORDER;
  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--itm-gray-bg)' }}>
      <div className="max-w-screen-xl mx-auto px-3 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 typo-meta mb-5">
          <button onClick={() => navigate({ type: 'home' })} className="hover:underline">Accueil</button>
          <span>›</span>
          <span style={{ color: 'var(--itm-text)' }} className="font-medium">Mon panier</span>
        </nav>

        <h1 className="typo-page-title mb-6" style={{ color: 'var(--itm-text)' }}>
          Mon panier{!isEmpty && <span className="typo-meta font-normal ml-2">({cartItems.reduce((s, i) => s + i.qty, 0)} article{cartItems.reduce((s, i) => s + i.qty, 0) > 1 ? 's' : ''})</span>}
        </h1>

        {isEmpty ? (
          <div className="bg-white rounded-xl p-12 text-center" style={{ border: '1px solid var(--itm-border)' }}>
            <ShoppingCartIcon size={56} strokeWidth={1.25} className="mx-auto mb-4 text-gray-300" />
            <p className="typo-page-title mb-2" style={{ color: 'var(--itm-text)' }}>Votre panier est vide</p>
            <p className="typo-body mb-6">Parcourez notre catalogue pour ajouter des produits traiteur à votre commande.</p>
            <button
              onClick={() => navigate({ type: 'catalogue' })}
              className="typo-btn px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{ background: 'var(--itm-red)' }}>
              Découvrir le catalogue
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Line items */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl p-5" style={{ border: '1px solid var(--itm-border)' }}>
                <p className="font-semibold text-gray-500 typo-meta uppercase tracking-wider mb-2">
                  Magasin : {store.name}
                </p>
                {enriched.map(({ item }) => (
                  <CartLineItem
                    key={`${item.productId}-${item.variant ?? ''}`}
                    item={item}
                    onUpdateQty={(qty) => {
                      if (qty === 0) onRemove(item.productId, item.variant);
                      else onUpdateQty(item.productId, item.variant, qty);
                    }}
                    onRemove={() => onRemove(item.productId, item.variant)}
                  />
                ))}

                <button
                  onClick={() => navigate({ type: 'catalogue' })}
                  className="mt-4 flex items-center gap-2 typo-meta font-semibold hover:underline"
                  style={{ color: 'var(--itm-red)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter d'autres produits
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl p-5 sticky top-[calc(var(--header-offset)+1rem)]" style={{ border: '1px solid var(--itm-border)' }}>
                <h2 className="font-black text-base mb-4" style={{ color: 'var(--itm-text)' }}>Récapitulatif</h2>

                <div className="space-y-2 pb-3 border-b" style={{ borderColor: 'var(--itm-border)' }}>
                  <div className="flex justify-between typo-meta">
                    <span>Sous-total HT</span>
                    <span>{(subtotal / (1 + VAT_RATE)).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between typo-meta">
                    <span>TVA (5,5 %)</span>
                    <span>{vat.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-3 pb-4">
                  <span className="font-black text-base" style={{ color: 'var(--itm-text)' }}>Total TTC</span>
                  <span className="price-number" style={{ color: 'var(--itm-text)' }}>{total.toFixed(2)} <span className="price-unit">€</span></span>
                </div>

                {!meetsMinimum && (
                  <div className="mb-3 rounded-lg px-3 py-2 typo-caption" style={{ background: '#fff8e1', color: '#92400e', border: '1px solid #fde68a' }}>
                    Commande minimum : {MINIMUM_ORDER} €. Il vous manque {(MINIMUM_ORDER - subtotal).toFixed(2)} €.
                  </div>
                )}

                <button
                  disabled={!meetsMinimum}
                  onClick={() => navigate({ type: 'checkout' })}
                  className="w-full typo-btn py-3 rounded-lg text-white transition-opacity"
                  style={{ background: meetsMinimum ? 'var(--itm-red)' : '#ccc', cursor: meetsMinimum ? 'pointer' : 'not-allowed' }}>
                  Passer commande →
                </button>

                <p className="typo-caption text-center mt-3" style={{ color: 'var(--itm-text-light)' }}>
                  Paiement 100 % sécurisé
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
