import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default async function GiftsPage() {
  const gifts = await prisma.gift.findMany({ orderBy: { valor: "asc" } });

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-2 text-center font-serif text-3xl text-neutral-900">Lista de presentes</h1>
      <p className="mb-10 text-center text-neutral-600">
        Sua presença já é o maior presente, mas se quiser nos ajudar a começar essa nova fase, aqui
        estão algumas ideias.
      </p>

      {gifts.length === 0 ? (
        <p className="text-center text-sm text-neutral-500">A lista ainda está sendo preparada.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {gifts.map((gift) => (
            <Link
              key={gift.id}
              href={`/presentes/${gift.id}`}
              className="group rounded-md border border-neutral-200 bg-white p-3 transition hover:border-rose-300"
            >
              <div className="relative mb-2 aspect-square overflow-hidden rounded-md bg-neutral-100">
                {gift.imagemUrl && (
                  <Image
                    src={gift.imagemUrl}
                    alt={gift.nome}
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    className={`object-cover ${!gift.disponivel ? "opacity-40 grayscale" : ""}`}
                  />
                )}
                {!gift.disponivel && (
                  <span className="absolute right-1 top-1 rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-white">
                    Presenteado
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-neutral-900 group-hover:text-rose-600">
                {gift.nome}
              </p>
              <p className="text-sm text-neutral-500">{currency.format(Number(gift.valor))}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
