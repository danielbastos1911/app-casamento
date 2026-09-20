import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { GuestForm } from "@/components/admin/GuestForm";
import { createGuest, deleteGuest } from "./actions";

const statusLabel: Record<string, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  RECUSADO: "Recusado",
};

const statusClass: Record<string, string> = {
  PENDENTE: "bg-neutral-100 text-neutral-600",
  CONFIRMADO: "bg-green-100 text-green-700",
  RECUSADO: "bg-red-100 text-red-700",
};

export default async function GuestsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [guests, headerList] = await Promise.all([
    prisma.guest.findMany({ orderBy: { nome: "asc" } }),
    headers(),
  ]);

  const origin = `${headerList.get("x-forwarded-proto") ?? "http"}://${headerList.get("host")}`;

  const counts = {
    total: guests.length,
    confirmado: guests.filter((g) => g.status === "CONFIRMADO").length,
    pendente: guests.filter((g) => g.status === "PENDENTE").length,
    recusado: guests.filter((g) => g.status === "RECUSADO").length,
  };

  const pessoasEsperadas = guests.reduce((sum, g) => sum + 1 + g.acompanhantes.length, 0);
  const pessoasConfirmadas = guests
    .filter((g) => g.status === "CONFIRMADO")
    .reduce((sum, g) => sum + 1 + g.acompanhantesConfirmados.length, 0);

  const grupos = Array.from(new Set(guests.map((g) => g.grupo ?? "Sem grupo"))).sort();

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-neutral-900">Lista de convidados</h1>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-md border border-neutral-200 bg-white p-3 text-center">
          <div className="text-2xl font-semibold text-neutral-900">{counts.total}</div>
          <div className="text-xs text-neutral-500">Convites</div>
        </div>
        <div className="rounded-md border border-neutral-200 bg-white p-3 text-center">
          <div className="text-2xl font-semibold text-green-600">{counts.confirmado}</div>
          <div className="text-xs text-neutral-500">Confirmados</div>
        </div>
        <div className="rounded-md border border-neutral-200 bg-white p-3 text-center">
          <div className="text-2xl font-semibold text-neutral-600">{counts.pendente}</div>
          <div className="text-xs text-neutral-500">Pendentes</div>
        </div>
        <div className="rounded-md border border-neutral-200 bg-white p-3 text-center">
          <div className="text-2xl font-semibold text-red-600">{counts.recusado}</div>
          <div className="text-xs text-neutral-500">Recusaram</div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-neutral-200 bg-white p-3 text-center">
          <div className="text-2xl font-semibold text-neutral-900">{pessoasEsperadas}</div>
          <div className="text-xs text-neutral-500">Pessoas esperadas (total)</div>
        </div>
        <div className="rounded-md border border-neutral-200 bg-white p-3 text-center">
          <div className="text-2xl font-semibold text-green-600">{pessoasConfirmadas}</div>
          <div className="text-xs text-neutral-500">Pessoas confirmadas</div>
        </div>
      </div>

      <section className="mb-8 rounded-md border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 font-serif text-lg text-neutral-800">Adicionar convidado</h2>
        <GuestForm action={createGuest} submitLabel="Adicionar" />
      </section>

      {guests.length === 0 ? (
        <p className="text-sm text-neutral-500">Nenhum convidado cadastrado ainda.</p>
      ) : (
        grupos.map((grupo) => (
          <section key={grupo} className="mb-8">
            <h2 className="mb-3 font-serif text-lg text-neutral-800">
              {grupo} ({guests.filter((g) => (g.grupo ?? "Sem grupo") === grupo).length})
            </h2>
            <div className="space-y-2">
              {guests
                .filter((g) => (g.grupo ?? "Sem grupo") === grupo)
                .map((guest) => (
                  <div
                    key={guest.id}
                    className="flex flex-col gap-2 rounded-md border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-900">{guest.nome}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass[guest.status]}`}>
                          {statusLabel[guest.status]}
                        </span>
                      </div>
                      {guest.acompanhantes.length > 0 && (
                        <div className="text-xs text-neutral-500">
                          Acompanhantes:{" "}
                          {guest.acompanhantes
                            .map(
                              (f) => `${f}${guest.acompanhantesConfirmados.includes(f) ? " ✓" : ""}`
                            )
                            .join(", ")}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-neutral-400">
                        Link: {origin}/rsvp/{guest.codigoConvite}
                      </div>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <Link href={`/admin/convidados/${guest.id}`} className="text-rose-600 hover:underline">
                        Editar
                      </Link>
                      <form action={deleteGuest.bind(null, guest.id)}>
                        <button type="submit" className="text-neutral-400 hover:text-red-600">
                          Excluir
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
