import { useState } from 'react';
import { Mail } from 'lucide-react';
import { NavigateFn } from '../types/navigation';

interface ForgotPasswordPageProps {
  navigate: NavigateFn;
}

export default function ForgotPasswordPage({ navigate }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Adresse e-mail invalide.');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12" style={{ background: 'var(--itm-gray-bg)' }}>
      <div className="w-full max-w-md">
        <button onClick={() => navigate({ type: 'home' })} className="flex items-baseline gap-0 mb-8">
          <span className="font-black text-[24px] leading-none italic" style={{ color: 'var(--itm-red)' }}>Inter</span>
          <span className="font-black text-[24px] leading-none">marché</span>
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid var(--itm-border)' }}>
          {sent ? (
            /* ── Confirmation screen ── */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}>
                <Mail size={32} strokeWidth={1.5} className="text-green-600" />
              </div>
              <h1 className="typo-page-title mb-2" style={{ color: 'var(--itm-text)' }}>E-mail envoyé</h1>
              <p className="typo-meta mb-2" style={{ color: 'var(--itm-text-light)' }}>
                Si un compte existe pour <strong>{email}</strong>, vous recevrez un e-mail avec les instructions de réinitialisation.
              </p>
              <p className="typo-caption mb-6" style={{ color: 'var(--itm-text-light)' }}>
                Vérifiez vos spams si vous ne voyez rien dans les prochaines minutes.
              </p>
              <button
                onClick={() => navigate({ type: 'login' })}
                className="typo-btn px-6 py-3 rounded-xl text-white font-bold"
                style={{ background: 'var(--itm-red)' }}>
                Retour à la connexion
              </button>
            </div>
          ) : (
            /* ── Email entry screen ── */
            <>
              <button
                type="button"
                onClick={() => navigate({ type: 'login' })}
                className="flex items-center gap-1 typo-meta font-semibold mb-5 hover:underline"
                style={{ color: 'var(--itm-red)' }}>
                ← Retour
              </button>
              <h1 className="typo-page-title mb-1" style={{ color: 'var(--itm-text)' }}>Mot de passe oublié</h1>
              <p className="typo-meta mb-6" style={{ color: 'var(--itm-text-light)' }}>
                Entrez votre adresse e-mail et nous vous enverrons un lien de réinitialisation.
              </p>

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
                    className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
                    style={{ borderColor: error ? '#e2001a' : '#c8c8c8' }}
                  />
                  {error && <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full typo-btn py-3 rounded-xl text-white font-bold"
                  style={{ background: submitting ? '#aaa' : 'var(--itm-red)', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                  {submitting ? 'Envoi en cours…' : 'Réinitialiser mon mot de passe'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
