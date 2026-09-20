import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

const statusLabel: Record<string, string> = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  RECUSADO: "Recusado",
  CANCELADO: "Cancelado",
};

const statusClass: Record<string, string> = {
  PENDENTE: "bg-neutral-100 text-neutral-600",
  APROVADO: "bg-green-100 text-green-700",
  RECUSADO: "bg-red-100 text-red-700",
  CANCELADO: "bg-neutral-200 text-neutral-500",
};

export default async function AdminOrdersPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { gift: true },
  });

  const totalArrecadado = orders
    .filter((o) => o.status === "APROVADO")
    .reduce((sum, o) => sum + Number(o.valor), 0);

  return (
    <div>
      <h1 className="mb-2 font-serif text-2xl text-neutral-900">Pedidos de presentes</h1>
      <p className="mb-6 text-sm text-neutral-600">
        Total arrecadado (pedidos aprovados): <strong>{currency.format(totalArrecadado)}</strong>
      </p>

      {orders.length === 0 ? (
        <p className="text-sm text-neutral-500">Nenhum pedido ainda.</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-1 rounded-md border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900">{order.gift.nome}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass[order.status]}`}>
                    {statusLabel[order.status]}
                  </span>
                </div>
                <div className="text-xs text-neutral-500">
                  {order.nomeComprador} · {currency.format(Number(order.valor))}
                  {order.metodoPagamento && ` · ${order.metodoPagamento}`}
                </div>
                {order.mensagem && (
                  <div className="mt-1 text-xs italic text-neutral-500">“{order.mensagem}”</div>
                )}
              </div>
              <div className="text-xs text-neutral-400">{dateFormatter.format(order.createdAt)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
