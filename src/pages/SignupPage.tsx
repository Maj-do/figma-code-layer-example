import { useState } from 'react';
import { NavigateFn, Page } from '../types/navigation';
import { User } from '../types/auth';

interface SignupPageProps {
  navigate: NavigateFn;
  returnTo?: Page;
  onSignup: (user: User) => void;
}

function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: '', color: '#e5e7eb' },
    { label: 'Faible', color: '#ef4444' },
    { label: 'Moyen', color: '#f59e0b' },
    { label: 'Bon', color: '#3b82f6' },
    { label: 'Fort', color: '#16a34a' },
  ] as const;
  return { score: score as 0 | 1 | 2 | 3 | 4, label: levels[score].label, color: levels[score].color };
}

export default function SignupPage({ navigate, returnTo, onSignup }: SignupPageProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [cgv, setCgv] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const strength = passwordStrength(password);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'Le prénom est requis.';
    if (!lastName.trim()) e.lastName = 'Le nom est requis.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Adresse e-mail invalide.';
    if (phone && !/^(\+33|0)[0-9 ]{9,14}$/.test(phone.trim())) e.phone = 'Numéro invalide — ex. : 06 12 34 56 78.';
    if (password.length < 8) e.password = 'Au moins 8 caractères requis.';
    if (password !== confirm) e.confirm = 'Les mots de passe ne correspondent pas.';
    if (!cgv) e.cgv = 'Vous devez accepter les conditions générales.';
    return e;
  };

  const blur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate());
  };

  const fieldBorder = (field: string) => {
    if (touched[field] && errors[field]) return '#e2001a';
    const vals: Record<string, string> = { firstName, lastName, email, phone, password, confirm };
    if (touched[field] && !errors[field] && vals[field]?.length > 0) return '#16a34a';
    return '#c8c8c8';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, phone: true, password: true, confirm: true, cgv: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    const user: User = { email: email.trim().toLowerCase(), firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() };
    onSignup(user);
    navigate(returnTo ?? { type: 'home' });
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12" style={{ background: 'var(--itm-gray-bg)' }}>
      <div className="w-full max-w-lg">
        <button onClick={() => navigate({ type: 'home' })} className="flex items-baseline gap-0 mb-8">
          <span className="font-black text-[24px] leading-none italic" style={{ color: 'var(--itm-red)' }}>Inter</span>
          <span className="font-black text-[24px] leading-none">marché</span>
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid var(--itm-border)' }}>
          <h1 className="typo-page-title mb-1" style={{ color: 'var(--itm-text)' }}>Créer un compte</h1>
          <p className="typo-meta mb-6" style={{ color: 'var(--itm-text-light)' }}>
            Rejoignez l'espace traiteur Intermarché.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              {/* First name */}
              <div>
                <label className="block typo-meta font-semibold mb-1">Prénom <span style={{ color: 'var(--itm-red)' }}>*</span></label>
                <input
                  type="text"
                  autoComplete="given-name"
                  placeholder="Ex. : Marie"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); if (touched.firstName) setErrors(validate()); }}
                  onBlur={() => blur('firstName')}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: fieldBorder('firstName') }}
                />
                {touched.firstName && errors.firstName && (
                  <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.firstName}</p>
                )}
              </div>

              {/* Last name */}
              <div>
                <label className="block typo-meta font-semibold mb-1">Nom <span style={{ color: 'var(--itm-red)' }}>*</span></label>
                <input
                  type="text"
                  autoComplete="family-name"
                  placeholder="Ex. : Dupont"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); if (touched.lastName) setErrors(validate()); }}
                  onBlur={() => blur('lastName')}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: fieldBorder('lastName') }}
                />
                {touched.lastName && errors.lastName && (
                  <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block typo-meta font-semibold mb-1">Adresse e-mail <span style={{ color: 'var(--itm-red)' }}>*</span></label>
              <input
                type="email"
                autoComplete="email"
                placeholder="Ex. : marie@exemple.fr"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (touched.email) setErrors(validate()); }}
                onBlur={() => blur('email')}
                className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: fieldBorder('email') }}
              />
              {touched.email && errors.email && (
                <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block typo-meta font-semibold mb-1">Téléphone</label>
              <input
                type="tel"
                autoComplete="tel"
                placeholder="Ex. : 06 12 34 56 78"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (touched.phone) setErrors(validate()); }}
                onBlur={() => blur('phone')}
                className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: fieldBorder('phone') }}
              />
              {touched.phone && errors.phone && (
                <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block typo-meta font-semibold mb-1">Mot de passe <span style={{ color: 'var(--itm-red)' }}>*</span></label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Au moins 8 caractères"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (touched.password) setErrors(validate()); }}
                onBlur={() => blur('password')}
                className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: fieldBorder('password') }}
              />
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-colors duration-200"
                        style={{ background: i <= strength.score ? strength.color : '#e5e7eb' }}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="typo-caption" style={{ color: strength.color }}>{strength.label}</p>
                  )}
                </div>
              )}
              {touched.password && errors.password && (
                <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.password}</p>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block typo-meta font-semibold mb-1">Confirmer le mot de passe <span style={{ color: 'var(--itm-red)' }}>*</span></label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Répétez votre mot de passe"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); if (touched.confirm) setErrors(validate()); }}
                onBlur={() => blur('confirm')}
                className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: fieldBorder('confirm') }}
              />
              {touched.confirm && errors.confirm && (
                <p className="typo-caption mt-1" style={{ color: 'var(--itm-red)' }}>{errors.confirm}</p>
              )}
            </div>

            {/* CGV */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cgv}
                onChange={(e) => { setCgv(e.target.checked); if (touched.cgv) setErrors(validate()); }}
                className="mt-0.5 w-4 h-4 accent-red-600 flex-shrink-0"
              />
              <p className="typo-meta">
                J'accepte les{' '}
                <a href="#" className="underline" style={{ color: 'var(--itm-red)' }}>conditions générales de vente</a>{' '}
                et la politique de confidentialité.
              </p>
            </label>
            {touched.cgv && errors.cgv && (
              <p className="typo-caption" style={{ color: 'var(--itm-red)' }}>{errors.cgv}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full typo-btn py-3 rounded-xl text-white font-bold transition-opacity"
              style={{ background: submitting ? '#aaa' : 'var(--itm-red)', cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Création en cours…' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: 'var(--itm-border)' }}>
            <p className="typo-meta" style={{ color: 'var(--itm-text-light)' }}>
              Déjà un compte ?{' '}
              <button
                onClick={() => navigate({ type: 'login', returnTo })}
                className="font-semibold hover:underline"
                style={{ color: 'var(--itm-red)' }}>
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
