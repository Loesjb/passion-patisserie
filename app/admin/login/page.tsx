"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Mot de passe incorrect.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-20">
      <h1 className="text-xl font-medium mb-1">Espace administrateur</h1>
      <p className="text-sm text-foreground/60 mb-6">
        Réservé à Passion Pâtisserie.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          name="password"
          required
          placeholder="Mot de passe"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-brand text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
