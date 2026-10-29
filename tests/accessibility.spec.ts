import { expect, test } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { renderedContrast } from "./rendered-contrast";

test("text over glass keeps sufficient contrast across views and scroll positions", async ({
  page,
  isMobile,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const measurements = [];
  for (const view of ["home", "about", "projects", "contact"]) {
    await page.goto(`/#${view}`);
    await expect(page.locator(`#${view}`)).toBeVisible();
    if (view === "about") {
      await page.locator("#experience").scrollIntoViewIfNeeded();
      await expect(page.getByRole("tab", { name: "Experience" })).toBeVisible();
    }
    if (view === "projects")
      await expect(page.getByRole("button", { name: "View project: SRE Agent" })).toBeVisible();
    await page.evaluate(() => document.fonts.ready.then(() => {}));
    const { maximum, step } = await page.evaluate(() => ({
      maximum: document.documentElement.scrollHeight - innerHeight,
      step: Math.floor(innerHeight * 0.75),
    }));
    for (let top = 0; ; top = Math.min(maximum, top + step)) {
      await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), top);
      const samples = await renderedContrast(page);
      measurements.push({ view, top, samples });
      expect(
        samples.filter(({ minimum, threshold }) => minimum < threshold),
        `${view}, scroll ${top}`,
      ).toEqual([]);
      if (top >= maximum) break;
    }
  }
  await page.goto("/#home");
  await page.getByLabel("Navigation menu", { exact: true }).click();
  const menu = await renderedContrast(page);
  expect(menu.filter(({ minimum, threshold }) => minimum < threshold)).toEqual([]);
  measurements.push({ view: "menu", top: 0, samples: menu });
  await page
    .getByRole("navigation", { name: "Primary", exact: true })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await page.getByRole("button", { name: "View project: SRE Agent" }).click();
  await expect(page.getByRole("dialog", { name: "SRE Agent", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close project details" })).toBeFocused();
  const dialog = await renderedContrast(page);
  expect(dialog.filter(({ minimum, threshold }) => minimum < threshold)).toEqual([]);
  measurements.push({ view: "dialog", top: 0, samples: dialog });
  await page.keyboard.press("Escape");
  if (!isMobile) {
    await page.getByRole("link", { name: "View all projects", exact: true }).hover();
    const hover = await renderedContrast(page);
    expect(hover.filter(({ minimum, threshold }) => minimum < threshold)).toEqual([]);
    measurements.push({ view: "hover", top: 0, samples: hover });
  }
  await writeFile(testInfo.outputPath("contrast.json"), JSON.stringify(measurements, null, 2));
});
