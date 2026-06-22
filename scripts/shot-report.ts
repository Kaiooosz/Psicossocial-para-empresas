import puppeteer from "puppeteer-core";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET = process.env.SESSION_SECRET ?? "dev-secret-local-troque-em-producao";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function main() {
  const admin = await prisma.adminUser.findFirst();
  if (!admin) throw new Error("sem admin");

  const lead = await prisma.respondente.findFirst({
    where: { origem: "PUBLICO" },
    orderBy: { respondidoEm: "desc" },
  });
  if (!lead) throw new Error("sem lead publico");

  console.log("lead:", lead.id, lead.contatoNome);

  const sig = crypto.createHmac("sha256", SECRET).update(admin.id).digest("hex");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--hide-scrollbars"],
  });

  const page = await browser.newPage();
  await page.setCookie({
    name: "rp_session",
    value: `${admin.id}.${sig}`,
    domain: "localhost",
    path: "/",
  });
  await page.setViewport({ width: 1320, height: 1100, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:3100/admin/leads/${lead.id}`, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: "/tmp/rpshots/60-relatorio-topo.png" });

  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: "/tmp/rpshots/61-relatorio-tabela.png" });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: "/tmp/rpshots/62-relatorio-legenda.png" });

  console.log("screenshots ok");
  await browser.close();
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
