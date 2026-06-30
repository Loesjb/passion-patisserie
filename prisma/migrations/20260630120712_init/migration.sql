-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Modele" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "photoUrl" TEXT,
    "prixIndicatif" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "pointVente" TEXT NOT NULL,
    "typeEvenement" TEXT NOT NULL,
    "dateEvenement" DATETIME,
    "nbParts" INTEGER,
    "parfum" TEXT,
    "theme" TEXT,
    "imageUrl" TEXT,
    "budgetIndicatif" TEXT,
    "prixDevis" REAL,
    "statut" TEXT NOT NULL DEFAULT 'RECUE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Commande_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commandeId" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "moyen" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enregistrePar" TEXT,
    CONSTRAINT "Paiement_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin'
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_telephone_key" ON "Client"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Commande_numero_key" ON "Commande"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
