import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.modele.createMany({
    data: [
      { nom: "Thème jungle", categorie: "Anniversaire", prixIndicatif: "Dès 25 000 F" },
      { nom: "Princesse féerique", categorie: "Enfant", prixIndicatif: "Dès 22 000 F" },
      { nom: "Voitures de course", categorie: "Enfant", prixIndicatif: "Dès 22 000 F" },
      { nom: "Pièce montée florale", categorie: "Mariage", prixIndicatif: "Dès 120 000 F" },
      { nom: "Élégance dorée", categorie: "Mariage", prixIndicatif: "Dès 150 000 F" },
      { nom: "Douceur blanc et or", categorie: "Baptême", prixIndicatif: "Dès 35 000 F" },
      { nom: "Pastel tendre", categorie: "Baptême", prixIndicatif: "Dès 30 000 F" },
      { nom: "Logo personnalisé", categorie: "Entreprise", prixIndicatif: "Sur devis" },
      { nom: "Lancement de produit", categorie: "Entreprise", prixIndicatif: "Sur devis" },
      { nom: "Box de 12 cupcakes", categorie: "Cupcakes", prixIndicatif: "Dès 12 000 F" },
      { nom: "Box de 24 cupcakes", categorie: "Cupcakes", prixIndicatif: "Dès 20 000 F" },
      { nom: "Anniversaire chiffré", categorie: "Anniversaire", prixIndicatif: "Dès 28 000 F" },
    ],
  });
  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
