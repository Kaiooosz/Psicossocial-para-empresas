import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:3100";

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--hide-scrollbars"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
  });

  async function shot(path: string, file: string, full = true) {
    const page = await browser.newPage();
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: `/tmp/rpshots/${file}` as `${string}.png`, fullPage: full });
    console.log(`${file} OK`);
    await page.close();
  }

  await shot("/", "10-landing.png", true);
  await shot("/questionario", "11-acesso.png", false);
  await shot("/questionario?token=demo-lider-001", "12-questionario.png", false);
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
