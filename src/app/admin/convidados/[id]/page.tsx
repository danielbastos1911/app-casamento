import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { GuestForm } from "@/components/admin/GuestForm";
import { updateGuest } from "../actions";

export default async function EditGuestPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const guest = await prisma.guest.findUnique({ where: { id } });

  if (!guest) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-neutral-900">Editar convidado</h1>
      <GuestForm
        action={updateGuest.bind(null, guest.id)}
        submitLabel="Salvar alterações"
        defaultValues={{
          nome: guest.nome,
          grupo: guest.grupo,
          telefone: guest.telefone,
          email: guest.email,
          acompanhantes: guest.acompanhantes,
        }}
      />
    </div>
  );
}
