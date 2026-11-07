import { NavigateFn } from '../types/navigation';

interface FooterProps {
  navigate: NavigateFn;
}

export default function Footer({ navigate }: FooterProps) {
  const editorialLinks: { label: string; section: Parameters<typeof navigate>[0] }[] = [
    { label: 'Notre magasin', section: { type: 'editorial', section: 'notre-magasin' } },
    { label: 'Notre équipe Traiteur', section: { type: 'editorial', section: 'notre-equipe' } },
    { label: 'Notre savoir-faire', section: { type: 'editorial', section: 'savoir-faire' } },
    { label: 'Nos producteurs', section: { type: 'editorial', section: 'producteurs' } },
    { label: 'Nos engagements', section: { type: 'editorial', section: 'engagements' } },
    { label: 'Galerie', section: { type: 'editorial', section: 'galerie' } },
  ];

  const commandeLinks: { label: string; section: Parameters<typeof navigate>[0] }[] = [
    { label: 'Catalogue traiteur', section: { type: 'catalogue' } },
    { label: 'Retrait en magasin', section: { type: 'catalogue' } },
    { label: 'Drive', section: { type: 'catalogue' } },
    { label: 'Comment commander', section: { type: 'catalogue' } },
  ];

  const legalLinks = [
    { label: 'CGV', href: '#' },
    { label: 'Mentions légales', href: '#' },
    { label: 'Politique de confidentialité', href: '#' },
    { label: 'Accessibilité', href: '#' },
  ];

  return (
    <footer style={{ background: 'var(--itm-footer-bg)' }}>
      <div className="max-w-screen-xl mx-auto px-3 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Editorial links */}
          <div>
            <h3 className="typo-footer-head mb-4">Notre magasin</h3>
            <ul className="space-y-2">
              {editorialLinks.map(({ label, section }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(section)}
                    className="text-xs hover:text-white transition-colors text-left"
                    style={{ color: 'var(--itm-footer-text)' }}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Commande links */}
          <div>
            <h3 className="typo-footer-head mb-4">Commander</h3>
            <ul className="space-y-2">
              {commandeLinks.map(({ label, section }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(section)}
                    className="text-xs hover:text-white transition-colors text-left"
                    style={{ color: 'var(--itm-footer-text)' }}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="typo-footer-head mb-4">Informations légales</h3>
            <ul className="space-y-2">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-xs hover:text-white transition-colors" style={{ color: 'var(--itm-footer-text)' }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-0 mb-4">
              <span className="font-black text-lg italic leading-none" style={{ color: 'var(--itm-red-on-dark)' }}>Inter</span>
              <span className="font-black text-lg leading-none text-white">marché</span>
            </div>
            <p className="text-xs mb-5 leading-relaxed" style={{ color: 'var(--itm-footer-text)' }}>
              Votre traiteur de confiance,<br />au cœur de votre quartier.
            </p>
            <p className="text-xs font-semibold text-white mb-2">Suivez-nous !</p>
            <div className="flex gap-2">
              {[
                { label: 'f', title: 'Facebook' },
                { label: '𝕏', title: 'X' },
                { label: 'ig', title: 'Instagram' },
              ].map(({ label, title }) => (
                <a key={title} href="#" title={title}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <span className="text-xs font-bold text-white">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legal band */}
      <div style={{ background: '#111111' }} className="py-4">
        <div className="max-w-screen-xl mx-auto px-3">
          <p className="text-xs text-center leading-loose" style={{ color: 'var(--itm-footer-text)' }}>
            CGV&nbsp;•&nbsp;Mentions légales&nbsp;•&nbsp;Politique de confidentialité&nbsp;•&nbsp;Accessibilité
          </p>
          <p className="text-xs text-center mt-1" style={{ color: 'var(--itm-footer-text)' }}>
            © {new Date().getFullYear()} Intermarché – Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
