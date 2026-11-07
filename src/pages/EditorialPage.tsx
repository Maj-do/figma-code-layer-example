import { Store as StoreIcon, ChefHat, UtensilsCrossed, Leaf, Recycle, Image, MapPin, Phone, Clock, Utensils, Package, Droplets, Users, Bike, FlaskConical, Waves, type LucideProps } from 'lucide-react';
import { NavigateFn, EditorialSection } from '../types/navigation';
import { Store } from '../data/stores';
import { getEditorialContent, StoreEditorialContent } from '../data/editorial';

type LucideComponent = React.ComponentType<LucideProps>;

// ── Section nav config ─────────────────────────────────────────────────────────

const SECTIONS: { id: EditorialSection; label: string; Icon: LucideComponent }[] = [
  { id: 'notre-magasin', label: 'Notre magasin', Icon: StoreIcon },
  { id: 'notre-equipe', label: 'Notre équipe', Icon: ChefHat },
  { id: 'savoir-faire', label: 'Savoir-faire', Icon: UtensilsCrossed },
  { id: 'producteurs', label: 'Producteurs', Icon: Leaf },
  { id: 'engagements', label: 'Engagements', Icon: Recycle },
  { id: 'galerie', label: 'Galerie', Icon: Image },
];

// Map emoji icon strings from data to Lucide components
const ENGAGEMENT_ICONS: Record<string, LucideComponent> = {
  '♻️': Recycle,
  '🌿': Leaf,
  '🐄': Utensils,
  '🧪': FlaskConical,
  '📦': Package,
  '💧': Droplets,
  '🌊': Waves,
  '🧴': Package,
  '🚲': Bike,
  '🧑‍🤝‍🧑': Users,
};

// ── Shared shell components ────────────────────────────────────────────────────

function SectionNav({
  active,
  navigate,
}: {
  active: EditorialSection;
  navigate: (s: EditorialSection) => void;
}) {
  return (
    <div
      className="sticky top-[var(--header-offset)] z-30 bg-white border-b"
      style={{ borderColor: 'var(--itm-border)' }}>
      <div className="max-w-screen-xl mx-auto px-3">
        <div className="flex items-center gap-0.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(s.id)}
              className="flex items-center gap-1.5 px-3.5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors"
              style={{
                borderBottomColor: active === s.id ? 'var(--itm-red)' : 'transparent',
                color: active === s.id ? 'var(--itm-red)' : 'var(--itm-text-light)',
              }}>
              <s.Icon size={14} strokeWidth={2} />
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiscoverCTA({ navigate }: { navigate: NavigateFn }) {
  return (
    <div
      className="mt-10 py-8 px-6 rounded-2xl text-center"
      style={{ background: 'var(--itm-gray-bg)', border: '1px solid var(--itm-border)' }}>
      <p className="section-title mb-2" style={{ color: 'var(--itm-text)' }}>Envie de commander ?</p>
      <p className="typo-meta mb-5" style={{ color: 'var(--itm-text-light)' }}>
        Parcourez notre carte traiteur et composez votre repas en quelques clics.
      </p>
      <button
        onClick={() => navigate({ type: 'catalogue' })}
        className="typo-btn px-8 py-3 rounded-xl text-white font-bold"
        style={{ background: 'var(--itm-red)' }}>
        Découvrir notre carte →
      </button>
    </div>
  );
}

// ── Section: Notre magasin ────────────────────────────────────────────────────

function SectionMagasin({
  content,
  store,
  navigate,
}: {
  content: StoreEditorialContent['magasin'];
  store: Store;
  navigate: NavigateFn;
}) {
  return (
    <div>
      {/* Hero */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 flex items-end"
        style={{ background: content.heroGradient, minHeight: 280 }}>
        <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none">
          <StoreIcon size={120} strokeWidth={0.75} className="opacity-15 text-white" />
        </div>
        <div className="relative z-10 px-8 py-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {store.city}
          </p>
          <h1 className="typo-page-title text-white mb-3">{content.title}</h1>
          <p className="typo-md text-white/80 leading-relaxed">{content.tagline}</p>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {content.highlights.map((h) => (
          <div
            key={h.label}
            className="bg-white rounded-xl p-4 text-center"
            style={{ border: '1px solid var(--itm-border)' }}>
            <p className="font-black text-2xl mb-0.5" style={{ color: 'var(--itm-red)' }}>{h.value}</p>
            <p className="typo-caption" style={{ color: 'var(--itm-text-light)' }}>{h.label}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="max-w-2xl space-y-5 mb-8">
        {content.story.map((p, i) => (
          <p key={i} className="typo-base leading-relaxed" style={{ color: 'var(--itm-text)' }}>{p}</p>
        ))}
      </div>

      {/* Store info card */}
      <div
        className="bg-white rounded-xl p-5 max-w-sm"
        style={{ border: '1px solid var(--itm-border)' }}>
        <p className="typo-meta font-bold mb-3" style={{ color: 'var(--itm-text)' }}>Informations pratiques</p>
        <div className="space-y-1.5">
          <p className="typo-meta flex items-center gap-1.5" style={{ color: 'var(--itm-text-light)' }}><MapPin size={13} strokeWidth={1.75} className="flex-shrink-0" /> {store.address}</p>
          <p className="typo-meta flex items-center gap-1.5" style={{ color: 'var(--itm-text-light)' }}><Phone size={13} strokeWidth={1.75} className="flex-shrink-0" /> {store.phone}</p>
          {store.hours.map((h) => (
            <p key={h.days} className="typo-meta flex items-center gap-1.5" style={{ color: 'var(--itm-text-light)' }}>
              <Clock size={13} strokeWidth={1.75} className="flex-shrink-0" /> {h.days} : {h.time}
            </p>
          ))}
        </div>
      </div>

      <DiscoverCTA navigate={navigate} />
    </div>
  );
}

// ── Section: Notre équipe ─────────────────────────────────────────────────────

function SectionEquipe({
  content,
  navigate,
}: {
  content: StoreEditorialContent['equipe'];
  navigate: NavigateFn;
}) {
  return (
    <div>
      <h1 className="typo-page-title mb-2" style={{ color: 'var(--itm-text)' }}>Notre équipe Traiteur</h1>
      <p className="typo-md mb-8" style={{ color: 'var(--itm-text-light)' }}>{content.intro}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {content.members.map((m) => (
          <div
            key={m.name}
            className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            style={{ border: '1px solid var(--itm-border)' }}>
            {/* Avatar area */}
            <div
              className="flex items-center justify-center"
              style={{ background: m.avatarColor, height: 140 }}>
              <span className="font-black text-5xl text-white/70 select-none leading-none">
                {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="p-5">
              <p className="font-black text-base mb-0.5" style={{ color: 'var(--itm-text)' }}>{m.name}</p>
              <p className="typo-meta font-semibold mb-3" style={{ color: 'var(--itm-red)' }}>{m.role}</p>
              {m.quote && (
                <blockquote className="typo-caption italic border-l-2 pl-3" style={{ borderColor: 'var(--itm-border)', color: 'var(--itm-text-light)' }}>
                  « {m.quote} »
                </blockquote>
              )}
            </div>
          </div>
        ))}
      </div>

      <DiscoverCTA navigate={navigate} />
    </div>
  );
}

// ── Section: Savoir-faire ─────────────────────────────────────────────────────

function SectionSavoirFaire({
  content,
  navigate,
}: {
  content: StoreEditorialContent['savoirFaire'];
  navigate: NavigateFn;
}) {
  const signature = content.specialties.find((s) => s.isSignature);
  const rest = content.specialties.filter((s) => !s.isSignature);

  return (
    <div>
      {/* Hero banner */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 flex items-center"
        style={{ background: content.heroGradient, minHeight: 200 }}>
        <div className="absolute right-8 top-0 bottom-0 flex items-center">
          <ChefHat size={100} strokeWidth={0.75} className="opacity-20 text-white" />
        </div>
        <div className="relative z-10 px-8 py-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Notre savoir-faire</p>
          <h1 className="typo-page-title text-white mb-2">Ce que nous faisons, nous le faisons nous-mêmes.</h1>
          <p className="typo-meta text-white/70 max-w-xl">{content.intro}</p>
        </div>
      </div>

      {/* Signature specialty — full width */}
      {signature && (
        <div
          className="rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start gap-5"
          style={{ background: `${signature.accentColor}15`, border: `2px solid ${signature.accentColor}30` }}>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: signature.accentColor }}>
            <UtensilsCrossed size={28} strokeWidth={1.5} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-black text-lg" style={{ color: 'var(--itm-text)' }}>{signature.title}</p>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: 'var(--itm-red)' }}>
                Signature
              </span>
            </div>
            <p className="typo-base leading-relaxed" style={{ color: 'var(--itm-text-light)' }}>{signature.description}</p>
          </div>
        </div>
      )}

      {/* Other specialties grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((s) => (
          <div
            key={s.title}
            className="bg-white rounded-xl p-5 hover:shadow-sm transition-shadow"
            style={{ border: '1px solid var(--itm-border)' }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${s.accentColor}15` }}>
              <Utensils size={18} strokeWidth={1.75} style={{ color: s.accentColor }} />
            </div>
            <p className="font-bold text-base mb-1.5" style={{ color: 'var(--itm-text)' }}>{s.title}</p>
            <p className="typo-caption leading-relaxed" style={{ color: 'var(--itm-text-light)' }}>{s.description}</p>
          </div>
        ))}
      </div>

      <DiscoverCTA navigate={navigate} />
    </div>
  );
}

// ── Section: Producteurs & partenaires ───────────────────────────────────────

function SectionProducteurs({
  content,
  navigate,
}: {
  content: StoreEditorialContent['partenaires'];
  navigate: NavigateFn;
}) {
  return (
    <div>
      <h1 className="typo-page-title mb-2" style={{ color: 'var(--itm-text)' }}>Nos producteurs et partenaires locaux</h1>
      <p className="typo-md mb-8" style={{ color: 'var(--itm-text-light)' }}>{content.intro}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.partners.map((p) => (
          <div
            key={p.name}
            className="bg-white rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
            style={{ border: '1px solid var(--itm-border)' }}>
            {/* Logo / identity area */}
            <div
              className="flex items-center justify-center"
              style={{ background: p.bgColor, height: 100 }}>
              <Leaf size={40} strokeWidth={1.25} className="text-white/60" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-black text-base leading-tight" style={{ color: 'var(--itm-text)' }}>{p.name}</p>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--itm-gray-bg)', color: 'var(--itm-text-light)' }}>
                  {p.type}
                </span>
                <span className="typo-caption flex items-center gap-1" style={{ color: 'var(--itm-text-light)' }}><MapPin size={11} strokeWidth={1.75} />{p.origin}</span>
              </div>
              <p className="typo-caption leading-relaxed" style={{ color: 'var(--itm-text-light)' }}>{p.description}</p>
            </div>
          </div>
        ))}
      </div>

      <DiscoverCTA navigate={navigate} />
    </div>
  );
}

// ── Section: Engagements ──────────────────────────────────────────────────────

function SectionEngagements({
  content,
  navigate,
}: {
  content: StoreEditorialContent['engagements'];
  navigate: NavigateFn;
}) {
  return (
    <div>
      <h1 className="typo-page-title mb-2" style={{ color: 'var(--itm-text)' }}>Nos engagements</h1>
      <p className="typo-md mb-8" style={{ color: 'var(--itm-text-light)' }}>{content.intro}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.items.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl p-5"
            style={{ border: '1px solid var(--itm-border)' }}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'var(--itm-gray-bg)' }}>
              {(() => { const Icon = ENGAGEMENT_ICONS[item.icon] ?? Recycle; return <Icon size={22} strokeWidth={1.75} style={{ color: 'var(--itm-text)' }} />; })()}
            </div>
            <p className="font-bold text-base mb-2" style={{ color: 'var(--itm-text)' }}>{item.title}</p>
            <p className="typo-caption leading-relaxed" style={{ color: 'var(--itm-text-light)' }}>{item.text}</p>
          </div>
        ))}
      </div>

      <DiscoverCTA navigate={navigate} />
    </div>
  );
}

// ── Section: Galerie ──────────────────────────────────────────────────────────

function SectionGalerie({
  content,
  navigate,
}: {
  content: StoreEditorialContent['galerie'];
  navigate: NavigateFn;
}) {
  const aspectClass: Record<string, string> = {
    square: 'aspect-square',
    wide: 'col-span-2 aspect-[2/1]',
    tall: 'row-span-2',
  };

  return (
    <div>
      <h1 className="typo-page-title mb-2" style={{ color: 'var(--itm-text)' }}>Galerie photo</h1>
      <p className="typo-md mb-8" style={{ color: 'var(--itm-text-light)' }}>{content.intro}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
        {content.images.map((img, i) => (
          <div
            key={i}
            className={`relative rounded-xl overflow-hidden flex items-end ${aspectClass[img.aspect] ?? 'aspect-square'}`}
            style={{ background: img.color }}>
            {/* Caption overlay */}
            <div
              className="relative z-10 w-full px-3 py-2.5"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
              <p className="typo-caption text-white leading-tight">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>

      <DiscoverCTA navigate={navigate} />
    </div>
  );
}

// ── EditorialPage shell ───────────────────────────────────────────────────────

interface EditorialPageProps {
  store: Store;
  section?: EditorialSection;
  navigate: NavigateFn;
}

export default function EditorialPage({ store, section = 'notre-magasin', navigate }: EditorialPageProps) {
  const content = getEditorialContent(store.id);

  const goSection = (s: EditorialSection) => navigate({ type: 'editorial', section: s });

  return (
    <div className="min-h-screen" style={{ background: 'var(--itm-gray-bg)' }}>
      {/* Sticky section nav */}
      <SectionNav active={section} navigate={goSection} />

      <div className="max-w-screen-xl mx-auto px-3 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 typo-caption mb-6" style={{ color: 'var(--itm-text-light)' }}>
          <button onClick={() => navigate({ type: 'home' })} className="hover:underline">Accueil</button>
          <span>›</span>
          <span className="font-medium" style={{ color: 'var(--itm-text)' }}>
            {SECTIONS.find((s) => s.id === section)?.label ?? 'Notre magasin'}
          </span>
        </nav>

        {section === 'notre-magasin' && (
          <SectionMagasin content={content.magasin} store={store} navigate={navigate} />
        )}
        {section === 'notre-equipe' && (
          <SectionEquipe content={content.equipe} navigate={navigate} />
        )}
        {section === 'savoir-faire' && (
          <SectionSavoirFaire content={content.savoirFaire} navigate={navigate} />
        )}
        {section === 'producteurs' && (
          <SectionProducteurs content={content.partenaires} navigate={navigate} />
        )}
        {section === 'engagements' && (
          <SectionEngagements content={content.engagements} navigate={navigate} />
        )}
        {section === 'galerie' && (
          <SectionGalerie content={content.galerie} navigate={navigate} />
        )}
      </div>
    </div>
  );
}
