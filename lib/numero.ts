export function genererNumeroCommande(sequence: number) {
  return `CMD-${String(sequence).padStart(4, "0")}`;
}
