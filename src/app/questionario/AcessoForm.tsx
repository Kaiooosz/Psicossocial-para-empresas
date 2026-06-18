"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowRight } from "lucide-react";

export default function AcessoForm({ erro }: { erro?: boolean }) {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    const c = codigo.trim();
    if (c) router.push(`/questionario?token=${encodeURIComponent(c)}`);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center border border-border">
        <KeyRound className="h-5 w-5 text-ink" strokeWidth={1.5} />
      </span>
      <h1 className="mt-6 text-2xl font-semibold text-ink">
        {erro ? "Código de acesso inválido" : "Acessar o questionário"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {erro
          ? "Não encontramos um questionário para este código. Confira se digitou corretamente — ele é único e individual."
          : "O link é enviado individualmente para cada participante por e-mail ou WhatsApp. Recebeu um código de acesso? Informe abaixo para começar."}
      </p>

      <form onSubmit={entrar} className="mt-8 w-full">
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Seu código de acesso"
          className="w-full border border-border bg-card px-4 py-3 text-center text-sm tracking-wider text-ink outline-none focus:border-ink"
        />
        <button
          type="submit"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Ir para as perguntas <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-xs text-muted">
        Ainda não tem um link? Sua empresa deve solicitar a análise ao Bezerra
        Borges Advogados.
      </p>
    </div>
  );
}
