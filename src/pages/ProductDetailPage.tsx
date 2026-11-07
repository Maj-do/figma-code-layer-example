import { useState } from 'react';
import { Search, Globe, Settings } from 'lucide-react';
import { products, topCategories, ALLERGEN_LABELS, AllergenKey, NutritionPer100g } from '../data/catalogue';
import { CartItem } from '../types/cart';
import { NavigateFn, Page } from '../types/navigation';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';

interface ProductDetailPageProps {
  productId: string;
  currentPage: Page;
  navigate: NavigateFn;
  cartItems: CartItem[];
  addToCart: (productId: string, variant?: string, qty?: number) => void;
  updateCartQty: (productId: string, variant: string | undefined, qty: number) => void;
}

function NutritionTable({ nutrition }: { nutrition: NutritionPer100g }) {
  const rows = [
    { label: 'Énergie', value: `${nutrition.energy_kj} kJ / ${nutrition.energy_kcal} kcal` },
    { label: 'Matières grasses', value: `${nutrition.fat} g`, indent: false },
    { label: '   dont acides gras saturés', value: `${nutrition.saturates} g`, indent: true },
    { label: 'Glucides', value: `${nutrition.carbs} g`, indent: false },
    { label: '   dont sucres', value: `${nutrition.sugars} g`, indent: true },
    { label: 'Protéines', value: `${nutrition.protein} g`, indent: false },
    { label: 'Sel', value: `${nutrition.salt} g`, indent: false },
  ];
  return (
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr style={{ background: 'var(--itm-gray-bg)' }}>
          <th className="text-left py-2 px-3 font-semibold text-gray-700 border" style={{ borderColor: 'var(--itm-border)' }}>Valeur nutritionnelle</th>
          <th className="text-right py-2 px-3 font-semibold text-gray-700 border" style={{ borderColor: 'var(--itm-border)' }}>Pour 100g</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b" style={{ borderColor: 'var(--itm-border)' }}>
            <td className={`py-1.5 px-3 text-gray-700 ${row.indent ? 'pl-6' : ''}`}>{row.label}</td>
            <td className="py-1.5 px-3 text-right text-gray-700 font-medium">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--itm-border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left">
        <span className="accordion-title">{title}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 bg-white border-t text-xs text-gray-700 space-y-3"
          style={{ borderColor: 'var(--itm-border)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage({
  productId,
  currentPage,
  navigate,
  cartItems,
  addToCart,
  updateCartQty,
}: ProductDetailPageProps) {
  const product = products.find((p) => p.id === productId);
  if (!product) return (
    <div className="text-center py-24">
      <Search size={48} strokeWidth={1.25} className="mx-auto mb-4 text-gray-300" />
      <p className="text-base font-semibold text-gray-600">Produit introuvable</p>
      <button onClick={() => navigate({ type: 'catalogue' })} className="mt-4 text-xs underline" style={{ color: 'var(--itm-red)' }}>Retour au catalogue</button>
    </div>
  );

  const [selectedVariant, setSelectedVariant] = useState(product.variant?.options[0] ?? null);
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(0);

  const topCat = topCategories.find((c) => c.id === product.categoryId);
  const subCat = topCat?.subcategories.find((s) => s.id === product.subcategoryId);

  // Gallery: main product image + 2 detail views
  const galleryItems = [product.imageUrl, product.imageUrl, product.imageUrl];

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.tags.some((t) => product.tags.includes(t))))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <CategoryNav currentPage={currentPage} navigate={navigate} />

      <div className="max-w-screen-xl mx-auto px-3 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <button onClick={() => navigate({ type: 'home' })} className="hover:underline">Accueil</button>
          <span>›</span>
          <button onClick={() => navigate({ type: 'catalogue' })} className="hover:underline">Catalogue</button>
          {topCat && <>
            <span>›</span>
            <button onClick={() => navigate({ type: 'catalogue', categoryId: product.categoryId })} className="hover:underline">{topCat.label}</button>
          </>}
          {subCat && <>
            <span>›</span>
            <button onClick={() => navigate({ type: 'catalogue', categoryId: product.categoryId, subcategoryId: product.subcategoryId })} className="hover:underline">{subCat.label}</button>
          </>}
          <span>›</span>
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left: Gallery */}
          <div>
            <div className="relative rounded-xl overflow-hidden mb-3"
              style={{ aspectRatio: '1 / 0.9' }}>
              {product.isIndustrial && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded border bg-white text-gray-500"
                    style={{ borderColor: 'var(--itm-border)' }}>
                    Produit partenaire
                  </span>
                </div>
              )}
              <img
                src={galleryItems[mainImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2">
              {galleryItems.map((url, i) => (
                <button key={i}
                  onClick={() => setMainImg(i)}
                  className={`w-16 h-16 rounded-lg border overflow-hidden transition-all ${mainImg === i ? 'border-2 shadow-sm' : 'hover:border-gray-300'}`}
                  style={{ borderColor: mainImg === i ? 'var(--itm-red)' : 'var(--itm-border)' }}>
                  <img src={url} alt="" className="w-full h-full object-cover"  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product info */}
          <div>
            {/* Brand & industrial badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 font-medium">{product.brand}</span>
              {product.isIndustrial && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded border bg-amber-50 text-amber-700"
                  style={{ borderColor: '#fde68a' }}>
                  <Settings size={12} strokeWidth={1.75} className="inline mr-1 align-text-bottom" />Produit industriel — {product.cnuf}
                </span>
              )}
            </div>

            <h1 className="typo-page-title mb-2">{product.name}</h1>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{product.shortDescription}</p>

            {/* Label badges */}
            {product.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {product.labels.map((label) => (
                  <span key={label} className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                    {label}
                  </span>
                ))}
                {product.highlight && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded text-white"
                    style={{ background: product.highlight === 'new' ? '#16a34a' : 'var(--itm-red)' }}>
                    {product.highlight === 'new' ? 'Nouveauté' : 'Best-seller'}
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-1">
              <span className="price-number" style={{ fontSize: 'clamp(26px, 2.8vw, 34px)' }}>{product.priceLabel}</span>
              <span className="price-unit">€</span>
            </div>
            <p className="typo-caption mb-4">{product.unit} · {product.portions}</p>

            {/* Variant selector */}
            {product.variant && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">{product.variant.label}</p>
                <div className="flex flex-wrap gap-2">
                  {product.variant.options.map((opt) => (
                    <button key={opt}
                      onClick={() => setSelectedVariant(opt)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selectedVariant === opt ? 'text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                      style={selectedVariant === opt ? { background: 'var(--itm-red)', borderColor: 'var(--itm-red)' } : {}}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: 'var(--itm-border)' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors">−</button>
                <span className="w-10 text-center text-sm font-bold">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors">+</button>
              </div>
              <button
                onClick={() => addToCart(product.id, selectedVariant ?? undefined, qty)}
                className="flex-1 h-10 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'var(--itm-red)' }}>
                Ajouter au panier
              </button>
            </div>

            {/* Industrial supplier info */}
            {product.isIndustrial && product.supplier && (
              <div className="rounded-lg p-3 mb-4 text-xs"
                style={{ background: '#fafafa', border: '1px solid var(--itm-border)' }}>
                <p className="font-semibold text-gray-700 mb-0.5">Fourni par un partenaire industriel</p>
                <p className="text-gray-500">{product.supplier}</p>
                <p className="text-gray-400 font-mono text-xs mt-0.5">Réf. fournisseur : {product.cnuf}</p>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span key={tag} className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--itm-gray-bg)', color: 'var(--itm-text-light)', border: '1px solid var(--itm-border)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Food information accordion */}
        <div className="mb-10 space-y-2">
          <h2 className="text-base font-black mb-3">Informations alimentaires</h2>

          <Accordion title="Ingrédients" defaultOpen>
            <p className="leading-relaxed">{product.ingredients}</p>
            {product.origin && (
              <p className="text-xs text-gray-500 mt-2 italic flex items-center gap-1"><Globe size={12} strokeWidth={1.75} />{product.origin}</p>
            )}
          </Accordion>

          <Accordion title={`Allergènes (${product.allergens.length} présents)`}>
            <p className="text-xs text-gray-500 mb-2">
              Contient les allergènes suivants parmi les 14 allergènes réglementaires :
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(ALLERGEN_LABELS) as AllergenKey[]).map((key) => {
                const isPresent = product.allergens.includes(key);
                return (
                  <span key={key}
                    className={`text-xs font-medium px-2 py-1 rounded ${isPresent ? 'text-white' : 'text-gray-400'}`}
                    style={isPresent
                      ? { background: '#e2001a' }
                      : { background: 'var(--itm-gray-bg)', border: '1px solid var(--itm-border)' }}>
                    {ALLERGEN_LABELS[key]}
                  </span>
                );
              })}
            </div>
          </Accordion>

          <Accordion title="Valeurs nutritionnelles (pour 100g)">
            <NutritionTable nutrition={product.nutrition} />
          </Accordion>

          <Accordion title="Conservation & utilisation">
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-xs text-gray-600 mb-1 uppercase tracking-wider">Conservation</p>
                <p>{product.storage}</p>
              </div>
              <div>
                <p className="font-semibold text-xs text-gray-600 mb-1 uppercase tracking-wider">Conseils d'utilisation</p>
                <p>{product.usage}</p>
              </div>
              {product.origin && (
                <div>
                  <p className="font-semibold text-xs text-gray-600 mb-1 uppercase tracking-wider">Origine</p>
                  <p>{product.origin}</p>
                </div>
              )}
            </div>
          </Accordion>

          <Accordion title="Informations produit">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-gray-500">Marque :</span> <span className="font-medium">{product.brand}</span></div>
              <div><span className="text-gray-500">EAN :</span> <span className="font-mono">{product.ean}</span></div>
              <div><span className="text-gray-500">Conditionnement :</span> <span className="font-medium">{product.unit}</span></div>
              <div><span className="text-gray-500">Portions :</span> <span className="font-medium">{product.portions}</span></div>
              {product.isIndustrial && <>
                <div><span className="text-gray-500">Fournisseur :</span> <span className="font-medium">{product.supplier}</span></div>
                <div><span className="text-gray-500">Réf. CNUF :</span> <span className="font-mono">{product.cnuf}</span></div>
              </>}
            </div>
          </Accordion>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-black mb-4">Vous pourriez aussi aimer</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.map((rp) => (
                <ProductCard
                  key={rp.id}
                  product={rp}
                  navigate={navigate}
                  cartItems={cartItems}
                  addToCart={addToCart}
                  updateCartQty={updateCartQty}
                  variant="related"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
