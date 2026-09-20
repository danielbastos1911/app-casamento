import Link from "next/link";
import { getSession } from "@/lib/session";
import { logout } from "./actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-neutral-50">
      {session && (
        <header className="flex flex-col gap-3 border-b border-neutral-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <span className="font-serif text-lg text-neutral-900">Painel dos noivos</span>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-600">
              <Link href="/admin" className="hover:text-rose-500">
                Editar site
              </Link>
              <Link href="/admin/convidados" className="hover:text-rose-500">
                Convidados
              </Link>
              <Link href="/admin/presentes" className="hover:text-rose-500">
                Presentes
              </Link>
              <Link href="/admin/pedidos" className="hover:text-rose-500">
                Pedidos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
              ← Ver site
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-800">
                Sair
              </button>
            </form>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
