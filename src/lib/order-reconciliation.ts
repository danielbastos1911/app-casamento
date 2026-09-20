import { prisma } from "@/lib/prisma";
import { paymentClient } from "@/lib/mercadopago";

function mapStatus(mpStatus: string | undefined): "APROVADO" | "RECUSADO" | "CANCELADO" | "PENDENTE" {
  switch (mpStatus) {
    case "approved":
      return "APROVADO";
    case "rejected":
      return "RECUSADO";
    case "cancelled":
    case "refunded":
    case "charged_back":
      return "CANCELADO";
    default:
      return "PENDENTE";
  }
}

export async function reconcilePayment(paymentId: string) {
  const payment = await paymentClient.get({ id: paymentId });

  const orderId = payment.external_reference;
  if (!orderId) return;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;

  const status = mapStatus(payment.status);

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      mercadoPagoPaymentId: String(payment.id),
      metodoPagamento: payment.payment_type_id ?? null,
    },
  });

  if (status === "APROVADO") {
    await prisma.gift.update({
      where: { id: order.giftId },
      data: { disponivel: false },
    });
  }
}
