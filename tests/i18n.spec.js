// English at /, Thai at /th/: prerendered, linked with hreflang, switchable, remembered.
// (react-helmet-async prints the attribute as hrefLang; HTML attribute names are case-insensitive)
import { test, expect } from "@playwright/test";

test("Thai pages are prerendered with lang, hreflang and canonical", async ({ request }) => {
  const html = await (await request.get("/th/blogs/preparing-for-ctf/")).text();
  expect(html).toContain('<html lang="th">');
  expect(html).toContain("เตรียมตัวลง CTF ครั้งแรก");
  expect(html).toContain("การแข่ง Capture The Flag (CTF)");
  expect(html).toMatch(/rel="canonical" href="https:\/\/watkorn\.me\/th\/blogs\/preparing-for-ctf\/"/);
  expect(html).toMatch(/hreflang="en" href="https:\/\/watkorn\.me\/blogs\/preparing-for-ctf\/"/i);
  expect(html).toMatch(/hreflang="x-default" href="https:\/\/watkorn\.me\/blogs\/preparing-for-ctf\/"/i);
  expect(html).toContain('property="og:locale" content="th_TH"');

  const en = await (await request.get("/")).text();
  expect(en).toContain('<html lang="en">');
  expect(en).toMatch(/hreflang="th" href="https:\/\/watkorn\.me\/th\/"/i);
});

test("Thai feed and a sitemap with alternates", async ({ request }) => {
  const rss = await (await request.get("/th/rss.xml")).text();
  expect(rss).toContain("<language>th</language>");
  expect(rss).toContain("เตรียมตัวลง CTF ครั้งแรก");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<loc>https://watkorn.me/th/blogs/</loc>");
  expect(sitemap).toContain('hreflang="th" href="https://watkorn.me/th/"');
});

test("language switch keeps you on the same page, both ways", async ({ page }) => {
  await page.goto("/blogs/preparing-for-ctf");
  await page.locator(".lang-switch").click();
  await expect(page).toHaveURL(/\/th\/blogs\/preparing-for-ctf$/);
  await expect(page.locator("h1")).toHaveText("เตรียมตัวลง CTF ครั้งแรก");
  await expect(page.locator(".markdown")).toContainText("การแข่ง Capture The Flag");
  await expect(page.locator("html")).toHaveAttribute("lang", "th");

  await page.locator(".lang-switch").click();
  await expect(page).toHaveURL(/\/blogs\/preparing-for-ctf$/);
  await expect(page.locator("h1")).toHaveText("Preparing for CTF");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the choice is remembered: opening / goes to /th/", async ({ page }) => {
  await page.goto("/blogs");
  await page.locator(".lang-switch").click();
  await expect(page).toHaveURL(/\/th\/blogs/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/th\/$/);
  await expect(page.locator("h1")).toContainText("หา flag");
});

test.describe("a Thai browser", () => {
  test.use({ locale: "th-TH" });
  test("lands on /th/ from the home page only", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/th\/$/);
    await page.goto("/blogs/");
    await expect(page).toHaveURL(/\/blogs\/$/); // shared links open in the language they point to
  });
});

test("Thai terminal: hints in Thai, navigation stays under /th", async ({ page }) => {
  await page.goto("/th/");
  const input = page.locator("#terminal-input");
  await expect(input).toBeVisible({ timeout: 10_000 });
  await input.fill("hint");
  await input.press("Enter");
  await expect(page.locator(".terminal__out").last()).toContainText("ด่าน 1: วอร์มอัพ");
  await input.fill("cd achievements");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/th\/achievements$/);
  await expect(page.locator("h1")).toHaveText("ความสำเร็จ");
});
