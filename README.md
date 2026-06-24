# Analise de Risco Psicossocial (NR-1)

Plataforma de mapeamento de risco psicossocial organizacional conforme a NR-1. Metodologia e propriedade intelectual de **Anna Clara Silva Freitas**.

## Sobre

Coleta questionarios anonimos de colaboradores e lideres, calcula indice de risco por pilar e exibe os resultados num painel administrativo. O respondente nunca ve o resultado — somente a equipe interna tem acesso.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Prisma 6 + PostgreSQL (Neon)
- Auth admin via cookie HMAC
- Lucide React (icones)

## Metodologia

- **4 pilares**: Cultura Organizacional, Organizacao do Trabalho, Metas e Performance, Lideranca e Gestao de Pessoas
- **120 perguntas** (15/pilar x 2 publicos: colaborador e lider)
- Todas em sentido negativo
- **Pontuacao**: Concordo 6.667 | Parciais 3.333 | Neutro/Discordo 0
- **Indice**: soma das pontuacoes / n respondentes (0-100)
- **Niveis**: Gravissimo >90 | Grave 70-90 | Medio 50-70 | Baixo <50

## Rotas

| Rota | Funcao |
|------|--------|
| `/` | Landing do produto (NR-1, pilares, metodologia, entregaveis, CTA) |
| `/questionario?token=...` | Formulario do respondente (anonimo, anti-reenvio) |
| `/obrigado` | Confirmacao pos-envio |
| `/admin/login` | Login administrativo |
| `/admin` | Painel: empresas, tokens, indices, taxa de resposta |

## Modelos

Empresa, Respondente (anonimo: token + tipo + status), Pergunta, Resposta (valor + pontuacao), AdminUser.

## Comandos

```bash
npm run db:push     # Criar tabelas
npm run db:seed     # Populer 120 perguntas + admin
npm run dev         # Servidor de desenvolvimento (porta 3100)
```

Admin seed: `admin@riscopsicossocial.com.br` / `anna2026` (via .env)

## Licenca

Propriedade de **Anna Clara Silva Freitas** / **BBLAW**. Uso restrito.
