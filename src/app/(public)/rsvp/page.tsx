export default function RsvpInfoPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="mb-4 font-serif text-3xl text-neutral-900">Confirme sua presença</h1>
      <p className="text-neutral-600">
        Você deve ter recebido um link pessoal de convite para confirmar sua presença. Ele se
        parece com algo como <span className="font-mono text-sm">/rsvp/seu-codigo</span>.
      </p>
      <p className="mt-4 text-neutral-600">
        Não encontrou o seu link? Fale diretamente com os noivos para receber novamente.
      </p>
    </main>
  );
}
