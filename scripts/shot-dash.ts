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

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--hide-scrollbars"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  await page.setCookie({ name: "rp_session", value: `${admin!.id}.${sig}`, domain: "localhost", path: "/" });
  await page.goto(`${BASE}/admin/empresa/${empresa!.id}`, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: "/tmp/rpshots/20-dashboard.png", fullPage: true });
  console.log("20-dashboard.png OK");
  await browser.close();
  await prisma.$disconnect();
}
main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
