const points = [
  {
    nom: "Cocody Abatta",
    whatsapp: "https://wa.me/c/22504180507",
  },
  {
    nom: "Yopougon Mosquée du Maroc",
    whatsapp: "https://wa.me/c/22567474717",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-md mx-auto px-5 py-10">
      <h1 className="text-xl font-medium mb-1">Nous contacter</h1>
      <p className="text-sm text-foreground/60 mb-6">
        Deux points de vente à Abidjan, ou commandez en ligne pour une
        livraison à domicile.
      </p>

      <div className="flex flex-col gap-3">
        {points.map((p) => (
          <a
            key={p.nom}
            href={p.whatsapp}
            className="flex items-center justify-between border border-border rounded-lg px-4 py-3 text-sm hover:bg-brand-light"
          >
            <span>
              <span className="block font-medium">{p.nom}</span>
              <span className="text-foreground/60 text-xs">
                Contacter via WhatsApp
              </span>
            </span>
            <span aria-hidden="true">›</span>
          </a>
        ))}
        <a
          href="https://www.facebook.com"
          className="flex items-center justify-between border border-border rounded-lg px-4 py-3 text-sm hover:bg-brand-light"
        >
          <span>
            <span className="block font-medium">Facebook</span>
            <span className="text-foreground/60 text-xs">
              Cake Design pour toutes vos cérémonies
            </span>
          </span>
          <span aria-hidden="true">›</span>
        </a>
      </div>
    </div>
  );
}
