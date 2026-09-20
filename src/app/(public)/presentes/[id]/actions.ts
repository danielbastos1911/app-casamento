"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { preferenceClient, isTestCredential } from "@/lib/mercadopago";
import { purchaseSchema } from "@/lib/validation";

export type PurchaseFormState = {
  error?: string;
};

export async function createOrder(
  giftId: string,
  _prevState: PurchaseFormState,
  formData: FormData
): Promise<PurchaseFormState> {
  const gift = await prisma.gift.findUnique({ where: { id: giftId } });
  if (!gift) {
    return { error: "Presente não encontrado." };
  }
  if (!gift.disponivel) {
    return { error: "Esse presente já foi escolhido por outra pessoa." };
  }

  const parsed = purchaseSchema.safeParse({
    nomeComprador: formData.get("nomeComprador"),
    mensagem: formData.get("mensagem") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Verifique os campos do formulário." };
  }

  const order = await prisma.order.create({
    data: {
      giftId: gift.id,
      nomeComprador: parsed.data.nomeComprador,
      mensagem: parsed.data.mensagem || null,
      valor: gift.valor,
    },
  });

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  let checkoutUrl: string | undefined;
  try {
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: gift.id,
            title: gift.nome,
            quantity: 1,
            unit_price: Number(gift.valor),
            currency_id: "BRL",
          },
        ],
        payer: {
          name: parsed.data.nomeComprador,
        },
        back_urls: {
          success: `${appUrl}/presentes/retorno`,
          failure: `${appUrl}/presentes/retorno`,
          pending: `${appUrl}/presentes/retorno`,
        },
        // auto_return exige back_urls em HTTPS; em dev local (http) o Mercado Pago rejeita a preferência.
        ...(appUrl.startsWith("https://") ? { auto_return: "approved" as const } : {}),
        notification_url: `${appUrl}/api/mercadopago/webhook`,
        external_reference: order.id,
      },
    });

    checkoutUrl = isTestCredential() ? preference.sandbox_init_point : preference.init_point;

    await prisma.order.update({
      where: { id: order.id },
      data: { mercadoPagoPreferenceId: preference.id },
    });
  } catch (error) {
    console.error("Erro ao criar preferência no Mercado Pago:", error);
    return { error: "Não foi possível iniciar o pagamento. Tente novamente em instantes." };
  }

  if (!checkoutUrl) {
    return { error: "Não foi possível iniciar o pagamento. Tente novamente em instantes." };
  }

  redirect(checkoutUrl);
}
