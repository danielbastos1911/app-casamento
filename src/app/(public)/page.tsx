import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { CountdownTimer } from "@/components/site/CountdownTimer";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function HomePage() {
  const eventInfo = await prisma.eventInfo.findUnique({ where: { id: "singleton" } });

  if (!eventInfo) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center text-neutral-500">
        O site ainda não foi configurado. Acesse o painel admin para preencher as informações.
      </main>
    );
  }

  return (
    <main>
      <section className="relative flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        {eventInfo.fotoCapaUrl && (
          <div className="absolute inset-0 -z-10">
            <Image
              src={eventInfo.fotoCapaUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-20"
              style={{ objectPosition: eventInfo.fotoCapaPosicao }}
            />
          </div>
        )}
        <p className="text-sm uppercase tracking-[0.3em] text-rose-500">Vamos nos casar</p>
        <h1 className="font-serif text-4xl text-neutral-900 sm:text-5xl">
          {eventInfo.nomeNoivo} &amp; {eventInfo.nomeNoiva}
        </h1>
        <p className="text-neutral-600">{dateFormatter.format(eventInfo.dataCasamento)}</p>
        <CountdownTimer targetDate={eventInfo.dataCasamento.toISOString()} />
      </section>

      <section id="historia" className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="mb-4 font-serif text-2xl text-neutral-900">Nossa história</h2>
        <p className="whitespace-pre-line text-neutral-600">{eventInfo.historia}</p>
      </section>

      <section id="local" className="bg-white py-16">
        <div className="mx-auto grid max-w-3xl gap-10 px-4 sm:grid-cols-2">
          <div className="text-center">
            <h3 className="mb-2 font-serif text-xl text-neutral-900">Cerimônia</h3>
            <p className="text-neutral-800">{eventInfo.cerimoniaLocal}</p>
            <p className="text-sm text-neutral-500">{eventInfo.cerimoniaEndereco}</p>
            <p className="mt-1 text-sm text-neutral-500">{eventInfo.cerimoniaHorario}</p>
          </div>
          <div className="text-center">
            <h3 className="mb-2 font-serif text-xl text-neutral-900">Recepção</h3>
            <p className="text-neutral-800">{eventInfo.recepcaoLocal}</p>
            <p className="text-sm text-neutral-500">{eventInfo.recepcaoEndereco}</p>
            <p className="mt-1 text-sm text-neutral-500">{eventInfo.recepcaoHorario}</p>
          </div>
        </div>
      </section>

      {eventInfo.galeriaUrls.length > 0 && (
        <section id="galeria" className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="mb-6 text-center font-serif text-2xl text-neutral-900">Galeria</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {eventInfo.galeriaUrls.map((url) => (
              <div key={url} className="relative aspect-square overflow-hidden rounded-md bg-neutral-100">
                <Image src={url} alt="" fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
