import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-6 text-center text-sm text-neutral-400">
      <p>Feito com carinho para o nosso grande dia.</p>
      <Link href="/admin" className="mt-1 inline-block text-xs text-neutral-300 hover:text-rose-400">
        Área dos noivos
      </Link>
    </footer>
  );
}
