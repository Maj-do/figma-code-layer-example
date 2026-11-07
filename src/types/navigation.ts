export type AccountTab = 'orders' | 'info' | 'addresses';

export type EditorialSection =
  | 'notre-magasin'
  | 'notre-equipe'
  | 'savoir-faire'
  | 'producteurs'
  | 'engagements'
  | 'galerie';

export type Page =
  | { type: 'home' }
  | { type: 'catalogue'; categoryId?: string; subcategoryId?: string }
  | { type: 'product'; productId: string }
  | { type: 'cart' }
  | { type: 'checkout' }
  | { type: 'confirmation'; orderRef: string }
  | { type: 'tracking'; orderRef: string }
  | { type: 'login'; returnTo?: Page }
  | { type: 'signup'; returnTo?: Page }
  | { type: 'forgot-password' }
  | { type: 'help' }
  | { type: 'account'; tab?: AccountTab }
  | { type: 'editorial'; section?: EditorialSection };

export type NavigateFn = (page: Page) => void;
