"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession, clearSessionCookie } from "@/lib/session";
import { eventInfoSchema } from "@/lib/validation";

export type EventInfoFormState = {
  error?: string;
  success?: boolean;
};

export async function logout() {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function updateEventInfo(
  _prevState: EventInfoFormState,
  formData: FormData
): Promise<EventInfoFormState> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const galeriaUrls = formData.getAll("galeriaUrls").filter((v): v is string => typeof v === "string" && v.length > 0);

  const parsed = eventInfoSchema.safeParse({
    nomeNoivo: formData.get("nomeNoivo"),
    nomeNoiva: formData.get("nomeNoiva"),
    dataCasamento: formData.get("dataCasamento"),
    historia: formData.get("historia"),
    cerimoniaLocal: formData.get("cerimoniaLocal"),
    cerimoniaEndereco: formData.get("cerimoniaEndereco"),
    cerimoniaHorario: formData.get("cerimoniaHorario"),
    recepcaoLocal: formData.get("recepcaoLocal"),
    recepcaoEndereco: formData.get("recepcaoEndereco"),
    recepcaoHorario: formData.get("recepcaoHorario"),
    fotoCapaUrl: formData.get("fotoCapaUrl") ?? undefined,
    fotoCapaPosicao: formData.get("fotoCapaPosicao") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Verifique os campos do formulário." };
  }

  const data = parsed.data;
  const dataCasamento = new Date(data.dataCasamento);
  if (Number.isNaN(dataCasamento.getTime())) {
    return { error: "Data do casamento inválida." };
  }

  await prisma.eventInfo.update({
    where: { id: "singleton" },
    data: {
      ...data,
      dataCasamento,
      fotoCapaUrl: data.fotoCapaUrl || null,
      galeriaUrls,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");

  return { success: true };
}
