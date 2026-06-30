"use client";

import { useState, FormEvent } from "react";

export default function CommandePage() {
  const [submitting, setSubmitting] = useState(false);
  const [numero, setNumero] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Échec de l'envoi");
      }
      const data = await res.json();
      setNumero(data.numero);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  }

  if (numero) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <p className="text-sm text-brand font-medium mb-2">Demande envoyée</p>
        <h1 className="text-xl font-medium mb-3">
          Votre numéro de commande : {numero}
        </h1>
        <p className="text-sm text-foreground/70">
          Nous revenons vers vous par WhatsApp ou email sous 24h avec un
          devis. Conservez ce numéro pour suivre votre commande.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 py-10">
      <h1 className="text-xl font-medium mb-1">
        Commander un gâteau personnalisé
      </h1>
      <p className="text-sm text-foreground/60 mb-6">
        Décrivez votre événement, nous revenons vers vous avec un devis
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="Nom complet">
          <input name="nom" required placeholder="Ex. Aïcha Koné" />
        </Field>

        <Field label="Téléphone / WhatsApp">
          <input name="telephone" required placeholder="07 XX XX XX XX" />
        </Field>

        <Field label="Point de commande">
          <select name="pointVente" required defaultValue="COCODY_ABATTA">
            <option value="COCODY_ABATTA">Cocody Abatta</option>
            <option value="YOPOUGON">Yopougon Mosquée du Maroc</option>
            <option value="LIVRAISON">Livraison à domicile</option>
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Type d'événement">
            <select name="typeEvenement" required defaultValue="Anniversaire">
              <option>Anniversaire</option>
              <option>Mariage</option>
              <option>Baptême</option>
              <option>Entreprise</option>
              <option>Cupcakes</option>
            </select>
          </Field>
          <Field label="Date souhaitée">
            <input type="date" name="dateEvenement" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre de parts">
            <input type="number" name="nbParts" placeholder="20" min={1} />
          </Field>
          <Field label="Parfum">
            <select name="parfum" defaultValue="Vanille">
              <option>Vanille</option>
              <option>Chocolat</option>
              <option>Red velvet</option>
              <option>Citron</option>
            </select>
          </Field>
        </div>

        <Field label="Thème / couleurs / message à inscrire">
          <textarea
            name="theme"
            placeholder="Ex. thème jungle, dégradé vert et or, message Joyeux 5 ans Maya"
            rows={3}
          />
        </Field>

        <Field label="Modèle d'inspiration (optionnel)">
          <input type="file" name="image" accept="image/*" />
        </Field>

        <Field label="Budget indicatif (optionnel)">
          <input
            name="budgetIndicatif"
            placeholder="Ex. 25 000 - 35 000 FCFA"
          />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-brand text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 mt-2"
        >
          {submitting ? "Envoi en cours…" : "Envoyer ma demande de devis"}
        </button>
        <p className="text-xs text-foreground/50 text-center">
          Vous recevrez une réponse par WhatsApp ou email sous 24h
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-foreground/60 text-xs">{label}</span>
      {children}
    </label>
  );
}
