"use client";

import { useActionState } from "react";
import { createOrder, type PurchaseFormState } from "@/app/(public)/presentes/[id]/actions";

const initialState: PurchaseFormState = {};

export function PurchaseForm({ giftId }: { giftId: string }) {
  const action = createOrder.bind(null, giftId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4 text-left">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="nomeComprador">
          Seu nome *
        </label>
        <input
          id="nomeComprador"
          name="nomeComprador"
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="mensagem">
          Mensagem para os noivos (opcional)
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={3}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:opacity-60"
      >
        {pending ? "Preparando pagamento..." : "Presentear (cartão ou PIX)"}
      </button>
    </form>
  );
}
