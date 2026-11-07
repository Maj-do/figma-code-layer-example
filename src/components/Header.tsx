import { useState, useRef, useEffect } from 'react';
import { CircleHelp, ChefHat, MapPin, Search } from 'lucide-react';
import { Store } from '../data/stores';
import { NavigateFn, Page } from '../types/navigation';
import { User } from '../types/auth';

interface HeaderProps {
  store: Store;
  navigate: NavigateFn;
  currentPage: Page;
  cartCount?: number;
  currentUser?: User | null;
  onLogout?: () => void;
}

export default function Header({ store, navigate, currentPage, cartCount = 0, currentUser, onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <header className="bg-white sticky top-0 z-50" style={{ borderBottom: '1px solid var(--itm-border)' }}>
      <div className="max-w-screen-xl mx-auto px-3 h-[60px] md:h-[68px] flex items-center gap-3 md:gap-4">

        {/* Logo */}
        <button
          onClick={() => navigate({ type: 'home' })}
          aria-label="Accueil Intermarché Traiteur"
          className="flex-shrink-0 flex items-baseline gap-0 mr-1">
          <span className="font-black text-[24px] leading-none italic" style={{ color: 'var(--itm-red)' }}>Inter</span>
          <span className="font-black text-[24px] leading-none">marché</span>
        </button>

        {/* Store location pill */}
        <button
          onClick={() => navigate({ type: 'editorial' })}
          aria-label={`Magasin : ${store.name}, ${store.city}`}
          className="hidden sm:flex flex-shrink-0 items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: 'var(--itm-red)' }}>
          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="max-w-[90px] truncate">{store.city}</span>
          <svg className="w-3 h-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Secondary nav icons */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => navigate({ type: 'catalogue' })}
            aria-label="Voir le catalogue traiteur"
            className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded hover:bg-gray-100 transition-colors min-w-[52px] focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: 'var(--itm-red)' }}>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs text-gray-600 leading-none">Catalogue</span>
          </button>
          <button
            onClick={() => navigate({ type: 'editorial' })}
            aria-label="Découvrir nos offres et notre magasin"
            className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded hover:bg-gray-100 transition-colors min-w-[52px] focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: 'var(--itm-red)' }}>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-xs text-gray-600 leading-none">Nos offres</span>
          </button>
        </div>

        {/* Search */}
        <div className="hidden sm:block flex-1 min-w-0 mx-1">
          <div className="flex items-center h-11 border rounded-full overflow-hidden bg-white" style={{ borderColor: '#c8c8c8' }}>
            <div className="flex items-center gap-1.5 px-3 border-r flex-shrink-0" style={{ borderColor: '#c8c8c8', height: '100%' }}>
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
              <span className="text-xs font-semibold text-gray-600">Rayons</span>
            </div>
            <input
              type="text"
              placeholder="Rechercher un produit traiteur..."
              aria-label="Rechercher un produit traiteur"
              className="flex-1 px-3 text-sm outline-none bg-transparent min-w-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  navigate({ type: 'catalogue' });
                }
              }}
            />
            <button
              aria-label="Lancer la recherche"
              className="px-3 h-full flex items-center text-gray-500 hover:text-gray-700 flex-shrink-0 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate({ type: 'catalogue' })}
          aria-label="Rechercher un produit"
          className="sm:hidden ml-auto w-11 h-11 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: 'var(--itm-red)' }}>
          <Search size={22} strokeWidth={1.7} aria-hidden="true" />
        </button>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          {currentUser ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                aria-label={`Mon compte — ${currentUser.firstName}`}
                className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded hover:bg-gray-100 transition-colors min-w-[44px] focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: 'var(--itm-red)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{ background: 'var(--itm-red)' }}>
                  {currentUser.firstName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-gray-600 leading-none max-w-[52px] truncate">{currentUser.firstName}</span>
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border z-[60]"
                  style={{ borderColor: 'var(--itm-border)' }}>
                  <button
                    role="menuitem"
                    onClick={() => { navigate({ type: 'account', tab: 'orders' }); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors focus-visible:bg-gray-50"
                    style={{ color: 'var(--itm-text)' }}>
                    Mes commandes
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { navigate({ type: 'account', tab: 'info' }); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors focus-visible:bg-gray-50"
                    style={{ color: 'var(--itm-text)' }}>
                    Mes informations
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { navigate({ type: 'account', tab: 'addresses' }); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors focus-visible:bg-gray-50"
                    style={{ color: 'var(--itm-text)' }}>
                    Mes adresses
                  </button>
                  <div style={{ borderTop: '1px solid var(--itm-border)' }}>
                    <button
                      role="menuitem"
                      onClick={() => { onLogout?.(); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors focus-visible:bg-gray-50"
                      style={{ color: 'var(--itm-red)' }}>
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate({ type: 'login' })}
              aria-label="Se connecter à mon compte"
              className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded hover:bg-gray-100 transition-colors min-w-[44px] focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: 'var(--itm-red)' }}>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs text-gray-600 leading-none">Connexion</span>
            </button>
          )}

          <button
            onClick={() => navigate({ type: 'cart' })}
            aria-label={cartCount > 0 ? `Mon panier, ${cartCount} article${cartCount > 1 ? 's' : ''}` : 'Mon panier'}
            className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded hover:bg-gray-100 transition-colors min-w-[44px] focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: 'var(--itm-red)' }}>
            <div className="relative">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-xs font-bold text-white flex items-center justify-center" style={{ background: 'var(--itm-red)' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-600 leading-none">Panier</span>
          </button>
        </div>
      </div>

      <nav
        aria-label="Services du magasin"
        className="border-t bg-white"
        style={{ borderColor: 'var(--itm-border)' }}>
        <div className="max-w-screen-xl mx-auto h-10 md:h-11 px-3 flex items-center justify-between sm:justify-start gap-1 sm:gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <span
            className="hidden sm:block text-xs font-black uppercase tracking-wider pr-3 mr-auto whitespace-nowrap"
            style={{ color: 'var(--itm-text)' }}>
            Services magasin
          </span>
          <button
            onClick={() => navigate({ type: 'editorial', section: 'notre-magasin' })}
            className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 h-8 px-2 sm:px-3 rounded-full text-xs font-semibold transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-1"
            style={{
              color: currentPage.type === 'editorial' && (!currentPage.section || currentPage.section === 'notre-magasin')
                ? 'var(--itm-red)'
                : 'var(--itm-text-light)',
              outlineColor: 'var(--itm-red)',
            }}>
            <MapPin size={17} strokeWidth={1.8} aria-hidden="true" />
            <span className="sm:hidden">Magasin</span>
            <span className="hidden sm:inline">Trouver un magasin</span>
          </button>
          <button
            onClick={() => navigate({ type: 'editorial', section: 'savoir-faire' })}
            className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 h-8 px-2 sm:px-3 rounded-full text-xs font-semibold transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-1"
            style={{
              color: currentPage.type === 'editorial' && currentPage.section === 'savoir-faire'
                ? 'var(--itm-red)'
                : 'var(--itm-text-light)',
              outlineColor: 'var(--itm-red)',
            }}>
            <ChefHat size={17} strokeWidth={1.8} aria-hidden="true" />
            <span className="sm:hidden">Savoir-faire</span>
            <span className="hidden sm:inline">Notre savoir-faire</span>
          </button>
          <button
            onClick={() => navigate({ type: 'help' })}
            className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 h-8 px-2 sm:px-3 rounded-full text-xs font-semibold transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-1"
            style={{
              color: currentPage.type === 'help' ? 'var(--itm-red)' : 'var(--itm-text-light)',
              outlineColor: 'var(--itm-red)',
            }}>
            <CircleHelp size={17} strokeWidth={1.8} aria-hidden="true" />
            <span className="sm:hidden">Aide</span>
            <span className="hidden sm:inline">Aide et contact</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
