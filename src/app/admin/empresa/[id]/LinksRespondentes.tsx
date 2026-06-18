"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type Item = { token: string; tipo: string; respondeu: boolean };

export default function LinksRespondentes({
  itens,
  baseUrl,
}: {
  itens: Item[];
  baseUrl: string;
}) {
  const [copiado, setCopiado] = useState<string | null>(null);

  function url(token: string) {
    return `${baseUrl}/questionario?token=${token}`;
  }

  async function copiar(token: string) {
    await navigator.clipboard.writeText(url(token));
    setCopiado(token);
    setTimeout(() => setCopiado(null), 1500);
  }

  async function copiarTodos(tipo: string) {
    const lista = itens
      .filter((i) => i.tipo === tipo)
      .map((i) => url(i.token))
      .join("\n");
    await navigator.clipboard.writeText(lista);
    setCopiado(`todos-${tipo}`);
    setTimeout(() => setCopiado(null), 1500);
  }

  const grupos = ["COLABORADOR", "LIDER"] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {grupos.map((tipo) => {
        const lista = itens.filter((i) => i.tipo === tipo);
        if (lista.length === 0) return null;
        return (
          <div
            key={tipo}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {tipo === "LIDER" ? "Líderes" : "Colaboradores"} ({lista.length})
              </h3>
              <button
                onClick={() => copiarTodos(tipo)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted transition hover:text-foreground"
              >
                {copiado === `todos-${tipo}` ? (
                  <Check className="h-3.5 w-3.5 text-brand-2" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Copiar todos
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {lista.map((i) => (
                <li
                  key={i.token}
                  className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2"
                >
                  <code className="truncate text-xs text-muted">
                    /questionario?token={i.token}
                  </code>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        i.respondeu
                          ? "bg-brand-2/10 text-brand-2"
                          : "bg-border text-muted"
                      }`}
                    >
                      {i.respondeu ? "respondeu" : "pendente"}
                    </span>
                    <button
                      onClick={() => copiar(i.token)}
                      className="text-muted transition hover:text-foreground"
                      title="Copiar link"
                    >
                      {copiado === i.token ? (
                        <Check className="h-4 w-4 text-brand-2" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
