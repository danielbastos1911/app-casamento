import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RsvpForm } from "@/components/site/RsvpForm";

export default async function RsvpConfirmPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const guest = await prisma.guest.findUnique({ where: { codigoConvite: codigo } });

  if (!guest) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-1 text-center font-serif text-3xl text-neutral-900">Olá, {guest.nome}!</h1>
      <p className="mb-8 text-center text-neutral-600">Confirme sua presença no nosso casamento.</p>

      <RsvpForm
        codigo={guest.codigoConvite}
        acompanhantes={guest.acompanhantes}
        defaultStatus={guest.status}
        defaultAcompanhantesConfirmados={
          guest.status === "PENDENTE" ? guest.acompanhantes : guest.acompanhantesConfirmados
        }
        defaultRestricao={guest.restricaoAlimentar ?? ""}
        defaultMensagem={guest.mensagem ?? ""}
      />
    </main>
  );
}
