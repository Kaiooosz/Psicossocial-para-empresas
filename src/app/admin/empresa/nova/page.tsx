import { requireAdmin } from "@/lib/auth";
import AdminShell from "../../AdminShell";
import NovaEmpresaForm from "./NovaEmpresaForm";

export default async function NovaEmpresaPage() {
  const admin = await requireAdmin();
  return (
    <AdminShell nome={admin.nome}>
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold tracking-tight">Nova empresa</h1>
        <p className="mt-1 text-sm text-muted">
          Cadastre a empresa e informe quantos respondentes de cada tipo. O
          sistema gera um link único e anônimo para cada pessoa.
        </p>
        <NovaEmpresaForm />
      </div>
    </AdminShell>
  );
}
