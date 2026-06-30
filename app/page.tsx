import Link from "next/link";

const whatsapp = [
  { label: "WhatsApp — Cocody Abatta", href: "https://wa.me/c/22504180507" },
  {
    label: "WhatsApp — Yopougon Mosquée du Maroc",
    href: "https://wa.me/c/22567474717",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-brand-light">
        <div className="max-w-3xl mx-auto px-5 py-16 text-center">
          <p className="text-xs font-medium text-brand uppercase tracking-wide mb-3">
            Cake design pour toutes vos cérémonies
          </p>
          <h1 className="text-2xl sm:text-3xl font-medium mb-4 leading-snug">
            Des gâteaux uniques, pensés pour chaque histoire
          </h1>
          <p className="text-foreground/70 mb-8 max-w-xl mx-auto leading-relaxed">
            Anniversaires, mariages, baptêmes, entreprise. Choisissez un
            modèle, proposez votre inspiration, ou imaginez avec nous une
            création sur-mesure.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/commande"
              className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"
            >
              Commander maintenant
            </Link>
            <Link
              href="/catalogue"
              className="border border-border px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-background"
            >
              Voir nos créations
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 py-12">
        <p className="text-sm font-medium mb-4">Nous joindre directement</p>
        <div className="flex flex-col gap-3">
          {whatsapp.map((w) => (
            <a
              key={w.href}
              href={w.href}
              className="flex items-center justify-between border border-border rounded-lg px-4 py-3 text-sm hover:bg-brand-light"
            >
              {w.label}
              <span aria-hidden="true">›</span>
            </a>
          ))}
          <a
            href="https://www.facebook.com"
            className="flex items-center justify-between border border-border rounded-lg px-4 py-3 text-sm hover:bg-brand-light"
          >
            Voir nos modèles sur Facebook
            <span aria-hidden="true">›</span>
          </a>
        </div>
      </section>
    </div>
  );
}
