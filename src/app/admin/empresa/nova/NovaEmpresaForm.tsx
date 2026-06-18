"use client";

import { useActionState } from "react";
import { criarEmpresa } from "@/lib/actions";

export default function NovaEmpresaForm() {
  const [state, action, pending] = useActionState(criarEmpresa, null);

  return (
    <form
      action={action}
      className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6"
    >
      <div>
        <label className="text-xs font-medium text-muted">Nome da empresa</label>
        <input
          name="nome"
          required
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
          placeholder="Ex: Acme Indústria Ltda"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted">Colaboradores</label>
          <input
            name="colaboradores"
            type="number"
            min={0}
            defaultValue={0}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Líderes</label>
          <input
            name="lideres"
            type="number"
            min={0}
            defaultValue={0}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
      </div>
      {state?.erro && (
        <p className="text-sm font-medium text-red-600">{state.erro}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Gerando links..." : "Cadastrar e gerar links"}
      </button>
    </form>
  );
}
