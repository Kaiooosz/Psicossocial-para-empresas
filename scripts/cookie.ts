import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
const prisma = new PrismaClient();
const SECRET = process.env.SESSION_SECRET ?? "dev-secret-troque-em-producao";
async function main() {
  const admin = await prisma.adminUser.findFirst();
  if (!admin) throw new Error("sem admin");
  const h = crypto.createHmac("sha256", SECRET).update(admin.id).digest("hex");
  console.log(`rp_session=${admin.id}.${h}`);
}
main().then(() => prisma.$disconnect());
