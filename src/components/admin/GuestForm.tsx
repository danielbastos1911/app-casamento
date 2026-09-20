"use client";

import { useActionState, useState } from "react";
import type { GuestFormState } from "@/app/admin/convidados/actions";

const initialState: GuestFormState = {};

export function GuestForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: GuestFormState, formData: FormData) => Promise<GuestFormState>;
  defaultValues?: {
    nome: string;
    grupo: string | null;
    telefone: string | null;
    email: string | null;
    acompanhantes?: string[];
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [acompanhantes, setAcompanhantes] = useState<string[]>(defaultValues?.acompanhantes ?? []);

  function updateAcompanhante(index: number, value: string) {
    setAcompanhantes((prev) => prev.map((f, i) => (i === index ? value : f)));
  }

  function removeAcompanhante(index: number) {
    setAcompanhantes((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="nome">
            Nome *
          </label>
          <input
            id="nome"
            name="nome"
            required
            defaultValue={defaultValues?.nome}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="grupo">
            Grupo / lado
          </label>
          <input
            id="grupo"
            name="grupo"
            placeholder="Ex: família da noiva"
            defaultValue={defaultValues?.grupo ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="telefone">
            Telefone
          </label>
          <input
            id="telefone"
            name="telefone"
            defaultValue={defaultValues?.telefone ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues?.email ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-neutral-700">
          Acompanhantes (opcional — cônjuge, namorado(a), filhos...)
        </span>
        <div className="space-y-2">
          {acompanhantes.map((nome, index) => (
            <div key={index} className="flex gap-2">
              <input
                name="acompanhantes"
                value={nome}
                onChange={(e) => updateAcompanhante(index, e.target.value)}
                className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeAcompanhante(index)}
                className="rounded-md border border-neutral-300 px-3 text-sm text-neutral-500 hover:bg-neutral-50"
              >
                remover
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setAcompanhantes((prev) => [...prev, ""])}
          className="mt-2 text-sm text-rose-600 hover:underline"
        >
          + adicionar acompanhante
        </button>
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.success && <p className="text-sm text-green-600">Convidado salvo.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:opacity-60"
      >
        {pending ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}
