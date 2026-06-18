import Link from "next/link";
import { Plus, Building2, ArrowRight } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const admin = await requireAdmin();

  const empresas = await prisma.empresa.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      respondentes: { select: { respondeu: true } },
    },
  });

  return (
    <AdminShell nome={admin.nome}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Empresas</h1>
          <p className="mt-1 text-sm text-muted">
            Análises em andamento e concluídas.
          </p>
        </div>
        <Link
          href="/admin/empresa/nova"
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nova empresa
        </Link>
      </div>

      {empresas.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <Building2 className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3 text-sm text-muted">
            Nenhuma empresa cadastrada ainda. Crie a primeira análise.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-5 py-3 font-medium">Empresa</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Respostas</th>
                <th className="px-5 py-3 font-medium">Início</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((e) => {
                const total = e.respondentes.length;
                const resp = e.respondentes.filter((r) => r.respondeu).length;
                const pct = total ? Math.round((resp / total) * 100) : 0;
                return (
                  <tr
                    key={e.id}
                    className="border-b border-border last:border-0 transition hover:bg-background"
                  >
                    <td className="px-5 py-4 font-medium">{e.nome}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          e.status === "CONCLUIDO"
                            ? "bg-brand-2/10 text-brand-2"
                            : "bg-accent/15 text-amber-700"
                        }`}
                      >
                        {e.status === "CONCLUIDO" ? "Concluído" : "Em andamento"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {resp}/{total} ({pct}%)
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {e.inicioEm.toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/empresa/${e.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                      >
                        Abrir <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
