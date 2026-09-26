import { test, expect } from "@playwright/test";

// ignore third-party noise (fonts can be blocked in sandboxes); everything else must be clean
const collectErrors = (page) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/fonts\.g|net::ERR_/.test(m.text() + (m.location()?.url || ""))) errors.push(m.text());
  });
  return errors;
};

const noHorizontalScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test("home: terminal runs commands and every line has a prompt", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/");
  const input = page.locator("#terminal-input");
  await expect(input).toBeVisible({ timeout: 10_000 });
  await input.fill("whoami");
  await input.press("Enter");
  await expect(page.locator(".terminal__entry").last()).toContainText("watkorn@me:~$");
  await expect(page.locator(".terminal__entry").last()).toContainText("Watcharakorn Khambung");
  await input.fill("wh");
  await input.press("Tab");
  await expect(input).toHaveValue("whoami");
  expect(await noHorizontalScroll(page)).toBe(true);
  expect(errors).toEqual([]);
});

test("ctf: warm-up flag unlocks, level 2 can be found and submitted", async ({ page }) => {
  await page.goto("/");
  const input = page.locator("#terminal-input");
  await expect(input).toBeVisible({ timeout: 10_000 });
  await input.fill("cat flag.txt");
  await input.press("Enter");
  await expect(page.locator(".achievement")).toContainText("Achievement unlocked");

  await input.fill("cd .secret");
  await input.press("Enter");
  await input.fill("cat note.b64");
  await input.press("Enter");
  const b64 = (await page.locator(".terminal__out").last().innerText()).trim();
  const flag = Buffer.from(b64, "base64").toString("utf8");
  await input.fill(`submit ${flag}`);
  await input.press("Enter");
  await expect(page.locator(".terminal__out").last()).toContainText("[+] correct!");
  await expect(page.locator(".terminal__line--input")).toContainText("watkorn@me:~/.secret$");

  await page.goto("/achievements");
  await expect(page.locator(".ach-score")).toContainText("30/150 pts");
});

test("blog post is prerendered with SEO tags (no JS needed)", async ({ request }) => {
  const res = await request.get("/blogs/preparing-for-ctf/");
  expect(res.ok()).toBe(true);
  const html = await res.text();
  expect(html).toContain("<title");
  expect(html).toContain("Preparing for CTF");
  expect(html).toContain('property="og:title"');
  expect(html).toContain('rel="canonical"');
  expect(html).toContain("Capture The Flag (CTF) competitions");
  expect(html).toContain('http-equiv="Content-Security-Policy"');
});

test("feeds and robots exist", async ({ request }) => {
  for (const path of ["/rss.xml", "/sitemap.xml", "/robots.txt", "/og.png"]) {
    expect((await request.get(path)).ok(), path).toBe(true);
  }
  expect(await (await request.get("/rss.xml")).text()).toContain("<item>");
});

test("blogs: list, filter and open a post", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/blogs");
  await page.getByRole("button", { name: "#ctf" }).click();
  await expect(page).toHaveURL(/tag=ctf/);
  await page.getByRole("link", { name: /Preparing for CTF/ }).click();
  await expect(page).toHaveURL(/\/blogs\/preparing-for-ctf/);
  await expect(page.locator(".markdown")).toContainText("Capture The Flag");
  expect(await noHorizontalScroll(page)).toBe(true);
  expect(errors).toEqual([]);
});

test("old #/ links redirect to the new URLs", async ({ page }) => {
  await page.goto("/#/blogs/preparing-for-ctf");
  await expect(page).toHaveURL(/\/blogs\/preparing-for-ctf$/);
  await expect(page.locator("h1")).toContainText("Preparing for CTF");
});

test("unknown pages show the 404 screen", async ({ page }) => {
  await page.goto("/definitely-not-here");
  await expect(page.getByText("GAME OVER")).toBeVisible();
});

test("theme toggle switches to dark and back", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("switch", { name: "Dark mode" });
  const before = await toggle.getAttribute("aria-checked");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", before === "true" ? "false" : "true");
});

test("no Content-Security-Policy violations on any page", async ({ page }) => {
  const violations = [];
  page.on("console", (m) => {
    if (/Refused to|Content Security Policy/i.test(m.text())) violations.push(`${page.url()}: ${m.text().slice(0, 140)}`);
  });
  for (const path of ["/", "/blogs/", "/blogs/preparing-for-ctf/", "/projects/", "/achievements/", "/y3t1-l41r/", "/404.html"]) {
    await page.goto(path);
    await page.waitForTimeout(400);
  }
  expect(violations).toEqual([]);
});
