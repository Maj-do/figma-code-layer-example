import { ChevronDown, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Store } from '../data/stores';
import { NavigateFn } from '../types/navigation';

interface HelpContactPageProps {
  store: Store;
  navigate: NavigateFn;
}

const FAQ_ITEMS = [
  {
    question: 'Comment modifier ou annuler ma commande ?',
    answer: 'Consultez le suivi de votre commande depuis votre espace client. Les possibilités de modification dépendent du délai de préparation.',
  },
  {
    question: 'Quand puis-je retirer ma commande ?',
    answer: 'Le créneau choisi pendant la commande est rappelé dans votre confirmation et dans votre espace client.',
  },
  {
    question: 'Comment signaler une allergie ?',
    answer: 'Les allergènes sont indiqués sur chaque fiche produit. Pour une demande spécifique, contactez directement votre magasin avant de commander.',
  },
];

export default function HelpContactPage({ store, navigate }: HelpContactPageProps) {
  return (
    <main className="min-h-screen" style={{ background: 'var(--itm-gray-bg)' }}>
      <div className="max-w-screen-xl mx-auto px-3 py-8">
        <nav className="typo-meta mb-5 flex items-center gap-2">
          <button onClick={() => navigate({ type: 'home' })} className="hover:underline">Accueil</button>
          <span>›</span>
          <span className="font-semibold" style={{ color: 'var(--itm-text)' }}>Aide et contact</span>
        </nav>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <section className="bg-white rounded-2xl p-6 md:p-8" style={{ border: '1px solid var(--itm-border)' }}>
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--itm-red)' }}>
              Nous sommes à votre écoute
            </p>
            <h1 className="typo-page-title mb-3">Aide et contact</h1>
            <p className="typo-body mb-8 max-w-2xl">
              Retrouvez les réponses aux questions fréquentes ou contactez directement l’équipe traiteur de votre magasin.
            </p>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, index) => (
                <details
                  key={item.question}
                  className="group rounded-xl bg-white overflow-hidden"
                  style={{ border: '1px solid var(--itm-border)' }}
                  open={index === 0}>
                  <summary className="flex items-center justify-between gap-4 p-4 cursor-pointer list-none font-bold text-sm">
                    {item.question}
                    <ChevronDown size={20} className="flex-shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="typo-body px-4 pb-4">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl p-6 md:p-8 text-white" style={{ background: 'var(--itm-footer-bg)' }}>
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--itm-red-on-dark)' }}>
              Votre point de vente
            </p>
            <h2 className="typo-section-title mb-6">{store.name}</h2>
            <div className="space-y-5">
              <div className="flex gap-3">
                <MapPin size={22} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm">{store.address}</p>
              </div>
              <div className="flex gap-3">
                <Phone size={22} className="flex-shrink-0" aria-hidden="true" />
                <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="text-sm font-semibold hover:underline">
                  {store.phone}
                </a>
              </div>
              <div className="flex gap-3">
                <Mail size={22} className="flex-shrink-0" aria-hidden="true" />
                <a href="mailto:traiteur@example.com" className="text-sm font-semibold hover:underline">
                  traiteur@example.com
                </a>
              </div>
              <div className="flex gap-3">
                <Clock size={22} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  {store.hours.map((schedule) => (
                    <p key={schedule.days} className="text-sm">
                      <strong>{schedule.days}</strong><br />{schedule.time}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate({ type: 'editorial', section: 'notre-magasin' })}
              className="mt-8 w-full rounded-xl py-3 px-4 text-sm font-bold bg-white transition-opacity hover:opacity-90"
              style={{ color: 'var(--itm-text)' }}>
              Voir les informations du magasin
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
