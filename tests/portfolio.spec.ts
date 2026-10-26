import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

const cv = 'https://res.cloudinary.com/duemlwqqt/image/upload/v1791067842/CV%20Alvaro%20Rivas.pdf';
const cvDownload = cv.replace('/upload/', '/upload/fl_attachment:Alvaro-Rivas-CV/');
const excluded = /australia|relocat|sponsor|(?:twitter\.com|x\.com)\/arialdev|twitter:(?:site|creator)/i;

async function openSection(page: Page, name: 'Home' | 'About' | 'Projects' | 'Contact') {
  await page.getByLabel('Navigation menu', { exact: true }).click();
  await page.getByRole('navigation', { name: 'Primary', exact: true }).getByRole('link', { name, exact: true }).click();
  await expect(page.locator(`#${name.toLowerCase()}`)).toBeVisible();
  await expect(page.locator('main')).toHaveCSS('opacity', '1');
}

test('static HTML, metadata, and public destinations are correct', async ({ request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('Álvaro Rivas');
  for (const content of ['Nexthink', 'Sotec Consulting', 'Alfonso X', 'SRE Agent', 'Vocabulaire', 'Awards Predictions']) expect(html).toContain(content);
  expect(html).toContain(cvDownload);
  expect(html).toContain('https://github.com/arialdev');
  expect(html).toContain('https://www.linkedin.com/in/alvaro-rivas');
  expect(html).toContain('https://blog.arial.dev/');
  expect(html).toContain('mailto:contact@arial.dev');
  expect(html).not.toContain('alvarorial@proton.me');
  expect(html).not.toContain('id="blog"');
  expect(html).not.toContain('Find an article');
  expect(html).not.toContain('<footer');
  expect(html).not.toMatch(/Spanish: native|English: fluent|French: basic/);
  expect(html).not.toMatch(excluded);
  expect(html).toMatch(/rel="canonical" href="https:\/\/alvarorivas.dev\/"/);
  expect(html).toContain('application/ld+json');
  const structured = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  expect(JSON.parse(structured ?? '{}')).toMatchObject({ '@type': 'ProfilePage', mainEntity: { name: 'Álvaro Rivas', email: 'contact@arial.dev', sameAs: ['https://github.com/arialdev', 'https://www.linkedin.com/in/alvaro-rivas', 'https://blog.arial.dev/'] } });
  const preview = await request.get('/social-preview.png');
  expect(preview.ok()).toBe(true);
  const previewBytes = await preview.body();
  expect([previewBytes.readUInt32BE(16), previewBytes.readUInt32BE(20)]).toEqual([1200, 630]);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('<loc>https://alvarorivas.dev/</loc>');
  expect(sitemap).not.toMatch(/404|#(?:about|projects)/);
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap: https://alvarorivas.dev/sitemap.xml');
});

test('subtitle types and erases all phrases and keeps its layout and accessible text stable', async ({ page }) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const role = page.locator('.typing-role');
  const text = role.locator('[data-role-text]');
  await expect(role).toHaveAttribute('data-state', 'running');
  const actions = await page.locator('.home-actions').boundingBox();
  await page.clock.runFor(2200);
  const erased = await text.innerText();
  expect(erased.length).toBeGreaterThan(0);
  expect(erased.length).toBeLessThan('Senior Software Engineer'.length);
  expect('Senior Software Engineer'.startsWith(erased)).toBe(true);
  await expect(role.getByRole('button')).toHaveCount(0);
  await page.evaluate(() => {
    const role = document.querySelector<HTMLElement>('.typing-role')!;
    const phrases = JSON.parse(role.dataset.phrases!) as { article: string; text: string }[];
    const seen = new Set<string>();
    new MutationObserver(() => {
      const text = role.querySelector('[data-role-text]')!.textContent;
      const article = role.querySelector('[data-role-article]')!.textContent;
      if (phrases.some((phrase) => phrase.text === text)) seen.add(`${article} ${text}`);
      role.dataset.seen = JSON.stringify([...seen]);
    }).observe(role.querySelector('[data-role-text]')!, { childList: true });
  });
  await page.clock.runFor(45000);
  const seen = JSON.parse(await role.getAttribute('data-seen') ?? '[]');
  expect(seen).toEqual(expect.arrayContaining([
    'a Senior Software Engineer', 'a Microfrontends Expert', 'a Module Federation Master',
    'an Engineering Enthusiast', 'a Clean Design Lover', 'a Distributed Systems Builder', 'a React Sailor',
  ]));
  await expect(role.locator('.sr-only')).toHaveText('I am a Senior Software Engineer.');
  await expect(role.locator('.role-line')).toHaveAttribute('aria-hidden', 'true');
  expect((await page.locator('.home-actions').boundingBox())?.y).toBe(actions?.y);
  await openSection(page, 'About');
  const hiddenText = await text.textContent();
  await page.clock.runFor(10000);
  await expect(text).toHaveText(hiddenText ?? '');
  await expect(role).toHaveAttribute('data-state', 'paused');
  await openSection(page, 'Home');
  await expect(role).toHaveAttribute('data-state', 'running');
});

test('subtitle remains static with reduced motion, including preference changes', async ({ page }) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const text = page.locator('[data-role-text]');
  await expect(page.locator('.typing-role')).toHaveAttribute('data-state', 'paused');
  await page.clock.runFor(10000);
  await expect(text).toHaveText('Senior Software Engineer');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.typing-role')).toHaveAttribute('data-state', 'running');
  await page.clock.runFor(2200);
  await expect(text).not.toHaveText('Senior Software Engineer');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.typing-role')).toHaveAttribute('data-state', 'paused');
  await page.clock.runFor(10000);
  await expect(text).toHaveText('Senior Software Engineer');
});

test('portrait follows the pointer in every direction and respects reduced motion and touch', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const surface = page.locator('[data-portrait-hover]');
  const portrait = page.locator('.portrait-circle');
  const bounds = await surface.boundingBox();
  if (!bounds) throw new Error('The home portrait must be visible.');
  const actions = await page.locator('.home-actions').boundingBox();
  if (isMobile) {
    await page.mouse.move(bounds.x + bounds.width * .7, bounds.y + bounds.height * .3);
    await expect(portrait).toHaveCSS('transform', 'none');
    await expect(page.locator('.hero-photo')).toHaveCSS('transform', 'matrix(2, 0, 0, 2, 0, 0)');
    return;
  }
  for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    await page.mouse.move(bounds.x + bounds.width * (.5 + x * .2), bounds.y + bounds.height * (.5 + y * .2));
    await expect.poll(() => portrait.evaluate((element, direction) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
      return matrix.m13 * direction.x < -.01 && matrix.m23 * direction.y < -.01;
    }, { x, y })).toBe(true);
  }
  expect((await page.locator('.home-actions').boundingBox())?.y).toBe(actions?.y);
  await page.mouse.move(0, 0);
  await expect(portrait).toHaveCSS('transform', 'none');
  await page.mouse.move(bounds.x + bounds.width * .7, bounds.y + bounds.height * .3);
  await expect(portrait).not.toHaveCSS('transform', 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(portrait).toHaveCSS('transform', 'none');
  await expect(page.locator('.hero-photo')).toHaveCSS('transform', 'matrix(2, 0, 0, 2, 0, 0)');
});

test('islands hydrate without errors and support keyboard interactions', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#experience');
  const experience = page.getByRole('tab', { name: 'Experience' });
  await expect(experience).toBeVisible();
  await experience.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Education' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Education' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('MSc in Artificial Intelligence');
  await page.keyboard.press('Home');
  await expect(experience).toBeFocused();
  await expect(page.getByRole('tabpanel')).toContainText('Nexthink');
  await openSection(page, 'Projects');
  const trigger = page.getByRole('button', { name: 'View project: SRE Agent' });
  await expect(trigger).toHaveClass('project-image-button');
  await expect(page.getByRole('button', { name: 'View project', exact: true })).toHaveCount(0);
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'SRE Agent' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close project details' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('link', { name: 'Visit SRE Agent' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close project details' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  for (const name of ['Vocabulaire', 'Awards Predictions']) {
    const image = page.getByRole('button', { name: `View project: ${name}` });
    await image.focus();
    await page.keyboard.press('Space');
    await expect(page.getByRole('dialog', { name, exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(image).toBeFocused();
  }
  expect(errors).toEqual([]);
});

test('overlay navigation supports Escape, selection, and browser history', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#home')).toBeVisible();
  await expect(page.locator('#about')).not.toBeVisible();
  const toggle = page.getByLabel('Navigation menu', { exact: true });
  await toggle.click();
  await expect(page.getByRole('navigation', { name: 'Primary', exact: true })).toBeVisible();
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('navigation', { name: 'Primary', exact: true })).not.toBeVisible();
  await toggle.click();
  await page.getByRole('navigation', { name: 'Primary', exact: true }).getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('.site-menu')).not.toHaveAttribute('open', '');
  await expect(page.locator('#projects')).toBeFocused();
  await expect(page.locator('#home')).not.toBeVisible();
  await page.goBack();
  await expect(page.locator('#home')).toBeVisible();
  await page.goForward();
  await expect(page.locator('#projects')).toBeVisible();
  await openSection(page, 'About');
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page.locator('#about')).toBeVisible();
  // A pending view update must not steal focus after a skip-link activation.
  await page.evaluate(() => {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    document.querySelector<HTMLAnchorElement>('.skip-link')!.click();
    return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  });
  await expect(page.locator('main')).toBeFocused();
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 20));
  await page.reload();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('works without JavaScript, including both histories and project details', async ({ browser, baseURL, isMobile }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: isMobile ? 390 : 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(baseURL ?? 'http://127.0.0.1:4321');
  await expect(page.locator('[data-role-text]')).toHaveText('Senior Software Engineer');
  await expect(page.getByText('Nexthink', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'MSc in Artificial Intelligence' })).toBeVisible();
  await expect(page.getByRole('tab')).toHaveCount(0);
  await expect(page.locator('.project-image-button')).toHaveCount(0);
  const details = page.locator('.project-fallback').first();
  await details.getByText('Project details', { exact: true }).click();
  await expect(details).toContainText(/master’s thesis/i);
  await expect(page.locator('.article-row')).toHaveCount(0);
  await expect(page.locator('#contact a[href^="mailto:"]')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Say hello!' })).toHaveAttribute('href', 'mailto:contact@arial.dev');
  await expect(page.locator('#about .about-location')).toHaveText('Based in Madrid, Spain');
  const download = page.getByRole('link', { name: 'Download CV PDF' });
  await expect(download).toHaveAttribute('href', cvDownload);
  await expect(download).toHaveAttribute('download', 'Alvaro-Rivas-CV.pdf');
  await context.close();
});

test('transitions handle menu reversals, interrupted navigation, and repeated Home selections', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const toggle = page.getByLabel('Navigation menu', { exact: true });
  const menu = page.locator('.site-menu');
  const nav = page.getByRole('navigation', { name: 'Primary', exact: true });
  await toggle.click();
  await expect(nav).toBeVisible();
  // Reverse the closing animation before it can hide the newly reopened menu.
  await toggle.evaluate((element) => {
    if (element instanceof HTMLElement) { element.click(); element.click(); }
  });
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  await expect(nav).toHaveCSS('opacity', '1');
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(page.locator('main')).toHaveCSS('opacity', '1');

  await page.getByRole('link', { name: 'About me!', exact: true }).click();
  await page.getByRole('link', { name: 'Álvaro Rivas home', exact: true }).click();
  await expect(page.locator('#home')).toBeFocused();
  await expect(page.locator('#about')).not.toBeVisible();
  await openSection(page, 'Home');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(page.locator('#home')).toBeFocused();
  await expect(page.locator('main')).not.toHaveAttribute('inert', '');

  // Skip to content while the outgoing panel is still fading.
  await page.evaluate(() => {
    document.querySelector<HTMLAnchorElement>('.home-actions a')!.click();
    document.querySelector<HTMLAnchorElement>('.skip-link')!.click();
  });
  await expect(page.locator('#about')).toBeVisible();
  await expect(page.locator('main')).toBeFocused();
  await expect(page.locator('#about')).toHaveCSS('opacity', '1');
  expect(errors).toEqual([]);
});

test('navigation is immediate with reduced motion and settles when the preference changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const result = await page.evaluate(() => {
    document.querySelector<HTMLAnchorElement>('.home-actions a')!.click();
    return { view: document.documentElement.dataset.view, focus: document.activeElement?.id, animations: document.getAnimations().length };
  });
  expect(result).toEqual({ view: 'about', focus: 'about', animations: 0 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByLabel('Navigation menu', { exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByLabel('Navigation menu', { exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('.site-menu')).not.toHaveAttribute('open', '');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('.home-control').click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#home')).toBeVisible();
  await expect(page.locator('#home')).toBeFocused();
  await expect(page.locator('#home')).toHaveCSS('opacity', '1');
});

test('every section, menu, and project dialog pass automated accessibility checks', async ({ page }) => {
  await page.goto('/');
  for (const name of ['Home', 'About', 'Contact', 'Projects'] as const) {
    if (name !== 'Home') await openSection(page, name);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']).analyze();
    expect(result.violations, `${name} accessibility`).toEqual([]);
  }
  await expect(page.getByRole('button', { name: 'View project: SRE Agent' })).toBeVisible();
  await page.locator('.project-image').first().click();
  const modal = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']).analyze();
  expect(modal.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.getByLabel('Navigation menu', { exact: true }).click();
  const menu = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']).analyze();
  expect(menu.violations).toEqual([]);
});

test('narrow layouts, enlarged text, and reduced motion remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    for (const name of ['Home', 'About', 'Projects', 'Contact'] as const) {
      if (name !== 'Home') await openSection(page, name);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name} at ${width}px`).toBe(true);
    }
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 200%; } .view-panel { backdrop-filter: none; background: #e1e5e5; }' });
  for (const name of ['Home', 'About', 'Projects', 'Contact'] as const) {
    if (name !== 'Home') await openSection(page, name);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name} with enlarged text`).toBe(true);
  }
});

test('404 offers a useful return path and is not indexed', async ({ request }) => {
  const response = await request.get('/404.html');
  const html = await response.text();
  expect(html).toContain('noindex, follow');
  expect(html).toContain('Back to the portfolio');
});
