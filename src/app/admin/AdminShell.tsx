import Link from "next/link";
import { ShieldCheck, LogOut } from "lucide-react";
import { logoutAdmin } from "@/lib/actions";

export default function AdminShell({
  nome,
  children,
}: {
  nome: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-brand">Painel interno</p>
              <p className="text-[11px] uppercase tracking-wider text-muted">
                Risco Psicossocial
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-1 sm:flex">
              <Link href="/admin" className="rounded-md px-3 py-1.5 text-sm text-muted transition hover:text-foreground">
                Empresas
              </Link>
              <Link href="/admin/leads" className="rounded-md px-3 py-1.5 text-sm text-muted transition hover:text-foreground">
                Leads
              </Link>
            </nav>
            <span className="text-sm text-muted">{nome}</span>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted transition hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
