import Link from "next/link";

const grilles = [
  {
    categorie: "Anniversaire",
    lignes: [
      { parts: "10-15 parts", prix: "Dès 18 000 F" },
      { parts: "20-25 parts", prix: "Dès 28 000 F" },
      { parts: "30 parts et +", prix: "Dès 40 000 F" },
    ],
  },
  {
    categorie: "Mariage",
    lignes: [
      { parts: "Pièce simple", prix: "Dès 80 000 F" },
      { parts: "Pièce montée 2 étages", prix: "Dès 120 000 F" },
      { parts: "Pièce montée 3 étages et +", prix: "Sur devis" },
    ],
  },
  {
    categorie: "Baptême",
    lignes: [
      { parts: "10-15 parts", prix: "Dès 22 000 F" },
      { parts: "20-25 parts", prix: "Dès 32 000 F" },
    ],
  },
  {
    categorie: "Entreprise / Cupcakes",
    lignes: [
      { parts: "Box de 12 cupcakes", prix: "Dès 12 000 F" },
      { parts: "Box de 24 cupcakes", prix: "Dès 20 000 F" },
      { parts: "Gâteau logo / événement", prix: "Sur devis" },
    ],
  },
];

export default function TarifsPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="text-xl font-medium mb-2">Tarifs indicatifs</h1>
      <p className="text-sm text-foreground/60 mb-8">
        Le prix final dépend de la complexité du design, du nombre de parts et
        des ingrédients choisis. Un devis précis vous est envoyé après votre
        demande de commande.
      </p>

      <div className="flex flex-col gap-6">
        {grilles.map((g) => (
          <div key={g.categorie} className="border border-border rounded-lg overflow-hidden">
            <p className="text-sm font-medium px-4 py-2.5 bg-brand-light">
              {g.categorie}
            </p>
            <table className="w-full text-sm">
              <tbody>
                {g.lignes.map((l) => (
                  <tr key={l.parts} className="border-t border-border">
                    <td className="px-4 py-2.5 text-foreground/70">
                      {l.parts}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium">
                      {l.prix}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/commande"
          className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"
        >
          Demander mon devis personnalisé
        </Link>
      </div>
    </div>
  );
}
