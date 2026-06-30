import Link from "next/link";

const links = [
  { href: "/catalogue", label: "Créations" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/suivi", label: "Suivi commande" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
        <Link href="/" className="font-medium text-base">
          Passion Pâtisserie
        </Link>
        <nav className="hidden sm:flex gap-5 text-sm text-foreground/70">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/commande"
          className="text-sm font-medium bg-brand text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          Commander
        </Link>
      </div>
    </header>
  );
}
