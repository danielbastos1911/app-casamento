import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { reconcilePayment } from "@/lib/order-reconciliation";

const statusCopy: Record<string, { title: string; description: string }> = {
  APROVADO: {
    title: "Pagamento aprovado! 🎉",
    description: "Muito obrigado pelo carinho, vai fazer toda diferença para nós.",
  },
  RECUSADO: {
    title: "Pagamento não aprovado",
    description: "Algo deu errado com o pagamento. Você pode tentar novamente ou escolher outro presente.",
  },
  PENDENTE: {
    title: "Pagamento em processamento",
    description: "Assim que for confirmado (isso pode levar alguns instantes, especialmente no PIX), atualizamos automaticamente.",
  },
  CANCELADO: {
    title: "Pagamento cancelado",
    description: "Nenhum problema — fique à vontade para escolher outro presente.",
  },
};

export default async function GiftReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; collection_id?: string; external_reference?: string }>;
}) {
  const params = await searchParams;
  const paymentId = params.payment_id ?? params.collection_id;

  if (paymentId) {
    try {
      await reconcilePayment(paymentId);
    } catch (error) {
      console.error("Erro ao reconciliar pagamento no retorno:", error);
    }
  }

  const order = params.external_reference
    ? await prisma.order.findUnique({ where: { id: params.external_reference }, include: { gift: true } })
    : null;

  const copy = statusCopy[order?.status ?? "PENDENTE"];

  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="mb-3 font-serif text-2xl text-neutral-900">{copy.title}</h1>
      <p className="mb-2 text-neutral-600">{copy.description}</p>
      {order && (
        <p className="mb-8 text-sm text-neutral-500">
          Presente: {order.gift.nome}
        </p>
      )}
      <Link href="/presentes" className="text-sm text-rose-600 hover:underline">
        Voltar para a lista de presentes
      </Link>
    </main>
  );
}
