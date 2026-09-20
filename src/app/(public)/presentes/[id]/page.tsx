import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PurchaseForm } from "@/components/site/PurchaseForm";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default async function GiftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gift = await prisma.gift.findUnique({ where: { id } });

  if (!gift) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="relative mb-6 aspect-square overflow-hidden rounded-md bg-neutral-100">
        {gift.imagemUrl && (
          <Image src={gift.imagemUrl} alt={gift.nome} fill sizes="400px" className="object-cover" />
        )}
      </div>

      <h1 className="mb-1 font-serif text-2xl text-neutral-900">{gift.nome}</h1>
      <p className="mb-1 text-lg font-medium text-rose-600">{currency.format(Number(gift.valor))}</p>
      <p className="mb-6 whitespace-pre-line text-neutral-600">{gift.descricao}</p>

      {gift.disponivel ? (
        <PurchaseForm giftId={gift.id} />
      ) : (
        <p className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-600">
          Esse presente já foi escolhido por outra pessoa. Obrigado pelo carinho!
        </p>
      )}
    </main>
  );
}
