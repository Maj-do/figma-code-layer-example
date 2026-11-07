import {
  BookOpen,
  Cake,
  Grid2X2,
  LayoutGrid,
  Sparkles,
  UtensilsCrossed,
  Wine,
  type LucideProps,
} from 'lucide-react';
import { topCategories, TEMPS_FORT } from '../data/catalogue';
import { NavigateFn, Page } from '../types/navigation';

type LucideComponent = React.ComponentType<LucideProps>;

const CATEGORY_ICONS: Record<string, LucideComponent> = {
  Wine,
  UtensilsCrossed,
  BookOpen,
  LayoutGrid,
  Cake,
};

interface CategoryNavProps {
  currentPage: Page;
  navigate: NavigateFn;
}

export default function CategoryNav({ currentPage, navigate }: CategoryNavProps) {
  const activeCatId = currentPage.type === 'catalogue' ? currentPage.categoryId : undefined;
  const activeSubcategoryId = currentPage.type === 'catalogue' ? currentPage.subcategoryId : undefined;
  const activeCategory = topCategories.find((category) => category.id === activeCatId);

  return (
    <nav
      className="relative z-20 bg-white border-b"
      style={{ borderColor: 'var(--itm-border)' }}
      aria-label="Catégories du catalogue">
      <div className="max-w-screen-xl mx-auto px-3 py-3">
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pr-8 pb-1 lg:pr-0" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => navigate({ type: 'catalogue' })}
              className={`flex-shrink-0 min-w-[132px] lg:min-w-0 lg:flex-1 flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-1 ${
                !activeCatId ? 'shadow-sm' : 'hover:bg-gray-50'
              }`}
              style={{
                borderColor: !activeCatId ? 'var(--itm-red)' : 'var(--itm-border)',
                background: !activeCatId ? '#fff5f5' : '#fff',
                color: !activeCatId ? 'var(--itm-red)' : 'var(--itm-text)',
                outlineColor: 'var(--itm-red)',
              }}>
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#fef2f2', color: 'var(--itm-red)' }}>
                <Grid2X2 size={19} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="text-xs font-bold">Tout voir</span>
            </button>

            {topCategories.map((category) => {
              const Icon = CATEGORY_ICONS[category.iconName];
              const active = activeCatId === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => navigate({ type: 'catalogue', categoryId: category.id })}
                  className={`flex-shrink-0 min-w-[156px] lg:min-w-0 lg:flex-1 flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-1 ${
                    active ? 'shadow-sm' : 'hover:bg-gray-50'
                  }`}
                  style={{
                    borderColor: active ? 'var(--itm-red)' : 'var(--itm-border)',
                    background: active ? '#fff5f5' : '#fff',
                    color: active ? 'var(--itm-red)' : 'var(--itm-text)',
                    outlineColor: 'var(--itm-red)',
                  }}>
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: active ? 'var(--itm-red)' : '#fef2f2',
                      color: active ? '#fff' : 'var(--itm-red)',
                    }}>
                    {Icon && <Icon size={19} strokeWidth={1.8} aria-hidden="true" />}
                  </span>
                  <span className="text-xs font-bold leading-tight">{category.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => navigate({ type: 'catalogue', categoryId: TEMPS_FORT.categoryId })}
              className="flex-shrink-0 min-w-[170px] lg:min-w-0 lg:flex-1 flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-1"
              style={{
                borderColor: activeCatId === TEMPS_FORT.categoryId ? 'var(--itm-red)' : 'var(--itm-border)',
                background: activeCatId === TEMPS_FORT.categoryId ? '#fff5f5' : '#fff',
                color: 'var(--itm-red)',
                outlineColor: 'var(--itm-red)',
              }}>
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                style={{ background: 'var(--itm-red)' }}>
                <Sparkles size={19} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="text-xs font-black leading-tight">Fêtes de fin d’année</span>
            </button>
          </div>
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-1 w-10 lg:hidden"
            style={{ background: 'linear-gradient(to left, #fff 20%, rgba(255,255,255,0))' }}
            aria-hidden="true"
          />
        </div>
      </div>

      {activeCategory && (
        <div style={{ background: 'var(--itm-gray-bg)', borderTop: '1px solid var(--itm-border)' }}>
          <div className="max-w-screen-xl mx-auto px-3 py-2.5">
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs font-black uppercase tracking-wider flex-shrink-0">
                {activeCategory.label}
              </span>
              <div className="relative min-w-0 flex-1">
                <div className="flex gap-2 overflow-x-auto pr-8" style={{ scrollbarWidth: 'none' }}>
                  <button
                    onClick={() => navigate({ type: 'catalogue', categoryId: activeCategory.id })}
                    className={`flex-shrink-0 px-3 py-2 rounded-full border text-xs font-bold transition-colors ${
                      !activeSubcategoryId ? 'text-white' : 'bg-white hover:border-gray-300'
                    }`}
                    style={{
                      background: !activeSubcategoryId ? 'var(--itm-red)' : '#fff',
                      borderColor: !activeSubcategoryId ? 'var(--itm-red)' : 'var(--itm-border)',
                      color: !activeSubcategoryId ? '#fff' : 'var(--itm-text-light)',
                    }}>
                    Tous
                  </button>
                  {activeCategory.subcategories.map((subcategory) => {
                    const active = activeSubcategoryId === subcategory.id;
                    return (
                      <button
                        key={subcategory.id}
                        onClick={() => navigate({
                          type: 'catalogue',
                          categoryId: activeCategory.id,
                          subcategoryId: subcategory.id,
                        })}
                        className="flex-shrink-0 px-3 py-2 rounded-full border text-xs font-bold transition-colors hover:border-gray-300"
                        style={{
                          background: active ? 'var(--itm-red)' : '#fff',
                          borderColor: active ? 'var(--itm-red)' : 'var(--itm-border)',
                          color: active ? '#fff' : 'var(--itm-text-light)',
                        }}>
                        {subcategory.label}
                      </button>
                    );
                  })}
                </div>
                <div
                  className="pointer-events-none absolute right-0 top-0 bottom-0 w-8"
                  style={{ background: 'linear-gradient(to left, var(--itm-gray-bg), rgba(245,245,245,0))' }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
