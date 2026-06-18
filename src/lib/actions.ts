"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { criarSessao, encerrarSessao, getAdmin } from "./auth";
import { gerarToken } from "./token";
import { PONTUACAO, type ValorResposta } from "./scoring";

export async function loginAdmin(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  if (!email || !senha) return { erro: "Preencha e-mail e senha." };

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(senha, user.senhaHash))) {
    return { erro: "Credenciais inválidas." };
  }
  await criarSessao(user.id);
  redirect("/admin");
}

export async function logoutAdmin() {
  await encerrarSessao();
  redirect("/admin/login");
}

export async function criarEmpresa(_prev: unknown, formData: FormData) {
  const admin = await getAdmin();
  if (!admin) return { erro: "Não autorizado." };

  const nome = String(formData.get("nome") ?? "").trim();
  const colaboradores = Number(formData.get("colaboradores") ?? 0);
  const lideres = Number(formData.get("lideres") ?? 0);

  if (!nome) return { erro: "Informe o nome da empresa." };
  if (colaboradores < 0 || lideres < 0 || colaboradores + lideres === 0) {
    return { erro: "Informe ao menos um respondente." };
  }

  const empresa = await prisma.empresa.create({ data: { nome } });

  const data = [
    ...Array.from({ length: colaboradores }, () => ({
      empresaId: empresa.id,
      tipo: "COLABORADOR" as const,
      token: gerarToken(),
    })),
    ...Array.from({ length: lideres }, () => ({
      empresaId: empresa.id,
      tipo: "LIDER" as const,
      token: gerarToken(),
    })),
  ];
  await prisma.respondente.createMany({ data });

  revalidatePath("/admin");
  redirect(`/admin/empresa/${empresa.id}`);
}

export async function submeterQuestionario(
  token: string,
  respostas: Record<number, ValorResposta>
): Promise<{ ok: boolean; erro?: string }> {
  const respondente = await prisma.respondente.findUnique({
    where: { token },
  });
  if (!respondente) return { ok: false, erro: "Link inválido." };
  if (respondente.respondeu) return { ok: false, erro: "Questionário já respondido." };

  const perguntas = await prisma.pergunta.findMany({
    where: { publico: respondente.tipo },
    select: { id: true },
  });

  for (const p of perguntas) {
    if (!respostas[p.id]) {
      return { ok: false, erro: "Responda todas as perguntas antes de enviar." };
    }
  }

  await prisma.$transaction([
    prisma.resposta.createMany({
      data: perguntas.map((p) => ({
        respondenteId: respondente.id,
        perguntaId: p.id,
        valor: respostas[p.id],
        pontuacao: PONTUACAO[respostas[p.id]],
      })),
    }),
    prisma.respondente.update({
      where: { id: respondente.id },
      data: { respondeu: true, respondidoEm: new Date() },
    }),
  ]);

  return { ok: true };
}
