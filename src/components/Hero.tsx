import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Search,
  ShoppingCart,
} from 'lucide-react';
import { products, Product } from '../data/catalogue';
import { NavigateFn } from '../types/navigation';

interface HeroProps {
  storeName: string;
  navigate: NavigateFn;
}

const INFOGRAPHIC_IMAGE =
  'https://images.unsplash.com/photo-1555244162-803834f70033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=82&w=1600';

const PROMOTED_PRODUCT_IDS = [
  'formule-noel-duo',
  'cocktail-dinatoire',
  'plateau-fruits-mer',
];

const ORDER_STEPS = [
  { Icon: Search, title: 'Choisissez vos produits', text: 'Explorez le catalogue traiteur.' },
  { Icon: ShoppingCart, title: 'Ajoutez au panier', text: 'Ajustez les quantités en direct.' },
  { Icon: CalendarDays, title: 'Choisissez votre retrait', text: 'Sélectionnez une date et un mode.' },
  { Icon: CreditCard, title: 'Payez en ligne', text: 'Validez votre commande en toute simplicité.' },
];

type Slide =
  | { type: 'product'; product: Product; eyebrow: string }
  | { type: 'steps' };

export default function Hero({ storeName, navigate }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const slides = useMemo<Slide[]>(() => {
    const productSlides = PROMOTED_PRODUCT_IDS
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is Product => Boolean(product))
      .map((product, index) => ({
        type: 'product' as const,
        product,
        eyebrow: index === 0 ? 'Menu de saison' : index === 1 ? 'Nouveauté traiteur' : 'Sélection festive',
      }));
    return [...productSlides, { type: 'steps' as const }];
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [paused, reducedMotion, slides.length]);

  const showSlide = (index: number) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  return (
    <section className="max-w-screen-xl mx-auto px-3 py-3">
      <div
        className="hero-carousel relative h-[600px] sm:h-[560px] lg:h-[580px] rounded-2xl overflow-hidden bg-black shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: 'var(--itm-red)' }}
        data-paused={paused}
        data-reduced-motion={reducedMotion}
        role="region"
        aria-roledescription="carousel"
        aria-label="Sélections et services traiteur"
        aria-live={paused || reducedMotion ? 'polite' : 'off'}
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showSlide(activeSlide - 1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            showSlide(activeSlide + 1);
          }
        }}>
        {slides.map((slide, index) => {
          const active = index === activeSlide;
          const imageUrl = slide.type === 'product' ? slide.product.imageUrl : INFOGRAPHIC_IMAGE;
          return (
            <article
              key={slide.type === 'product' ? slide.product.id : 'how-it-works'}
              className={`hero-slide absolute inset-0 ${active ? 'is-active' : 'pointer-events-none'}`}
              aria-hidden={!active}>
              <img
                src={imageUrl}
                alt=""
                className="hero-slide-image absolute inset-0 w-full h-full object-cover"
                onError={(event) => { event.currentTarget.style.opacity = '0'; }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: slide.type === 'steps'
                    ? 'linear-gradient(115deg, rgba(0, 0, 0, 0.94), rgba(0, 0, 0, 0.76))'
                    : 'linear-gradient(90deg, rgba(8, 8, 8, 0.92) 0%, rgba(8, 8, 8, 0.68) 46%, rgba(8, 8, 8, 0.08) 82%), linear-gradient(0deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0) 62%)',
                }}
              />

              {slide.type === 'product' ? (
                <div className="relative z-10 h-full flex items-end sm:items-center p-7 sm:p-12 lg:px-24 lg:py-16">
                  <div className="max-w-2xl text-white pb-12 sm:pb-0">
                    <p className="hero-reveal hero-delay-1 text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--itm-red-on-dark)' }}>
                      {slide.eyebrow} · {storeName}
                    </p>
                    <h1 className="hero-reveal hero-delay-2 typo-page-title mb-5 max-w-xl">{slide.product.name}</h1>
                    <p className="hero-reveal hero-delay-3 text-base leading-relaxed mb-6 max-w-xl text-white">
                      {slide.product.shortDescription}
                    </p>
                    <div className="hero-reveal hero-delay-4 flex flex-wrap items-center gap-5">
                      <p className="text-xl font-black">{slide.product.priceLabel} €</p>
                      <button
                        onClick={() => navigate({ type: 'product', productId: slide.product.id })}
                        className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{ color: 'var(--itm-text)', outlineColor: '#fff' }}>
                        Découvrir ce produit
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 h-full p-7 sm:p-12 lg:px-24 lg:py-16 text-white flex flex-col justify-center">
                  <div className="max-w-3xl mb-6">
                    <p className="hero-reveal hero-delay-1 text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--itm-red-on-dark)' }}>
                      Commander en ligne
                    </p>
                    <h2 className="hero-reveal hero-delay-2 typo-page-title mb-2">Comment ça marche ?</h2>
                    <p className="hero-reveal hero-delay-3 text-sm text-white">Quatre étapes simples, de votre sélection au retrait en magasin.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {ORDER_STEPS.map(({ Icon, title, text }, stepIndex) => (
                      <div
                        key={title}
                        className="hero-reveal flex sm:flex-col items-center sm:items-start gap-3 rounded-xl p-3 sm:p-4 shadow-sm"
                        style={{
                          background: 'rgba(255,255,255,0.94)',
                          color: 'var(--itm-text)',
                          animationDelay: `${180 + stepIndex * 70}ms`,
                        }}>
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                          style={{ background: 'var(--itm-red)' }}>
                          <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs font-black mb-0.5">
                            <span style={{ color: 'var(--itm-red)' }}>{stepIndex + 1}.</span> {title}
                          </p>
                          <p className="typo-caption leading-snug">{text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="absolute top-3 right-4 text-xs text-white">
                    Photo : Saile Ilyas / Unsplash
                  </p>
                </div>
              )}
            </article>
          );
        })}

        <button
          type="button"
          onClick={() => showSlide(activeSlide - 1)}
          className="hero-arrow hidden sm:flex absolute z-20 left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center text-white focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: '#fff' }}
          aria-label="Diapositive précédente">
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => showSlide(activeSlide + 1)}
          className="hero-arrow hidden sm:flex absolute z-20 right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center text-white focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: '#fff' }}
          aria-label="Diapositive suivante">
          <ChevronRight size={24} aria-hidden="true" />
        </button>

        <div className="absolute z-20 left-1/2 bottom-5 -translate-x-1/2 flex items-center gap-2.5 rounded-full px-3 py-2"
          style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(8px)' }}>
          {slides.map((slide, index) => (
            <button
              key={slide.type === 'product' ? slide.product.id : 'steps-dot'}
              type="button"
              onClick={() => showSlide(index)}
              className={`hero-dot ${index === activeSlide ? 'is-active' : ''}`}
              aria-label={`Afficher la diapositive ${index + 1}`}
              aria-current={index === activeSlide ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
