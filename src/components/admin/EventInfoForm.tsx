"use client";

import { useActionState } from "react";
import type { EventInfoModel as EventInfo } from "@/generated/prisma/models";
import { updateEventInfo, type EventInfoFormState } from "@/app/admin/actions";
import { CoverImageField } from "./CoverImageField";
import { GalleryField } from "./GalleryField";

const initialState: EventInfoFormState = {};

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
      />
    </div>
  );
}

export function EventInfoForm({ eventInfo }: { eventInfo: EventInfo }) {
  const [state, formAction, pending] = useActionState(updateEventInfo, initialState);

  return (
    <form action={formAction} className="space-y-8">
      <section>
        <h2 className="mb-3 font-serif text-lg text-neutral-800">O casal</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nome do noivo" name="nomeNoivo" defaultValue={eventInfo.nomeNoivo} />
          <Field label="Nome da noiva" name="nomeNoiva" defaultValue={eventInfo.nomeNoiva} />
        </div>
        <Field
          label="Data e hora do casamento"
          name="dataCasamento"
          type="datetime-local"
          defaultValue={toDatetimeLocal(eventInfo.dataCasamento)}
        />
        <div className="mb-1 text-sm font-medium text-neutral-700">Nossa história</div>
        <textarea
          name="historia"
          defaultValue={eventInfo.historia}
          rows={5}
          className="mb-4 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
        />
      </section>

      <section>
        <h2 className="mb-3 font-serif text-lg text-neutral-800">Cerimônia</h2>
        <Field label="Local" name="cerimoniaLocal" defaultValue={eventInfo.cerimoniaLocal} />
        <Field label="Endereço" name="cerimoniaEndereco" defaultValue={eventInfo.cerimoniaEndereco} />
        <Field label="Horário" name="cerimoniaHorario" defaultValue={eventInfo.cerimoniaHorario} />
      </section>

      <section>
        <h2 className="mb-3 font-serif text-lg text-neutral-800">Recepção</h2>
        <Field label="Local" name="recepcaoLocal" defaultValue={eventInfo.recepcaoLocal} />
        <Field label="Endereço" name="recepcaoEndereco" defaultValue={eventInfo.recepcaoEndereco} />
        <Field label="Horário" name="recepcaoHorario" defaultValue={eventInfo.recepcaoHorario} />
      </section>

      <section>
        <h2 className="mb-3 font-serif text-lg text-neutral-800">Foto de capa</h2>
        <CoverImageField initialUrl={eventInfo.fotoCapaUrl} initialPosition={eventInfo.fotoCapaPosicao} />
      </section>

      <section>
        <h2 className="mb-3 font-serif text-lg text-neutral-800">Galeria de fotos</h2>
        <GalleryField initialUrls={eventInfo.galeriaUrls} />
      </section>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.success && <p className="text-sm text-green-600">Salvo com sucesso.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-rose-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
