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
import { TEMPS_FORT, topCategories } from '../data/catalogue';
import { NavigateFn } from '../types/navigation';

type LucideComponent = React.ComponentType<LucideProps>;

const CATEGORY_ICONS: Record<string, LucideComponent> = {
  Wine,
  UtensilsCrossed,
  BookOpen,
  LayoutGrid,
  Cake,
};

interface CategoriesProps {
  navigate: NavigateFn;
}

export default function Categories({ navigate }: CategoriesProps) {
  return (
    <section className="py-6 sm:py-7" style={{ background: 'var(--itm-gray-bg)' }}>
      <div className="max-w-screen-xl mx-auto px-3">
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: 'var(--itm-red)' }}>
            Notre carte traiteur
          </p>
          <h2 className="typo-section-title">Explorez nos catégories</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          <button
            onClick={() => navigate({ type: 'catalogue' })}
            className="group min-h-[112px] flex flex-col items-start justify-between gap-3 p-3 rounded-xl bg-white border text-left transition-all hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: 'var(--itm-border)', outlineColor: 'var(--itm-red)' }}>
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: '#fef2f2', color: 'var(--itm-red)' }}>
              <Grid2X2 size={21} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="text-xs font-bold leading-tight">Tout voir</span>
          </button>
          {topCategories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.iconName];
            return (
              <button key={cat.id}
                onClick={() => navigate({ type: 'catalogue', categoryId: cat.id })}
                className="group min-h-[112px] flex flex-col items-start justify-between gap-3 p-3 rounded-xl bg-white border text-left transition-all hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ borderColor: 'var(--itm-border)', outlineColor: 'var(--itm-red)' }}>
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: '#fef2f2', color: 'var(--itm-red)' }}>
                  {Icon && <Icon size={21} strokeWidth={1.8} aria-hidden="true" />}
                </span>
                <span className="text-xs font-bold leading-tight">{cat.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => navigate({ type: 'catalogue', categoryId: TEMPS_FORT.categoryId })}
            className="min-h-[112px] flex flex-col items-start justify-between gap-3 p-3 rounded-xl border text-left transition-all hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: '#fff5f5', borderColor: 'var(--itm-red)', outlineColor: 'var(--itm-red)' }}>
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ background: 'var(--itm-red)' }}>
              <Sparkles size={21} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="text-xs font-black leading-tight" style={{ color: 'var(--itm-red)' }}>
              Fêtes de fin d’année
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
