"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { giftSchema } from "@/lib/validation";

export type GiftFormState = {
  error?: string;
  success?: boolean;
};

async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
}

function parseGiftForm(formData: FormData) {
  return giftSchema.safeParse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao"),
    imagemUrl: formData.get("imagemUrl") || undefined,
    valor: formData.get("valor"),
  });
}

export async function createGift(
  _prevState: GiftFormState,
  formData: FormData
): Promise<GiftFormState> {
  await requireSession();

  const parsed = parseGiftForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Verifique os campos." };
  }

  await prisma.gift.create({
    data: {
      nome: parsed.data.nome,
      descricao: parsed.data.descricao,
      imagemUrl: parsed.data.imagemUrl || null,
      valor: parsed.data.valor,
    },
  });

  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");

  return { success: true };
}

export async function updateGift(
  id: string,
  _prevState: GiftFormState,
  formData: FormData
): Promise<GiftFormState> {
  await requireSession();

  const parsed = parseGiftForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Verifique os campos." };
  }

  await prisma.gift.update({
    where: { id },
    data: {
      nome: parsed.data.nome,
      descricao: parsed.data.descricao,
      imagemUrl: parsed.data.imagemUrl || null,
      valor: parsed.data.valor,
    },
  });

  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");
  redirect("/admin/presentes");
}

export async function deleteGift(id: string) {
  await requireSession();
  await prisma.gift.delete({ where: { id } });
  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");
}

export async function toggleGiftDisponivel(id: string, disponivel: boolean) {
  await requireSession();
  await prisma.gift.update({ where: { id }, data: { disponivel } });
  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");
}
