import puppeteer from "puppeteer-core";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:3100";
const SECRET = process.env.SESSION_SECRET ?? "dev-secret-local-troque-em-producao";

async function main() {
  const admin = await prisma.adminUser.findFirst();
  const empresa = await prisma.empresa.findFirst({ where: { nome: "Empresa Demo" } });
  const sig = crypto.createHmac("sha256", SECRET).update(admin!.id).digest("hex");
  const cookieValue = `${admin!.id}.${sig}`;

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--hide-scrollbars"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
  });

  async function shot(path: string, file: string, full = true, auth = false) {
    const page = await browser.newPage();
    if (auth) {
      await page.setCookie({ name: "rp_session", value: cookieValue, domain: "localhost", path: "/" });
    }
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: `/tmp/rpshots/${file}` as `${string}.png`, fullPage: full });
    console.log(`${file} OK`);
    await page.close();
  }

  await shot("/", "01-landing.png", true);
  await shot("/questionario?token=demo-lider-001", "02-questionario.png", true);
  await shot("/admin", "04-admin.png", true, true);
  if (empresa) await shot(`/admin/empresa/${empresa.id}`, "05-dashboard.png", true, true);
  await shot("/admin/login", "03-login.png", false);

  await browser.close();
  await prisma.$disconnect();
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
