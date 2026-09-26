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
  await expect(page.locator(".ach-score")).toContainText("30/360 pts");
});

test("blog post is prerendered with SEO tags (no JS needed)", async ({ request }) => {
  const res = await request.get("/blogs/preparing-for-ctf/");
  expect(res.ok()).toBe(true);
  const html = await res.text();
  expect(html).toContain("<title");
  expect(html).toContain("Preparing for CTF");
  expect(html).toContain('property="og:title"');
  expect(html).toContain('rel="canonical"');
  expect(html).toContain('property="og:image" content="https://watkorn.me/og/blogs/preparing-for-ctf.png"');
  expect(html).toContain("Capture The Flag (CTF) competitions");
  expect(html).toContain('http-equiv="Content-Security-Policy"');
});

test("feeds and robots exist", async ({ request }) => {
  for (const path of [
    "/rss.xml",
    "/sitemap.xml",
    "/robots.txt",
    "/og.png",
    "/og/th.png",
    "/og/blogs/preparing-for-ctf.png",
    "/og/th/projects/thoth.png",
    "/.well-known/security.txt",
  ]) {
    expect((await request.get(path)).ok(), path).toBe(true);
  }
  expect(await (await request.get("/rss.xml")).text()).toContain("<item>");
  const securityTxt = await (await request.get("/.well-known/security.txt")).text();
  expect(securityTxt).toMatch(/^Contact: mailto:/m);
  expect(new Date(securityTxt.match(/^Expires: (.+)$/m)[1]).getTime()).toBeGreaterThan(Date.now());
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
  for (const path of [
    "/",
    "/blogs/",
    "/blogs/preparing-for-ctf/",
    "/projects/",
    "/achievements/",
    "/th/",
    "/th/blogs/mini-ctf-writeup/",
    "/y3t1-l41r/",
    "/404.html",
  ]) {
    await page.goto(path);
    await page.waitForTimeout(400);
  }
  expect(violations).toEqual([]);
});

test("projects: tag filter and tag links on a project page", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "#forensics" }).click();
  await expect(page).toHaveURL(/tag=forensics/);
  await expect(page.locator(".quest__title")).toHaveText(["Thoth"]);
  await page.getByRole("link", { name: /Thoth/ }).click();
  await expect(page.locator("h1")).toHaveText("Thoth");
  await page.locator(".post-head").getByRole("link", { name: "#security" }).click();
  await expect(page).toHaveURL(/\/projects\?tag=security/);
  await expect(page.locator(".quest")).toHaveCount(2);
});

test("no third-party requests: fonts and everything else are self-hosted", async ({ page, baseURL }) => {
  const external = [];
  page.on("request", (r) => {
    if (!r.url().startsWith(baseURL) && !r.url().startsWith("data:")) external.push(r.url());
  });
  for (const path of ["/", "/th/", "/blogs/preparing-for-ctf/"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
  }
  expect(external).toEqual([]);
  expect(await page.evaluate(() => document.fonts.check("700 16px Mali"))).toBe(true);
});

test("header fits at every width (nothing pushed off-screen)", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop", "sweeps its own viewport sizes");
  for (const width of [320, 360, 419, 420, 519, 520, 640, 759, 760, 1024]) {
    await page.setViewportSize({ width, height: 700 });
    for (const path of ["/", "/th/"]) {
      await page.goto(path);
      const right = await page.evaluate(() =>
        Math.max(
          ...[...document.querySelector(".site-header__inner").children]
            .filter((el) => el.offsetParent)
            .map((el) => el.getBoundingClientRect().right),
        ),
      );
      expect(right, `${path} at ${width}px`).toBeLessThanOrEqual(width);
      await expect(page.getByRole("switch")).toBeInViewport();
    }
  }
});

test("search: finds posts in both languages, highlights, and / opens it", async ({ page }) => {
  await page.goto("/blogs/");
  await page.keyboard.press("/");
  await expect(page).toHaveURL(/\/search\/?$/);
  const box = page.locator("#search-input");
  await expect(box).toBeFocused();
  await box.fill("robots");
  await expect(page).toHaveURL(/q=robots/);
  await expect(page.locator(".quest").first()).toContainText("mini CTF");
  await expect(page.locator(".quest mark").first()).toHaveText(/robots/i);

  await page.goto("/th/search?q=" + encodeURIComponent("ถอดรหัส"));
  await expect(page.locator(".search-status")).toContainText("พบ");
  await page.goto("/search?q=zzzznothing");
  await expect(page.locator(".search-status")).toContainText("Nothing matches");
});

test("posts: table of contents and # links to each section", async ({ page }) => {
  await page.goto("/blogs/mini-ctf-writeup/");
  const toc = page.locator(".toc");
  await expect(toc).toBeVisible();
  await toc.getByRole("link", { name: /Level 3/ }).click();
  await expect(page).toHaveURL(/#level-3-view-source-30-pts$/);
  await expect(page.locator("#level-3-view-source-30-pts")).toBeInViewport();

  await page.goto("/th/blogs/mini-ctf-writeup/#" + encodeURIComponent("ด่าน-4-สำหรับหุ่นยนต์เท่านั้น-40-แต้ม"));
  await expect(page.locator("h2", { hasText: "ด่าน 4" })).toBeInViewport();
});
