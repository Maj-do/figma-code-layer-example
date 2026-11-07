import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../data/catalogue';
import { CartItem } from '../types/cart';
import { NavigateFn } from '../types/navigation';

type ProductCardVariant = 'catalogue' | 'featured' | 'related';

interface ProductCardProps {
  product: Product;
  navigate: NavigateFn;
  cartItems: CartItem[];
  addToCart: (productId: string, variant?: string, qty?: number) => void;
  updateCartQty: (productId: string, variant: string | undefined, qty: number) => void;
  variant?: ProductCardVariant;
}

type ProductWithQuantityRules = Product & {
  minQty?: number;
  step?: number;
};

const HIGHLIGHT_LABELS = {
  'best-seller': { label: 'Best-seller', background: 'var(--itm-red)' },
  new: { label: 'Nouveauté', background: '#16a34a' },
} as const;

export default function ProductCard({
  product,
  navigate,
  cartItems,
  addToCart,
  updateCartQty,
  variant = 'catalogue',
}: ProductCardProps) {
  const productItems = cartItems.filter((item) => item.productId === product.id);
  const quantity = productItems.reduce((total, item) => total + item.qty, 0);
  const quantityRules = product as ProductWithQuantityRules;
  const minQty = quantityRules.minQty ?? 1;
  const step = quantityRules.step ?? 1;
  const imageAspect = variant === 'related' ? '1 / 0.7' : '1 / 0.85';

  const stopCardNavigation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    stopCardNavigation(event);
    addToCart(product.id, undefined, minQty);
  };

  const handleIncrement = (event: React.MouseEvent<HTMLButtonElement>) => {
    stopCardNavigation(event);
    const item = productItems.find((entry) => entry.variant === undefined) ?? productItems[0];
    if (item) {
      updateCartQty(product.id, item.variant, item.qty + step);
      return;
    }
    addToCart(product.id, undefined, minQty);
  };

  const handleDecrement = (event: React.MouseEvent<HTMLButtonElement>) => {
    stopCardNavigation(event);
    const item = productItems.find((entry) => entry.variant === undefined) ?? productItems[0];
    if (!item) return;
    const nextQuantity = item.qty - step;
    updateCartQty(product.id, item.variant, nextQuantity < minQty ? 0 : nextQuantity);
  };

  return (
    <article
      className="bg-white border rounded overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      style={{ borderColor: 'var(--itm-border)' }}
      onClick={() => navigate({ type: 'product', productId: product.id })}>
      <div
        className="relative overflow-hidden flex items-center justify-center w-full"
        style={{ background: product.bgColor, aspectRatio: imageAspect }}>
        {variant !== 'related' && product.highlight && (
          <span
            className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10"
            style={{ background: HIGHLIGHT_LABELS[product.highlight].background }}>
            {HIGHLIGHT_LABELS[product.highlight].label}
          </span>
        )}
        {variant === 'catalogue' && product.isIndustrial && (
          <span
            className="absolute top-2 right-2 text-xs font-semibold px-1.5 py-0.5 rounded border z-10"
            style={{ background: '#f9fafb', color: '#6b7280', borderColor: '#d1d5db' }}>
            Partenaire
          </span>
        )}
        {variant === 'catalogue' && product.labels.slice(0, 1).map((label) => (
          <span
            key={label}
            className="absolute bottom-2 left-2 text-xs font-bold px-1.5 py-0.5 rounded z-10"
            style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
            {label}
          </span>
        ))}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(event) => { event.currentTarget.style.opacity = '0'; }}
        />
      </div>

      <div className="p-2.5 flex flex-col flex-1">
        {variant === 'featured' && (
          <p className="typo-meta mb-0.5 leading-tight truncate">{product.unit}</p>
        )}
        {variant === 'catalogue' && (
          <p className="typo-meta mb-0.5 leading-tight truncate">{product.brand}</p>
        )}
        <p className="typo-card-title mb-1 line-clamp-2">{product.name}</p>
        {variant !== 'related' && (
          <p className="typo-meta leading-snug flex-1 line-clamp-2">{product.shortDescription}</p>
        )}
        {variant === 'catalogue' && (
          <p className="typo-caption mt-1">{product.portions}</p>
        )}

        <div className="flex items-end justify-between gap-2 mt-2.5">
          <div className="min-w-0">
            <span className="price-number">{product.priceLabel}</span>
            <span className="price-unit ml-0.5">€</span>
            {variant === 'catalogue' && <p className="typo-caption truncate">{product.unit}</p>}
          </div>

          {quantity === 0 ? (
            <button
              type="button"
              onClick={handleAdd}
              className="relative w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0 hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: 'var(--itm-red)', outlineColor: 'var(--itm-red)' }}
              aria-label={`Ajouter ${product.name} au panier`}>
              <ShoppingCart size={23} strokeWidth={2} aria-hidden="true" />
              <Plus
                size={12}
                strokeWidth={3}
                className="absolute right-1.5 bottom-1.5 rounded-full"
                aria-hidden="true"
              />
            </button>
          ) : (
            <div
              className="flex items-center gap-1 p-1 rounded-full flex-shrink-0"
              style={{ background: '#fff0f2' }}
              onClick={stopCardNavigation}>
              <button
                type="button"
                onClick={handleDecrement}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-1"
                style={{ background: 'var(--itm-red)', outlineColor: 'var(--itm-red)' }}
                aria-label={`Diminuer la quantité de ${product.name}`}>
                <Minus size={19} strokeWidth={3} aria-hidden="true" />
              </button>
              <span className="min-w-8 text-center text-sm font-black" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-1"
                style={{ background: 'var(--itm-red)', outlineColor: 'var(--itm-red)' }}
                aria-label={`Augmenter la quantité de ${product.name}`}>
                <Plus size={19} strokeWidth={3} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
