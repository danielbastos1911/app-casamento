import Link from "next/link";
import { getSession } from "@/lib/session";
import { logout } from "./actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-neutral-50">
      {session && (
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <div className="flex items-center gap-6">
            <span className="font-serif text-lg text-neutral-900">Painel dos noivos</span>
            <nav className="flex gap-4 text-sm text-neutral-600">
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
          <form action={logout}>
            <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-800">
              Sair
            </button>
          </form>
        </header>
      )}
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
