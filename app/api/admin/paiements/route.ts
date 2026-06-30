import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { commandeId, montant, type, moyen } = body;

  if (!commandeId || !montant || !type || !moyen) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const paiement = await prisma.paiement.create({
    data: {
      commandeId,
      montant: Number(montant),
      type,
      moyen,
    },
  });

  return NextResponse.json(paiement);
}
