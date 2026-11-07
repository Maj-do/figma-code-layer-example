import { ChefHat } from 'lucide-react';
import { NavigateFn } from '../types/navigation';

interface ExpertiseBannerProps {
  navigate: NavigateFn;
}

export default function ExpertiseBanner({ navigate }: ExpertiseBannerProps) {
  return (
    <section className="py-5">
      <div className="max-w-screen-xl mx-auto px-3">
        <div className="relative rounded-lg overflow-hidden" style={{ background: '#1a1a1a' }}>
          {/* Right decorative panel */}
          <div className="absolute right-0 top-0 bottom-0 w-2/5 hidden md:block"
            style={{ background: 'linear-gradient(to left, transparent, #1a1a1a), linear-gradient(135deg, #2d1a1a 0%, #5c1010 100%)', opacity: 0.7 }} />
          <div className="absolute right-4 top-0 bottom-0 w-2/5 hidden md:flex items-center justify-center">
            <ChefHat size={96} strokeWidth={1} className="opacity-20 text-white" />
          </div>

          <div className="relative z-10 px-6 py-7 md:w-3/5">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--itm-red-on-dark)' }}>
              Notre savoir-faire
            </p>
            <h2 className="section-title text-white mb-2 uppercase">
              Découvrir notre équipe<br />et notre expertise
            </h2>
            <p className="text-xs text-inverse-muted mb-4 leading-relaxed max-w-[380px]">
              Rencontrez nos artisans traiteurs, leurs méthodes de préparation et l'histoire derrière chaque recette maison.
            </p>
            <button
              onClick={() => navigate({ type: 'editorial', section: 'notre-equipe' })}
              className="text-xs font-semibold px-5 py-2 rounded border text-white hover:bg-white/10 transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
