import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const categories = [
  "Toutes",
  "Anniversaire",
  "Mariage",
  "Baptême",
  "Entreprise",
  "Enfant",
  "Cupcakes",
];

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const active = categorie && categorie !== "Toutes" ? categorie : undefined;

  const modeles = await prisma.modele.findMany({
    where: active ? { categorie: active } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-medium">Nos créations</h1>
        <p className="text-sm text-foreground/60">{modeles.length} modèles</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((c) => {
          const isActive = c === "Toutes" ? !active : active === c;
          return (
            <Link
              key={c}
              href={c === "Toutes" ? "/catalogue" : `/catalogue?categorie=${c}`}
              className={`text-sm px-3 py-1.5 rounded-lg border ${
                isActive
                  ? "bg-brand text-white border-brand"
                  : "border-border hover:bg-brand-light"
              }`}
            >
              {c}
            </Link>
          );
        })}
      </div>

      {modeles.length === 0 ? (
        <p className="text-sm text-foreground/60">
          Aucun modèle dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {modeles.map((m) => (
            <div
              key={m.id}
              className="border border-border rounded-lg overflow-hidden"
            >
              <div className="aspect-square bg-brand-light flex items-center justify-center text-foreground/30 text-xs">
                photo
              </div>
              <div className="p-3">
                <span className="text-xs bg-background border border-border px-2 py-0.5 rounded-md text-foreground/60">
                  {m.categorie}
                </span>
                <p className="text-sm font-medium mt-2 mb-0.5">{m.nom}</p>
                <p className="text-xs text-foreground/50">
                  {m.prixIndicatif ?? "Sur devis"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/commande"
          className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"
        >
          Commander ce modèle ou proposer le mien
        </Link>
      </div>
    </div>
  );
}
