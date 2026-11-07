import { useState, useCallback, useEffect } from 'react';
import { stores } from './data/stores';
import { Page, NavigateFn } from './types/navigation';
import { CartItem } from './types/cart';
import { User, mockLogin } from './types/auth';
import Header from './components/Header';
import Hero from './components/Hero';
import FulfillmentMethods from './components/FulfillmentMethods';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import ExpertiseBanner from './components/ExpertiseBanner';
import Footer from './components/Footer';
import DemoPanel, { VIEWPORTS } from './components/DemoPanel';
import CataloguePage from './pages/CataloguePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AccountPage from './pages/AccountPage';
import EditorialPage from './pages/EditorialPage';
import HelpContactPage from './pages/HelpContactPage';

export default function App() {
  const [activeStore, setActiveStore] = useState(stores[0]);
  const [viewport, setViewport] = useState('desktop');
  const [currentPage, setCurrentPage] = useState<Page>({ type: 'home' });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const navigate: NavigateFn = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate({ type: 'home' });
  };

  // Used by CheckoutPage's in-flow auth so Header also updates
  const handleInFlowLogin = (email: string, password: string): User | null => {
    const user = mockLogin(email, password);
    if (user) setCurrentUser(user);
    return user;
  };

  // In-flow signup: create a minimal User from supplied details and propagate to Header
  const handleInFlowSignup = (email: string, firstName: string, lastName: string): User => {
    const user: User = { email: email.trim().toLowerCase(), firstName, lastName, phone: '' };
    setCurrentUser(user);
    return user;
  };

  const addToCart = useCallback((productId: string, variant?: string, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.findIndex((i) => i.productId === productId && i.variant === variant);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], qty: next[existing].qty + qty };
        return next;
      }
      return [...prev, { productId, variant, qty }];
    });
  }, []);

  const updateCartQty = useCallback((productId: string, variant: string | undefined, qty: number) => {
    setCartItems((prev) =>
      prev.flatMap((item) => {
        if (item.productId !== productId || item.variant !== variant) return [item];
        return qty > 0 ? [{ ...item, qty }] : [];
      })
    );
  }, []);

  const removeFromCart = useCallback((productId: string, variant: string | undefined) => {
    setCartItems((prev) => prev.filter((i) => !(i.productId === productId && i.variant === variant)));
  }, []);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const handleOrderConfirmed = (orderRef: string) => {
    setCartItems([]);
    navigate({ type: 'confirmation', orderRef });
  };

  const vp = VIEWPORTS.find((v) => v.id === viewport);
  const maxWidth = vp?.width ?? '100%';
  const isConstrained = maxWidth !== '100%';

  const noFooterPages: Page['type'][] = ['cart', 'checkout', 'confirmation', 'tracking', 'login', 'signup', 'forgot-password', 'account'];
  const showFooter = !noFooterPages.includes(currentPage.type);

  // Protect the account page — redirect to login with returnTo
  const resolvedPage: Page =
    currentPage.type === 'account' && !currentUser
      ? { type: 'login', returnTo: currentPage }
      : currentPage;

  // Per-route document title
  useEffect(() => {
    const base = `${activeStore.name} — Traiteur`;
    const titles: Partial<Record<Page['type'], string>> = {
      home: base,
      catalogue: `Catalogue traiteur — ${activeStore.city}`,
      product: 'Produit',
      cart: 'Mon panier',
      checkout: 'Commander',
      confirmation: 'Commande confirmée',
      tracking: 'Suivi de commande',
      login: 'Connexion',
      signup: 'Créer un compte',
      'forgot-password': 'Mot de passe oublié',
      help: 'Aide et contact',
      account: 'Mon compte',
      editorial: 'Notre magasin',
    };
    document.title = titles[resolvedPage.type] ?? base;
  }, [resolvedPage.type, activeStore]);

  return (
    <div className={`min-h-screen bg-white ${isConstrained ? 'flex justify-center items-start bg-gray-200' : ''}`}>
      <div
        className="w-full bg-white overflow-x-clip transition-all duration-300 origin-top"
        style={{ maxWidth, minHeight: '100vh', boxShadow: isConstrained ? '0 0 0 1px rgba(0,0,0,0.1), 0 4px 24px rgba(0,0,0,0.15)' : 'none' }}>

        <Header
          store={activeStore}
          navigate={navigate}
          currentPage={resolvedPage}
          cartCount={cartCount}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {resolvedPage.type === 'home' && (
          <main>
            <Hero storeName={activeStore.name} navigate={navigate} />
            <Categories navigate={navigate} />
            <FeaturedProducts
              navigate={navigate}
              cartItems={cartItems}
              addToCart={addToCart}
              updateCartQty={updateCartQty}
            />
            <ExpertiseBanner navigate={navigate} />
            <FulfillmentMethods methods={activeStore.methods} />
          </main>
        )}

        {resolvedPage.type === 'catalogue' && (
          <CataloguePage
            currentPage={resolvedPage}
            navigate={navigate}
            cartItems={cartItems}
            addToCart={addToCart}
            updateCartQty={updateCartQty}
          />
        )}

        {resolvedPage.type === 'product' && (
          <ProductDetailPage
            productId={resolvedPage.productId}
            currentPage={resolvedPage}
            navigate={navigate}
            cartItems={cartItems}
            addToCart={addToCart}
            updateCartQty={updateCartQty}
          />
        )}

        {resolvedPage.type === 'cart' && (
          <CartPage
            cartItems={cartItems}
            onUpdateQty={updateCartQty}
            onRemove={removeFromCart}
            navigate={navigate}
            store={activeStore}
          />
        )}

        {resolvedPage.type === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            navigate={navigate}
            store={activeStore}
            currentUser={currentUser}
            onInFlowLogin={handleInFlowLogin}
            onInFlowSignup={handleInFlowSignup}
            onOrderConfirmed={handleOrderConfirmed}
          />
        )}

        {resolvedPage.type === 'confirmation' && (
          <ConfirmationPage orderRef={resolvedPage.orderRef} navigate={navigate} />
        )}

        {resolvedPage.type === 'tracking' && (
          <OrderTrackingPage orderRef={resolvedPage.orderRef} navigate={navigate} />
        )}

        {resolvedPage.type === 'login' && (
          <LoginPage
            navigate={navigate}
            returnTo={resolvedPage.returnTo}
            onLogin={handleLogin}
          />
        )}

        {resolvedPage.type === 'signup' && (
          <SignupPage
            navigate={navigate}
            returnTo={resolvedPage.returnTo}
            onSignup={handleLogin}
          />
        )}

        {resolvedPage.type === 'forgot-password' && (
          <ForgotPasswordPage navigate={navigate} />
        )}

        {resolvedPage.type === 'account' && currentUser && (
          <AccountPage
            user={currentUser}
            navigate={navigate}
            tab={resolvedPage.tab}
            onLogout={handleLogout}
            addToCart={addToCart}
          />
        )}

        {resolvedPage.type === 'editorial' && (
          <EditorialPage
            store={activeStore}
            section={resolvedPage.section}
            navigate={navigate}
          />
        )}

        {resolvedPage.type === 'help' && (
          <HelpContactPage store={activeStore} navigate={navigate} />
        )}

        {showFooter && <Footer navigate={navigate} />}
      </div>

      <DemoPanel
        activeStore={activeStore}
        onStoreChange={setActiveStore}
        viewport={viewport}
        onViewportChange={setViewport}
      />
    </div>
  );
}
