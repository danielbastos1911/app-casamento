"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { rsvpSchema } from "@/lib/validation";

export type RsvpFormState = {
  error?: string;
  success?: boolean;
};

export async function submitRsvp(
  codigo: string,
  _prevState: RsvpFormState,
  formData: FormData
): Promise<RsvpFormState> {
  const guest = await prisma.guest.findUnique({ where: { codigoConvite: codigo } });
  if (!guest) {
    return { error: "Convite não encontrado." };
  }

  const parsed = rsvpSchema.safeParse({
    status: formData.get("status"),
    acompanhantesConfirmados: formData.getAll("acompanhantesConfirmados"),
    restricaoAlimentar: formData.get("restricaoAlimentar") || undefined,
    mensagem: formData.get("mensagem") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Verifique os campos do formulário." };
  }

  const data = parsed.data;
  const acompanhantesConfirmados =
    data.status === "CONFIRMADO"
      ? guest.acompanhantes.filter((nome) => data.acompanhantesConfirmados?.includes(nome))
      : [];

  await prisma.guest.update({
    where: { id: guest.id },
    data: {
      status: data.status,
      acompanhantesConfirmados,
      restricaoAlimentar: data.restricaoAlimentar || null,
      mensagem: data.mensagem || null,
      respondidoEm: new Date(),
    },
  });

  revalidatePath(`/rsvp/${codigo}`);
  revalidatePath("/admin/convidados");

  return { success: true };
}
