import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Building2, Briefcase } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreLead } from "@/lib/metrics";
import {
  COR_RESPOSTA,
  NIVEL_META,
  NOME_PILAR,
  type Pilar,
  type ValorResposta,
} from "@/lib/scoring";
import AdminShell from "../../AdminShell";

export const dynamic = "force-dynamic";

const PILARES: Pilar[] = ["CULTURA", "ORGANIZACAO", "METAS", "LIDERANCA"];
const ORDENS = Array.from({ length: 15 }, (_, i) => i + 1);

function soDigitos(s: string) {
  return s.replace(/\D/g, "");
}

export default async function LeadDetalhe({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;

  const lead = await prisma.respondente.findUnique({
    where: { id },
    include: {
      respostas: { include: { pergunta: true } },
    },
  });
  if (!lead || lead.origem !== "PUBLICO") notFound();

  const scores = scoreLead(lead.respostas);

  // Mapa: pilar -> ordem -> valor
  const mapa = new Map<string, ValorResposta>();
  for (const r of lead.respostas) {
    mapa.set(`${r.pergunta.pilar}-${r.pergunta.ordem}`, r.valor as ValorResposta);
  }

  const wa = lead.contatoTelefone ? soDigitos(lead.contatoTelefone) : null;

  return (
    <AdminShell nome={admin.nome}>
      <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{lead.contatoNome ?? "Lead"}</h1>
          <p className="mt-1 text-sm text-muted">
            {lead.tipo === "LIDER" ? "Líder / Gestor" : "Colaborador"} ·
            respondeu em {lead.respondidoEm?.toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="flex gap-2">
          {lead.contatoEmail && (
            <a href={`mailto:${lead.contatoEmail}`} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/40">
              <Mail className="h-4 w-4" /> E-mail
            </a>
          )}
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Contato */}
      <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Dado icon={<Building2 className="h-4 w-4" />} label="Empresa" valor={lead.contatoEmpresa} />
        <Dado icon={<Briefcase className="h-4 w-4" />} label="Cargo" valor={lead.contatoCargo} />
        <Dado icon={<Mail className="h-4 w-4" />} label="E-mail" valor={lead.contatoEmail} />
        <Dado icon={<MessageCircle className="h-4 w-4" />} label="WhatsApp" valor={lead.contatoTelefone} />
      </div>

      {/* Pontuacoes */}
      <h2 className="mt-12 text-lg font-bold tracking-tight">Pontuação por pilar</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scores.map((s) => {
          const meta = NIVEL_META[s.nivel];
          return (
            <div key={s.pilar} className="rounded-lg border border-border p-5" style={{ background: meta.bg }}>
              <p className="text-2xl font-bold" style={{ color: meta.cor }}>{s.indice.toFixed(1)}</p>
              <p className="text-xs font-semibold" style={{ color: meta.cor }}>{meta.label}</p>
              <p className="mt-2 text-[11px] text-foreground/60">{NOME_PILAR[s.pilar]}</p>
            </div>
          );
        })}
      </div>

      {/* Mapa de calor */}
      <h2 className="mt-12 text-lg font-bold tracking-tight">Mapa de calor</h2>
      <p className="mt-1 text-sm text-muted">
        Cada célula é uma pergunta (1 a 15 por pilar). Quanto mais vermelho, maior o risco sinalizado.
      </p>
      <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-card p-5">
        <div className="min-w-[640px]">
          <div className="flex items-center gap-1 pl-44">
            {ORDENS.map((o) => (
              <span key={o} className="w-6 text-center text-[10px] text-muted">{o}</span>
            ))}
          </div>
          {PILARES.map((pilar) => (
            <div key={pilar} className="mt-1 flex items-center gap-1">
              <span className="w-44 pr-2 text-xs text-ink">{NOME_PILAR[pilar]}</span>
              {ORDENS.map((o) => {
                const v = mapa.get(`${pilar}-${o}`);
                return (
                  <span
                    key={o}
                    title={v ? COR_RESPOSTA[v].label : "—"}
                    className="h-6 w-6 rounded-sm"
                    style={{ background: v ? COR_RESPOSTA[v].bg : "#eef0f3" }}
                  />
                );
              })}
            </div>
          ))}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {(Object.keys(COR_RESPOSTA) as ValorResposta[]).map((v) => (
              <span key={v} className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-3 w-3 rounded-sm" style={{ background: COR_RESPOSTA[v].bg }} />
                {COR_RESPOSTA[v].label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Dado({ icon, label, valor }: { icon: React.ReactNode; label: string; valor?: string | null }) {
  return (
    <div className="bg-card p-5">
      <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
        {icon} {label}
      </span>
      <p className="mt-2 text-sm text-ink">{valor || "—"}</p>
    </div>
  );
}
