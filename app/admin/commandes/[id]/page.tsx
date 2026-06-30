import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { POINT_VENTE_LABELS } from "@/lib/statuts";
import CommandeActions from "./CommandeActions";

export const dynamic = "force-dynamic";

export default async function CommandeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const commande = await prisma.commande.findUnique({
    where: { id },
    include: { client: true, paiements: { orderBy: { date: "desc" } } },
  });

  if (!commande) notFound();

  const totalPaye = commande.paiements.reduce((s, p) => s + p.montant, 0);
  const solde = commande.prixDevis != null ? commande.prixDevis - totalPaye : null;

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <p className="text-sm text-foreground/60 mb-1">{commande.numero}</p>
      <h1 className="text-xl font-medium mb-6">{commande.client.nom}</h1>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <Info label="Téléphone" value={commande.client.telephone} />
        <Info label="Point de vente" value={POINT_VENTE_LABELS[commande.pointVente]} />
        <Info label="Type d'événement" value={commande.typeEvenement} />
        <Info
          label="Date souhaitée"
          value={
            commande.dateEvenement
              ? commande.dateEvenement.toLocaleDateString("fr-FR")
              : "—"
          }
        />
        <Info label="Nombre de parts" value={commande.nbParts ? String(commande.nbParts) : "—"} />
        <Info label="Parfum" value={commande.parfum ?? "—"} />
        <Info label="Budget indicatif" value={commande.budgetIndicatif ?? "—"} />
      </div>

      {commande.theme && (
        <div className="mb-6">
          <p className="text-xs text-foreground/60 mb-1">Thème / message</p>
          <p className="text-sm border border-border rounded-lg p-3">{commande.theme}</p>
        </div>
      )}

      {commande.imageUrl && (
        <div className="mb-6">
          <p className="text-xs text-foreground/60 mb-1">Image d&apos;inspiration</p>
          <img
            src={commande.imageUrl}
            alt="Inspiration du client"
            className="rounded-lg border border-border max-h-64 object-cover"
          />
        </div>
      )}

      <CommandeActions
        commandeId={commande.id}
        statut={commande.statut}
        prixDevis={commande.prixDevis}
      />

      <div className="mt-8">
        <p className="text-sm font-medium mb-2">
          Paiements ({totalPaye.toLocaleString("fr-FR")} F encaissés
          {solde != null ? `, solde ${solde.toLocaleString("fr-FR")} F` : ""})
        </p>
        <div className="flex flex-col gap-1.5">
          {commande.paiements.map((p) => (
            <div
              key={p.id}
              className="flex justify-between text-sm border border-border rounded-lg px-3 py-2"
            >
              <span>
                {p.type === "ACOMPTE" ? "Acompte" : "Solde"} — {p.moyen}
              </span>
              <span className="font-medium">{p.montant.toLocaleString("fr-FR")} F</span>
            </div>
          ))}
          {commande.paiements.length === 0 && (
            <p className="text-sm text-foreground/50">Aucun paiement enregistré.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-foreground/60">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
