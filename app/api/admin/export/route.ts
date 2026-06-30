import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STATUT_LABELS, POINT_VENTE_LABELS } from "@/lib/statuts";

export async function GET() {
  const commandes = await prisma.commande.findMany({
    include: { client: true, paiements: true },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Numero",
    "Client",
    "Telephone",
    "Point de vente",
    "Type evenement",
    "Date evenement",
    "Prix devis",
    "Total paye",
    "Statut",
  ];

  const rows = commandes.map((c) => {
    const totalPaye = c.paiements.reduce((s, p) => s + p.montant, 0);
    return [
      c.numero,
      c.client.nom,
      c.client.telephone,
      POINT_VENTE_LABELS[c.pointVente] ?? c.pointVente,
      c.typeEvenement,
      c.dateEvenement ? c.dateEvenement.toISOString().slice(0, 10) : "",
      c.prixDevis ?? "",
      totalPaye,
      STATUT_LABELS[c.statut] ?? c.statut,
    ];
  });

  const csv = [header, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";"))
    .join("\n");

  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="commandes-passion-patisserie.csv"`,
    },
  });
}
