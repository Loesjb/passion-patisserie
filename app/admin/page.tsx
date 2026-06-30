import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { STATUT_LABELS, STATUT_ORDRE, POINT_VENTE_LABELS } from "@/lib/statuts";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const { statut } = await searchParams;

  const [commandes, tousPaiements] = await Promise.all([
    prisma.commande.findMany({
      where: statut ? { statut: statut as never } : undefined,
      include: { client: true, paiements: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.paiement.findMany(),
  ]);

  const debutMois = new Date();
  debutMois.setDate(1);
  debutMois.setHours(0, 0, 0, 0);
  const caMois = tousPaiements
    .filter((p) => p.date >= debutMois)
    .reduce((s, p) => s + p.montant, 0);

  const toutesCommandes = await prisma.commande.findMany({
    include: { paiements: true },
  });
  const enCours = toutesCommandes.filter(
    (c) => c.statut !== "LIVRE" && c.statut !== "ANNULEE"
  ).length;
  const devisEnAttente = toutesCommandes.filter(
    (c) => c.statut === "RECUE"
  ).length;
  const soldesAEncaisser = toutesCommandes.reduce((s, c) => {
    if (c.prixDevis == null) return s;
    const paye = c.paiements.reduce((a, p) => a + p.montant, 0);
    return s + Math.max(0, c.prixDevis - paye);
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <h1 className="text-xl font-medium mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Metric label="CA du mois" value={`${caMois.toLocaleString("fr-FR")} F`} />
        <Metric label="Commandes en cours" value={String(enCours)} />
        <Metric label="Devis en attente" value={String(devisEnAttente)} />
        <Metric
          label="Soldes à encaisser"
          value={`${soldesAEncaisser.toLocaleString("fr-FR")} F`}
        />
      </div>

      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/admin"
            className={`text-sm px-3 py-1.5 rounded-lg border ${
              !statut ? "bg-brand text-white border-brand" : "border-border"
            }`}
          >
            Toutes
          </Link>
          {STATUT_ORDRE.map((s) => (
            <Link
              key={s}
              href={`/admin?statut=${s}`}
              className={`text-sm px-3 py-1.5 rounded-lg border ${
                statut === s ? "bg-brand text-white border-brand" : "border-border"
              }`}
            >
              {STATUT_LABELS[s]}
            </Link>
          ))}
        </div>
        <a
          href="/api/admin/export"
          className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-brand-light"
        >
          Exporter Excel
        </a>
      </div>

      <div className="border border-border rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-background border-b border-border text-left text-foreground/60">
              <th className="px-3 py-2 font-medium">N° cmd</th>
              <th className="px-3 py-2 font-medium">Client</th>
              <th className="px-3 py-2 font-medium">Point de vente</th>
              <th className="px-3 py-2 font-medium">Date évén.</th>
              <th className="px-3 py-2 font-medium">Solde</th>
              <th className="px-3 py-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((c) => {
              const paye = c.paiements.reduce((a, p) => a + p.montant, 0);
              const solde = c.prixDevis != null ? c.prixDevis - paye : null;
              return (
                <tr key={c.id} className="border-t border-border hover:bg-brand-light">
                  <td className="px-3 py-2">
                    <Link href={`/admin/commandes/${c.id}`} className="text-brand">
                      {c.numero}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{c.client.nom}</td>
                  <td className="px-3 py-2">{POINT_VENTE_LABELS[c.pointVente]}</td>
                  <td className="px-3 py-2">
                    {c.dateEvenement
                      ? c.dateEvenement.toLocaleDateString("fr-FR")
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {solde != null ? `${solde.toLocaleString("fr-FR")} F` : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs bg-background border border-border px-2 py-0.5 rounded-md">
                      {STATUT_LABELS[c.statut]}
                    </span>
                  </td>
                </tr>
              );
            })}
            {commandes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-foreground/50">
                  Aucune commande.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background border border-border rounded-lg p-3">
      <p className="text-xs text-foreground/60 mb-1">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}
