import crypto from "crypto";

// Token curto, sem caracteres ambiguos, aleatorio e intransferivel.
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnpqrstuvwxyz";

export function gerarToken(tamanho = 10): string {
  const bytes = crypto.randomBytes(tamanho);
  let out = "";
  for (let i = 0; i < tamanho; i++) {
    out += ALFABETO[bytes[i] % ALFABETO.length];
  }
  return out;
}
