# Mise en ligne — Passion Pâtisserie

## 1. Nom de domaine
Acheter `passionpatisserie.ci` (registrar NIC.ci ou revendeur local) — environ 8 000 à 15 000 FCFA/an.
Réserver aussi `passioncakedesign.com` en secondaire si possible.

## 2. Hébergement (Vercel)
1. Créer un compte sur vercel.com (gratuit pour démarrer)
2. Connecter le dépôt GitHub de ce projet (le pousser sur GitHub si ce n'est pas déjà fait)
3. Importer le projet dans Vercel — il détecte Next.js automatiquement
4. Dans les paramètres du projet Vercel, ajouter les variables d'environnement :
   - `DATABASE_URL` → voir étape 3 (base de données de production)
   - `ADMIN_PASSWORD` → un mot de passe fort différent de celui de test
5. Dans les paramètres de domaine Vercel, ajouter `passionpatisserie.ci` et suivre les instructions DNS (Vercel indique les
   enregistrements à créer chez le registrar)

## 3. Base de données de production
SQLite (utilisé en développement) ne convient pas à Vercel (système de fichiers non persistant). Avant la mise en ligne réelle :
1. Créer une base Postgres gratuite (Neon, Supabase, ou `npx create-db` proposé par Prisma)
2. Remplacer l'adapter SQLite par l'adapter Postgres standard de Prisma (`@prisma/client` avec `datasource db { provider = "postgresql" }`)
3. Lancer `npx prisma migrate deploy` contre la nouvelle base
4. Mettre à jour `DATABASE_URL` dans Vercel avec l'URL Postgres

## 4. Photos du catalogue
Remplacer les espaces réservés ("photo") par les vraies photos de la page Facebook "Cake Design pour toutes vos cérémonies" :
- Télécharger les photos depuis Facebook
- Les uploader dans `public/modeles/` ou un service de stockage (Vercel Blob, Cloudinary)
- Mettre à jour le champ `photoUrl` de chaque `Modele` dans la base, et adapter `app/catalogue/page.tsx` pour afficher l'image
  réelle au lieu du placeholder

## 5. Checklist finale avant ouverture au public
- [ ] Domaine acheté et pointé vers Vercel
- [ ] Base de données Postgres en place (migration depuis SQLite)
- [ ] `ADMIN_PASSWORD` changé pour un secret fort propre à la production
- [ ] Photos réelles chargées dans le catalogue et l'accueil
- [ ] Test du parcours complet en production : commande → devis → paiement → suivi
- [ ] Vérification que `/admin` est bien inaccessible sans mot de passe
