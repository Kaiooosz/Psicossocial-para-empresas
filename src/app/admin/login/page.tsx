"use client";

import { useActionState } from "react";
import { ShieldCheck } from "lucide-react";
import { loginAdmin } from "@/lib/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAdmin, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand text-white">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-brand">Painel interno</h1>
          <p className="mt-1 text-sm text-muted">
            Acesso restrito à equipe de análise.
          </p>
        </div>

        <form action={action} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted">E-mail</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Senha</label>
            <input
              name="senha"
              type="password"
              required
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          {state?.erro && (
            <p className="text-sm font-medium text-red-600">{state.erro}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
