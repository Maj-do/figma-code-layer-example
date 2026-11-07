import { products } from '../data/catalogue';
import { CartItem } from '../types/cart';
import { NavigateFn } from '../types/navigation';
import ProductCard from './ProductCard';

interface FeaturedProductsProps {
  navigate: NavigateFn;
  cartItems: CartItem[];
  addToCart: (productId: string, variant?: string, qty?: number) => void;
  updateCartQty: (productId: string, variant: string | undefined, qty: number) => void;
}

export default function FeaturedProducts({
  navigate,
  cartItems,
  addToCart,
  updateCartQty,
}: FeaturedProductsProps) {
  const featured = products.filter((p) => p.highlight).slice(0, 8);

  return (
    <section style={{ background: 'var(--itm-gray-bg)' }} className="py-5">
      <div className="max-w-screen-xl mx-auto px-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title" style={{ color: 'var(--itm-text)' }}>Nos incontournables</h2>
          <button onClick={() => navigate({ type: 'catalogue' })}
            className="text-xs font-semibold hover:underline" style={{ color: 'var(--itm-red)' }}>
            Voir tous les produits →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              navigate={navigate}
              cartItems={cartItems}
              addToCart={addToCart}
              updateCartQty={updateCartQty}
              variant="featured"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
