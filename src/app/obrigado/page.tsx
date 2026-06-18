import { CheckCircle2 } from "lucide-react";

export default function ObrigadoPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center border border-border">
        <CheckCircle2 className="h-9 w-9 text-ink" strokeWidth={1.5} />
      </span>
      <h1 className="mt-6 text-2xl font-semibold text-ink">
        Respostas enviadas com sucesso
      </h1>
      <p className="mt-3 text-muted">
        Obrigado pela sua participação. Suas respostas foram registradas de forma
        anônima e contribuem para o diagnóstico de saúde organizacional da sua
        empresa. Você já pode fechar esta página.
      </p>
    </div>
  );
}
