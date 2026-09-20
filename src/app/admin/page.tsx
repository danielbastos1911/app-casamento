import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { EventInfoForm } from "@/components/admin/EventInfoForm";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const eventInfo = await prisma.eventInfo.findUnique({ where: { id: "singleton" } });

  if (!eventInfo) {
    return <p className="text-neutral-600">Nenhuma informação de evento encontrada. Rode o seed.</p>;
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-neutral-900">Editar site do casamento</h1>
      <EventInfoForm eventInfo={eventInfo} />
    </div>
  );
}
