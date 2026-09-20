import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { GiftForm } from "@/components/admin/GiftForm";
import { updateGift } from "../actions";

export default async function EditGiftPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const gift = await prisma.gift.findUnique({ where: { id } });

  if (!gift) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-neutral-900">Editar presente</h1>
      <GiftForm
        action={updateGift.bind(null, gift.id)}
        submitLabel="Salvar alterações"
        defaultValues={{
          nome: gift.nome,
          descricao: gift.descricao,
          imagemUrl: gift.imagemUrl,
          valor: gift.valor.toString(),
        }}
      />
    </div>
  );
}
