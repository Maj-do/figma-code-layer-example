import { useState, useMemo } from 'react';
import { Check, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { products, topCategories } from '../data/catalogue';
import { CartItem } from '../types/cart';
import { NavigateFn, Page } from '../types/navigation';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';

interface CataloguePageProps {
  currentPage: Page & { type: 'catalogue' };
  navigate: NavigateFn;
  cartItems: CartItem[];
  addToCart: (productId: string, variant?: string, qty?: number) => void;
  updateCartQty: (productId: string, variant: string | undefined, qty: number) => void;
}

const PREFERENCE_TAGS = new Set(['Végétarien', 'Sans gluten', 'Sans viande']);
const PREPARATION_TAGS = new Set(['Fait maison', 'Industriel', 'Surgelé', 'À réchauffer', 'Plat chaud', 'Plats froids']);

export default function CataloguePage({
  currentPage,
  navigate,
  cartItems,
  addToCart,
  updateCartQty,
}: CataloguePageProps) {
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { categoryId, subcategoryId } = currentPage;

  // Find active top category
  const activeTopCat = topCategories.find((c) => c.id === categoryId);
  const activeSubCat = activeTopCat?.subcategories.find((s) => s.id === subcategoryId);

  // Filtered products
  const filtered = useMemo(() => {
    let list = products;
    if (categoryId && categoryId !== 'fetes') {
      list = list.filter((p) => p.categoryId === categoryId);
    }
    if (subcategoryId) {
      list = list.filter((p) => p.subcategoryId === subcategoryId);
    }
    if (categoryId === 'fetes') {
      list = list.filter((p) => p.tags.some((t) => t === 'Festif' || t === 'Fêtes') || !!p.highlight);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeTags.size > 0) {
      list = list.filter((p) => [...activeTags].every((t) => p.tags.includes(t)));
    }
    return list;
  }, [categoryId, subcategoryId, search, activeTags]);

  // All tags from currently visible pool (before tag filter)
  const allTags = useMemo(() => {
    let base = products;
    if (categoryId && categoryId !== 'fetes') base = base.filter((p) => p.categoryId === categoryId);
    if (subcategoryId) base = base.filter((p) => p.subcategoryId === subcategoryId);
    const tagSet = new Set<string>();
    base.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return [...tagSet].sort();
  }, [categoryId, subcategoryId]);

  const filterGroups = useMemo(() => {
    const preferences = allTags.filter((tag) => PREFERENCE_TAGS.has(tag));
    const preparation = allTags.filter((tag) => PREPARATION_TAGS.has(tag));
    const occasions = allTags.filter((tag) => !PREFERENCE_TAGS.has(tag) && !PREPARATION_TAGS.has(tag));
    return [
      { label: 'Préférences alimentaires', tags: preferences },
      { label: 'Préparation', tags: preparation },
      { label: 'Occasions et formats', tags: occasions },
    ].filter((group) => group.tags.length > 0);
  }, [allTags]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return next;
    });
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--itm-gray-bg)' }}>
      <CategoryNav currentPage={currentPage} navigate={navigate} />

      <div className="max-w-screen-xl mx-auto px-3 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <button onClick={() => navigate({ type: 'home' })} className="hover:underline hover:text-gray-700">Accueil</button>
          <span>›</span>
          <button onClick={() => navigate({ type: 'catalogue' })} className="hover:underline hover:text-gray-700">Catalogue</button>
          {activeTopCat && <>
            <span>›</span>
            <button onClick={() => navigate({ type: 'catalogue', categoryId })} className="hover:underline hover:text-gray-700">{activeTopCat.label}</button>
          </>}
          {activeSubCat && <>
            <span>›</span>
            <span className="text-gray-700 font-medium">{activeSubCat.label}</span>
          </>}
        </nav>

        {/* Page title + search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="typo-page-title">
              {categoryId === 'fetes' ? 'Fêtes de fin d\'année' : activeTopCat?.label ?? 'Tous les produits traiteur'}
            </h1>
            <p className="typo-meta mt-0.5">{filtered.length} produit{filtered.length > 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-full overflow-hidden bg-white h-9 w-full sm:w-72"
              style={{ borderColor: '#c8c8c8' }}>
              <input
                type="text"
                placeholder="Rechercher dans le catalogue..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 text-xs outline-none" />
              <div className="px-3 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {/* Mobile filter toggle */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex md:hidden items-center gap-1.5 px-3 py-2 border rounded-full text-xs font-medium bg-white"
              style={{ borderColor: 'var(--itm-border)' }}>
              <SlidersHorizontal size={18} strokeWidth={1.8} aria-hidden="true" />
              Filtres
              {activeTags.size > 0 && (
                <span
                  className="rounded-full text-white text-xs font-black min-w-6 h-6 px-1 flex items-center justify-center"
                  style={{ background: 'var(--itm-red)' }}>
                  {activeTags.size}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Sidebar filters */}
          <aside
            className={`${sidebarOpen ? 'flex' : 'hidden'} fixed inset-x-0 bottom-0 top-[var(--header-offset)] z-40 items-end bg-black/40 md:static md:z-auto md:flex md:w-64 md:flex-shrink-0 md:items-start md:bg-transparent`}
            onClick={(event) => {
              if (event.target === event.currentTarget) setSidebarOpen(false);
            }}>
            <div
              className="w-full max-h-full overflow-y-auto bg-white border rounded-t-2xl p-5 shadow-2xl md:sticky md:top-[calc(var(--header-offset)+1rem)] md:max-h-[calc(100vh-var(--header-offset)-2rem)] md:rounded-xl md:shadow-sm"
              style={{ borderColor: 'var(--itm-border)' }}>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black">Filtrer par</h2>
                  {activeTags.size > 0 && (
                    <span
                      className="rounded-full text-white text-xs font-black min-w-6 h-6 px-1 flex items-center justify-center"
                      style={{ background: 'var(--itm-red)' }}>
                      {activeTags.size}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
                  aria-label="Fermer les filtres">
                  <X size={21} aria-hidden="true" />
                </button>
              </div>

              {filterGroups.length > 0 ? (
                <div className="space-y-5">
                  {filterGroups.map((group) => (
                    <section key={group.label}>
                      <h3 className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: 'var(--itm-text-light)' }}>
                        {group.label}
                      </h3>
                      <div className="space-y-2">
                        {group.tags.map((tag) => {
                          const selected = activeTags.has(tag);
                          return (
                            <label
                              key={tag}
                              className="flex items-center gap-2.5 cursor-pointer rounded-lg border p-2.5 transition-colors"
                              style={{
                                background: selected ? '#fff5f5' : '#fff',
                                borderColor: selected ? 'var(--itm-red)' : 'var(--itm-border)',
                                color: selected ? 'var(--itm-red)' : 'var(--itm-text)',
                              }}>
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggleTag(tag)}
                                className="sr-only"
                              />
                              <span
                                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border"
                                style={{
                                  background: selected ? 'var(--itm-red)' : '#fff',
                                  borderColor: selected ? 'var(--itm-red)' : '#b8b8b8',
                                  color: '#fff',
                                }}>
                                {selected && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                              </span>
                              <span className="text-xs font-semibold leading-tight">{tag}</span>
                            </label>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Aucun filtre disponible</p>
              )}

              <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--itm-border)' }}>
                <p className="text-xs font-bold mb-3" aria-live="polite">
                  {filtered.length} produit{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
                </p>
                <button
                  onClick={() => setActiveTags(new Set())}
                  disabled={activeTags.size === 0}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-bold transition-colors disabled:opacity-40"
                  style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-red)' }}>
                  <RotateCcw size={16} strokeWidth={1.9} aria-hidden="true" />
                  Réinitialiser les filtres
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden mt-2 w-full rounded-lg px-3 py-3 text-xs font-black text-white"
                  style={{ background: 'var(--itm-red)' }}>
                  Appliquer · {filtered.length} produit{filtered.length > 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Search size={48} strokeWidth={1.25} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-semibold">Aucun produit trouvé</p>
                <p className="text-xs">Essayez d'autres mots-clés ou retirez des filtres.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    navigate={navigate}
                    cartItems={cartItems}
                    addToCart={addToCart}
                    updateCartQty={updateCartQty}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
