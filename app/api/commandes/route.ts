import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { genererNumeroCommande } from "@/lib/numero";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const POINTS_VENTE = new Set(["COCODY_ABATTA", "YOPOUGON", "LIVRAISON"]);

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const nom = String(form.get("nom") ?? "").trim();
  const telephone = String(form.get("telephone") ?? "").trim();
  const pointVente = String(form.get("pointVente") ?? "");
  const typeEvenement = String(form.get("typeEvenement") ?? "");
  const dateEvenement = form.get("dateEvenement");
  const nbParts = form.get("nbParts");
  const parfum = form.get("parfum");
  const theme = form.get("theme");
  const budgetIndicatif = form.get("budgetIndicatif");
  const image = form.get("image") as File | null;

  if (!nom || !telephone || !typeEvenement || !POINTS_VENTE.has(pointVente)) {
    return NextResponse.json(
      { error: "Champs obligatoires manquants." },
      { status: 400 }
    );
  }

  let imageUrl: string | undefined;
  if (image && image.size > 0) {
    const bytes = Buffer.from(await image.arrayBuffer());
    const ext = path.extname(image.name) || ".jpg";
    const filename = `${randomUUID()}${ext}`;
    await writeFile(
      path.join(process.cwd(), "public", "uploads", filename),
      bytes
    );
    imageUrl = `/uploads/${filename}`;
  }

  const client = await prisma.client.upsert({
    where: { telephone },
    update: { nom },
    create: { nom, telephone },
  });

  const count = await prisma.commande.count();
  const numero = genererNumeroCommande(count + 1);

  const commande = await prisma.commande.create({
    data: {
      numero,
      clientId: client.id,
      pointVente: pointVente as never,
      typeEvenement,
      dateEvenement: dateEvenement ? new Date(String(dateEvenement)) : null,
      nbParts: nbParts ? Number(nbParts) : null,
      parfum: parfum ? String(parfum) : null,
      theme: theme ? String(theme) : null,
      budgetIndicatif: budgetIndicatif ? String(budgetIndicatif) : null,
      imageUrl,
    },
  });

  return NextResponse.json({ numero: commande.numero });
}
