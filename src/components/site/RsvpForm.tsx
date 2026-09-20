"use client";

import { useActionState, useState } from "react";
import { submitRsvp, type RsvpFormState } from "@/app/(public)/rsvp/[codigo]/actions";

const initialState: RsvpFormState = {};

type Status = "CONFIRMADO" | "RECUSADO" | "PENDENTE";

export function RsvpForm({
  codigo,
  acompanhantes,
  defaultStatus,
  defaultAcompanhantesConfirmados,
  defaultRestricao,
  defaultMensagem,
}: {
  codigo: string;
  acompanhantes: string[];
  defaultStatus: Status;
  defaultAcompanhantesConfirmados: string[];
  defaultRestricao: string;
  defaultMensagem: string;
}) {
  const action = submitRsvp.bind(null, codigo);
  const [state, formAction, pending] = useActionState(action, initialState);

  const [editing, setEditing] = useState(defaultStatus === "PENDENTE");
  const [saved, setSaved] = useState({
    status: defaultStatus,
    acompanhantesConfirmados: defaultAcompanhantesConfirmados,
    restricao: defaultRestricao,
    mensagem: defaultMensagem,
  });

  const [status, setStatus] = useState<Status>(
    defaultStatus === "PENDENTE" ? "CONFIRMADO" : defaultStatus
  );
  const [acompanhantesConfirmados, setAcompanhantesConfirmados] = useState<string[]>(
    defaultAcompanhantesConfirmados
  );
  const [restricao, setRestricao] = useState(defaultRestricao);
  const [mensagem, setMensagem] = useState(defaultMensagem);

  function toggleAcompanhante(nome: string) {
    setAcompanhantesConfirmados((prev) =>
      prev.includes(nome) ? prev.filter((f) => f !== nome) : [...prev, nome]
    );
  }

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) {
      setSaved({ status, acompanhantesConfirmados, restricao, mensagem });
      setEditing(false);
    }
  }

  if (!editing) {
    return (
      <div className="rounded-md border border-neutral-200 bg-white p-6 text-left">
        <p className="mb-1 text-sm text-neutral-500">Sua resposta:</p>
        <p className="mb-4 text-lg font-medium text-neutral-900">
          {saved.status === "CONFIRMADO" ? "Vou comparecer 🎉" : "Não poderei ir"}
        </p>
        {saved.status === "CONFIRMADO" && (
          <>
            {acompanhantes.length > 0 && (
              <p className="text-sm text-neutral-600">
                Vêm com você:{" "}
                {acompanhantes
                  .map((f) => `${f}${saved.acompanhantesConfirmados.includes(f) ? " ✓" : " (não vem)"}`)
                  .join(", ")}
              </p>
            )}
            {saved.restricao && (
              <p className="text-sm text-neutral-600">Restrição alimentar: {saved.restricao}</p>
            )}
          </>
        )}
        {saved.mensagem && <p className="mt-2 text-sm italic text-neutral-500">“{saved.mensagem}”</p>}

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-5 w-full rounded-md border-2 border-rose-500 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          Alterar resposta
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 text-left">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStatus("CONFIRMADO")}
          className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition ${
            status === "CONFIRMADO"
              ? "border-rose-500 bg-rose-50 text-rose-700"
              : "border-neutral-300 text-neutral-600"
          }`}
        >
          Vou comparecer
        </button>
        <button
          type="button"
          onClick={() => setStatus("RECUSADO")}
          className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition ${
            status === "RECUSADO"
              ? "border-neutral-500 bg-neutral-100 text-neutral-800"
              : "border-neutral-300 text-neutral-600"
          }`}
        >
          Não poderei ir
        </button>
      </div>
      <input type="hidden" name="status" value={status} />

      {status === "CONFIRMADO" && (
        <>
          {acompanhantes.length > 0 && (
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">
                Quem mais vem com você?
              </span>
              <div className="space-y-1">
                {acompanhantes.map((nome) => (
                  <label key={nome} className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      name="acompanhantesConfirmados"
                      value={nome}
                      checked={acompanhantesConfirmados.includes(nome)}
                      onChange={() => toggleAcompanhante(nome)}
                      className="rounded border-neutral-300 text-rose-500 focus:ring-rose-400"
                    />
                    {nome}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="restricaoAlimentar">
              Alguma restrição alimentar?
            </label>
            <input
              id="restricaoAlimentar"
              name="restricaoAlimentar"
              value={restricao}
              onChange={(e) => setRestricao(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
            />
          </div>
        </>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="mensagem">
          Deixe uma mensagem para os noivos (opcional)
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={3}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        {saved.status !== "PENDENTE" && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:opacity-60"
        >
          {pending ? "Enviando..." : "Confirmar resposta"}
        </button>
      </div>
    </form>
  );
}
