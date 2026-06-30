"use client";

import { useState, FormEvent } from "react";
import { STATUT_LABELS } from "@/lib/statuts";

type Resultat = {
  numero: string;
  statut: string;
  typeEvenement: string;
  dateEvenement: string | null;
  prixDevis: number | null;
  totalPaye: number;
  solde: number | null;
};

export default function SuiviPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultat, setResultat] = useState<Resultat | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResultat(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams({
      numero: String(form.get("numero") ?? ""),
      telephone: String(form.get("telephone") ?? ""),
    });
    try {
      const res = await fetch(`/api/suivi?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Commande introuvable");
      setResultat(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-10">
      <h1 className="text-xl font-medium mb-1">Suivre ma commande</h1>
      <p className="text-sm text-foreground/60 mb-6">
        Entrez votre numéro de commande et votre téléphone pour voir le
        statut.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="numero" required placeholder="Numéro de commande (ex. CMD-0001)" />
        <input name="telephone" required placeholder="Téléphone utilisé à la commande" />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Recherche…" : "Voir le statut"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      {resultat && (
        <div className="mt-6 border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60">{resultat.numero}</p>
          <p className="text-base font-medium mb-3">
            {STATUT_LABELS[resultat.statut] ?? resultat.statut}
          </p>
          <dl className="text-sm flex flex-col gap-1.5">
            <Row label="Événement" value={resultat.typeEvenement} />
            {resultat.dateEvenement && (
              <Row
                label="Date"
                value={new Date(resultat.dateEvenement).toLocaleDateString(
                  "fr-FR"
                )}
              />
            )}
            {resultat.prixDevis != null && (
              <Row label="Prix devis" value={`${resultat.prixDevis.toLocaleString("fr-FR")} F`} />
            )}
            <Row
              label="Total payé"
              value={`${resultat.totalPaye.toLocaleString("fr-FR")} F`}
            />
            {resultat.solde != null && (
              <Row
                label="Solde restant"
                value={`${resultat.solde.toLocaleString("fr-FR")} F`}
              />
            )}
          </dl>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-foreground/60">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
