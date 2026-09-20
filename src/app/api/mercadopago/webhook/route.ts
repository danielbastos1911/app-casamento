import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { reconcilePayment } from "@/lib/order-reconciliation";

function isValidSignature(request: Request, dataId: string) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true; // sem secret configurado (ex: dev local) — pula a checagem

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");
  if (!xSignature || !xRequestId) return false;

  const parts = Object.fromEntries(
    xSignature.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key?.trim(), value?.trim()];
    })
  );
  const ts = parts.ts;
  const receivedHash = parts.v1;
  if (!ts || !receivedHash) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${xRequestId};ts:${ts};`;
  const expectedHash = createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(receivedHash), Buffer.from(expectedHash));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") ?? url.searchParams.get("topic");
  const dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");

  if (type !== "payment" || !dataId) {
    return NextResponse.json({ received: true });
  }

  if (!isValidSignature(request, dataId)) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }

  try {
    await reconcilePayment(dataId);
  } catch (error) {
    console.error("Erro ao reconciliar pagamento do webhook:", error);
  }

  return NextResponse.json({ received: true });
}
