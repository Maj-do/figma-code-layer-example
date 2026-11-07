import { useState } from 'react';
import { NavigateFn, Page } from '../types/navigation';
import { User, mockLogin } from '../types/auth';

interface LoginPageProps {
  navigate: NavigateFn;
  returnTo?: Page;
  onLogin: (user: User) => void;
}

export default function LoginPage({ navigate, returnTo, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setSubmitting(true);
    // Simulate a small network delay for realism
    await new Promise((r) => setTimeout(r, 600));
    const user = mockLogin(email.trim(), password);
    setSubmitting(false);
    if (!user) {
      setError('E-mail ou mot de passe incorrect.');
      return;
    }
    onLogin(user);
    navigate(returnTo ?? { type: 'home' });
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12" style={{ background: 'var(--itm-gray-bg)' }}>
      <div className="w-full max-w-md">
        {/* Logo back link */}
        <button
          onClick={() => navigate({ type: 'home' })}
          className="flex items-baseline gap-0 mb-8">
          <span className="font-black text-[24px] leading-none italic" style={{ color: 'var(--itm-red)' }}>Inter</span>
          <span className="font-black text-[24px] leading-none">marché</span>
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid var(--itm-border)' }}>
          <h1 className="typo-page-title mb-1" style={{ color: 'var(--itm-text)' }}>Connexion</h1>
          <p className="typo-meta mb-6" style={{ color: 'var(--itm-text-light)' }}>
            Accédez à votre espace client traiteur.
          </p>

          {/* Demo hint */}
          <div className="mb-5 p-3 rounded-lg typo-caption" style={{ background: '#fef9c3', border: '1px solid #fde68a', color: '#92400e' }}>
            Compte de démonstration :{' '}
            <code className="font-mono bg-yellow-100 px-1 rounded">test@example.com</code> / <code className="font-mono bg-yellow-100 px-1 rounded">Test1234</code>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block typo-meta font-semibold mb-1">
                Adresse e-mail <span style={{ color: 'var(--itm-red)' }}>*</span>
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="Ex. : test@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                style={{ borderColor: error ? '#e2001a' : '#c8c8c8' }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block typo-meta font-semibold">
                  Mot de passe <span style={{ color: 'var(--itm-red)' }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate({ type: 'forgot-password' })}
                  className="typo-caption font-semibold hover:underline"
                  style={{ color: 'var(--itm-red)' }}>
                  Mot de passe oublié ?
                </button>
              </div>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                style={{ borderColor: error ? '#e2001a' : '#c8c8c8' }}
              />
            </div>

            {error && (
              <p className="typo-meta font-medium" style={{ color: 'var(--itm-red)' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full typo-btn py-3 rounded-xl text-white font-bold transition-opacity"
              style={{ background: submitting ? '#aaa' : 'var(--itm-red)', cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Connexion en cours…' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: 'var(--itm-border)' }}>
            <p className="typo-meta" style={{ color: 'var(--itm-text-light)' }}>
              Pas encore de compte ?{' '}
              <button
                onClick={() => navigate({ type: 'signup', returnTo })}
                className="font-semibold hover:underline"
                style={{ color: 'var(--itm-red)' }}>
                Créer un compte
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
