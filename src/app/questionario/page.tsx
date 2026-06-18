import { ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { NOME_PILAR, type Pilar } from "@/lib/scoring";
import QuestionarioForm from "./QuestionarioForm";

export const dynamic = "force-dynamic";

const ORDEM_PILARES: Pilar[] = ["CULTURA", "ORGANIZACAO", "METAS", "LIDERANCA"];

function Aviso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <ShieldCheck className="h-10 w-10 text-brand" />
      <h1 className="mt-4 text-2xl font-bold text-brand">{titulo}</h1>
      <p className="mt-2 text-muted">{texto}</p>
    </div>
  );
}

export default async function QuestionarioPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token) {
    return (
      <Aviso
        titulo="Link inválido"
        texto="Este endereço não contém um token de acesso válido."
      />
    );
  }

  const respondente = await prisma.respondente.findUnique({
    where: { token },
    include: { empresa: true },
  });

  if (!respondente) {
    return (
      <Aviso
        titulo="Link inválido"
        texto="Não encontramos um questionário para este link. Verifique se copiou o endereço completo."
      />
    );
  }

  if (respondente.respondeu) {
    return (
      <Aviso
        titulo="Questionário já respondido"
        texto="Este link já foi utilizado. Cada pessoa responde apenas uma vez. Obrigado pela participação."
      />
    );
  }

  const perguntas = await prisma.pergunta.findMany({
    where: { publico: respondente.tipo },
    orderBy: [{ pilar: "asc" }, { ordem: "asc" }],
  });

  const grupos = ORDEM_PILARES.map((pilar) => ({
    pilar,
    nome: NOME_PILAR[pilar],
    perguntas: perguntas
      .filter((p) => p.pilar === pilar)
      .map((p) => ({ id: p.id, texto: p.texto })),
  }));

  return (
    <QuestionarioForm
      token={token}
      tipo={respondente.tipo}
      grupos={grupos}
    />
  );
}
