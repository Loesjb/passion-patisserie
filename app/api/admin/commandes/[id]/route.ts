import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const data: { statut?: string; prixDevis?: number } = {};
  if (body.statut) data.statut = body.statut;
  if (body.prixDevis !== undefined) data.prixDevis = Number(body.prixDevis);

  const commande = await prisma.commande.update({
    where: { id },
    data: data as never,
  });

  return NextResponse.json(commande);
}
