"use client";

import { useActionState } from "react";
import type { GiftFormState } from "@/app/admin/presentes/actions";
import { GiftImageField } from "./GiftImageField";

const initialState: GiftFormState = {};

export function GiftForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: GiftFormState, formData: FormData) => Promise<GiftFormState>;
  defaultValues?: {
    nome: string;
    descricao: string;
    imagemUrl: string | null;
    valor: string;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-3">
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
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="descricao">
          Descrição *
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={3}
          required
          defaultValue={defaultValues?.descricao}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="valor">
          Valor (R$) *
        </label>
        <input
          id="valor"
          name="valor"
          type="number"
          step="0.01"
          min="0.01"
          required
          defaultValue={defaultValues?.valor}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
        />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-neutral-700">Foto</span>
        <GiftImageField initialUrl={defaultValues?.imagemUrl ?? null} />
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.success && <p className="text-sm text-green-600">Presente salvo.</p>}

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
