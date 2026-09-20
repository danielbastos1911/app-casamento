import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { GiftForm } from "@/components/admin/GiftForm";
import { createGift, deleteGift, toggleGiftDisponivel } from "./actions";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default async function AdminGiftsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const gifts = await prisma.gift.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-neutral-900">Lista de presentes</h1>

      <section className="mb-8 rounded-md border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 font-serif text-lg text-neutral-800">Adicionar presente</h2>
        <GiftForm action={createGift} submitLabel="Adicionar" />
      </section>

      <section>
        <h2 className="mb-3 font-serif text-lg text-neutral-800">Presentes cadastrados</h2>
        {gifts.length === 0 ? (
          <p className="text-sm text-neutral-500">Nenhum presente cadastrado ainda.</p>
        ) : (
          <div className="space-y-2">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  {gift.imagemUrl && (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                      <Image src={gift.imagemUrl} alt={gift.nome} fill sizes="56px" className="object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">{gift.nome}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          gift.disponivel ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-600"
                        }`}
                      >
                        {gift.disponivel ? "Disponível" : "Presenteado"}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500">{currency.format(Number(gift.valor))}</div>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <form action={toggleGiftDisponivel.bind(null, gift.id, !gift.disponivel)}>
                    <button type="submit" className="text-neutral-500 hover:text-neutral-800">
                      {gift.disponivel ? "Marcar como presenteado" : "Marcar como disponível"}
                    </button>
                  </form>
                  <Link href={`/admin/presentes/${gift.id}`} className="text-rose-600 hover:underline">
                    Editar
                  </Link>
                  <form action={deleteGift.bind(null, gift.id)}>
                    <button type="submit" className="text-neutral-400 hover:text-red-600">
                      Excluir
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
