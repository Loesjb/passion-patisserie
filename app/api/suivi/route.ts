import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const numero = req.nextUrl.searchParams.get("numero")?.trim();
  const telephone = req.nextUrl.searchParams.get("telephone")?.trim();

  if (!numero || !telephone) {
    return NextResponse.json(
      { error: "Numéro et téléphone requis." },
      { status: 400 }
    );
  }

  const commande = await prisma.commande.findFirst({
    where: { numero, client: { telephone } },
    include: { paiements: true },
  });

  if (!commande) {
    return NextResponse.json(
      { error: "Aucune commande trouvée avec ces informations." },
      { status: 404 }
    );
  }

  const totalPaye = commande.paiements.reduce((s, p) => s + p.montant, 0);
  const solde =
    commande.prixDevis != null ? commande.prixDevis - totalPaye : null;

  return NextResponse.json({
    numero: commande.numero,
    statut: commande.statut,
    typeEvenement: commande.typeEvenement,
    dateEvenement: commande.dateEvenement,
    prixDevis: commande.prixDevis,
    totalPaye,
    solde,
  });
}
