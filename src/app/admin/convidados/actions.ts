"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { guestSchema } from "@/lib/validation";

export type GuestFormState = {
  error?: string;
  success?: boolean;
};

async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
}

function parseGuestForm(formData: FormData) {
  const acompanhantes = formData
    .getAll("acompanhantes")
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0);

  return guestSchema.safeParse({
    nome: formData.get("nome"),
    grupo: formData.get("grupo") || undefined,
    telefone: formData.get("telefone") || undefined,
    email: formData.get("email") || undefined,
    acompanhantes,
  });
}

export async function createGuest(
  _prevState: GuestFormState,
  formData: FormData
): Promise<GuestFormState> {
  await requireSession();

  const parsed = parseGuestForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Verifique os campos." };
  }

  await prisma.guest.create({
    data: {
      nome: parsed.data.nome,
      grupo: parsed.data.grupo || null,
      telefone: parsed.data.telefone || null,
      email: parsed.data.email || null,
      acompanhantes: parsed.data.acompanhantes ?? [],
    },
  });

  revalidatePath("/admin/convidados");

  return { success: true };
}

export async function updateGuest(
  id: string,
  _prevState: GuestFormState,
  formData: FormData
): Promise<GuestFormState> {
  await requireSession();

  const parsed = parseGuestForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Verifique os campos." };
  }

  const acompanhantes = parsed.data.acompanhantes ?? [];
  const existing = await prisma.guest.findUnique({
    where: { id },
    select: { acompanhantesConfirmados: true },
  });
  const acompanhantesConfirmados = (existing?.acompanhantesConfirmados ?? []).filter((nome) =>
    acompanhantes.includes(nome)
  );

  await prisma.guest.update({
    where: { id },
    data: {
      nome: parsed.data.nome,
      grupo: parsed.data.grupo || null,
      telefone: parsed.data.telefone || null,
      email: parsed.data.email || null,
      acompanhantes,
      acompanhantesConfirmados,
    },
  });

  revalidatePath("/admin/convidados");
  redirect("/admin/convidados");
}

export async function deleteGuest(id: string) {
  await requireSession();
  await prisma.guest.delete({ where: { id } });
  revalidatePath("/admin/convidados");
}
