import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-4 py-4 sm:flex-row sm:justify-between">
        <Link href="/" className="font-serif text-lg text-neutral-900">
          Nosso Casamento
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-neutral-600">
          <Link href="/#historia" className="hover:text-rose-500">
            História
          </Link>
          <Link href="/#local" className="hover:text-rose-500">
            Local
          </Link>
          <Link href="/#galeria" className="hover:text-rose-500">
            Galeria
          </Link>
          <Link href="/rsvp" className="hover:text-rose-500">
            Confirmar presença
          </Link>
          <Link href="/presentes" className="hover:text-rose-500">
            Presentes
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-rose-200 px-3 py-1 text-rose-600 hover:bg-rose-50"
          >
            Noivos
          </Link>
        </div>
      </nav>
    </header>
  );
}
