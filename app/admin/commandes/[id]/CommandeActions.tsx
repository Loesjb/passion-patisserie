"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { STATUT_LABELS, STATUT_ORDRE } from "@/lib/statuts";

export default function CommandeActions({
  commandeId,
  statut,
  prixDevis,
}: {
  commandeId: string;
  statut: string;
  prixDevis: number | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function changerStatut(nouveauStatut: string) {
    setBusy(true);
    await fetch(`/api/admin/commandes/${commandeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: nouveauStatut }),
    });
    setBusy(false);
    router.refresh();
  }

  async function enregistrerDevis(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    await fetch(`/api/admin/commandes/${commandeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prixDevis: form.get("prixDevis"),
        statut: "DEVIS_ENVOYE",
      }),
    });
    setBusy(false);
    router.refresh();
  }

  async function enregistrerPaiement(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    await fetch(`/api/admin/paiements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commandeId,
        montant: form.get("montant"),
        type: form.get("type"),
        moyen: form.get("moyen"),
      }),
    });
    (e.target as HTMLFormElement).reset();
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-foreground/60 mb-2">Statut</p>
        <div className="flex gap-2 flex-wrap">
          {STATUT_ORDRE.map((s) => (
            <button
              key={s}
              disabled={busy}
              onClick={() => changerStatut(s)}
              className={`text-sm px-3 py-1.5 rounded-lg border disabled:opacity-50 ${
                statut === s ? "bg-brand text-white border-brand" : "border-border"
              }`}
            >
              {STATUT_LABELS[s]}
            </button>
          ))}
          <button
            disabled={busy}
            onClick={() => changerStatut("ANNULEE")}
            className={`text-sm px-3 py-1.5 rounded-lg border disabled:opacity-50 ${
              statut === "ANNULEE" ? "bg-red-600 text-white border-red-600" : "border-border"
            }`}
          >
            Annulée
          </button>
        </div>
      </div>

      <form onSubmit={enregistrerDevis} className="flex items-end gap-2">
        <label className="flex flex-col gap-1 text-sm flex-1">
          <span className="text-xs text-foreground/60">Prix du devis (FCFA)</span>
          <input
            type="number"
            name="prixDevis"
            defaultValue={prixDevis ?? undefined}
            min={0}
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="bg-brand text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          Envoyer le devis
        </button>
      </form>

      <form onSubmit={enregistrerPaiement} className="flex items-end gap-2 flex-wrap">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs text-foreground/60">Montant</span>
          <input type="number" name="montant" required min={0} className="w-28" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs text-foreground/60">Type</span>
          <select name="type" defaultValue="ACOMPTE">
            <option value="ACOMPTE">Acompte</option>
            <option value="SOLDE">Solde</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs text-foreground/60">Moyen</span>
          <select name="moyen" defaultValue="Orange Money">
            <option>Orange Money</option>
            <option>Wave</option>
            <option>MTN Money</option>
            <option>Virement</option>
            <option>Espèces</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={busy}
          className="bg-brand text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          Enregistrer le paiement
        </button>
      </form>
    </div>
  );
}
