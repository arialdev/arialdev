import { expect, test } from '@playwright/test';

test.describe('mobile version of nav', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('menu icon is shown on mobile', async ({ page, isMobile }) => {
		if (isMobile) {
			const burgerMenu = page.locator('#astronav-menu');
			await expect(burgerMenu).toBeVisible();
			await burgerMenu.click();
			await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
		}
	});
});

test.describe('ui test', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('website is shown correctly', async ({ page }) => {
		await expect(page).toHaveURL('http://127.0.0.1:3000/');
		await expect(page).toHaveTitle(/Álvaro Rivas/);
		const metaDescription = page.locator("meta[name='description']");
		await expect(metaDescription).toHaveAttribute(
			'content',
			"Welcome to Álvaro Rivas' personal website. Here you can know who I am and what do I do."
		);
		const html = page.locator('html');
		await expect(html).toHaveClass(/scroll-smooth/);
		await expect(page.getByTestId('hero')).toBeVisible();
		await expect(page.getByTestId('about')).toBeVisible();
		await expect(page.getByTestId('about').locator('p').last()).toContainText(
			'preferences: the JavaScript ecosystem, microservices/microfrontends architectures and software quality'
		);
		await expect(page.getByTestId('projects')).toBeVisible();
		await expect(page.getByTestId('contact')).toBeVisible();
		await expect(page.getByTestId('footer')).toBeVisible();
		const projectImage = page.getByTestId('card').first().locator('img');
		await projectImage.scrollIntoViewIfNeeded();
		await expect.poll(() => projectImage.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
	});

	test('navbar is shown correctly and working on desktop', async ({ page, isMobile }) => {
		const header = page.getByTestId('header');
		if (!isMobile) {
			await expect(header).toBeVisible();
			await header.getByText('About').click();
			await expect(page).toHaveURL('http://127.0.0.1:3000/#about');
			await header.getByText('Projects').click();
			await expect(page).toHaveURL('http://127.0.0.1:3000/#projects');
			await header.getByText('Contact').click();
			await expect(page).toHaveURL('http://127.0.0.1:3000/#contact');
		}
	});
});

test.describe('testing button functionalities', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('back to top button is working', async ({ page }) => {
		const scrollY = await page.evaluate(() => document.documentElement.scrollHeight);
		await page.evaluate(() => {
			window.scrollTo(0, scrollY);
		});
		await page.getByTestId('back-to-top-button').click();
		await page.evaluate(() => {
			window.scrollTo(0, 0);
		});
	});

	test('toggle theme button is working', async ({ page, isMobile }) => {
		if (!isMobile) {
			await page.getByTestId('theme-switch').click();
			await expect(page.locator('html')).toHaveClass(/dark/);
			await page.evaluate(() => {
				window.localStorage.setItem('theme', 'dark');
			});
			await page.getByTestId('theme-switch').click();
			await expect(page.locator('html')).not.toHaveClass(/dark/);
			await page.evaluate(() => {
				window.localStorage.removeItem('theme');
			});
		}
	});
});

test.describe('hover effect on cards', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('hover effect on cards is working', async ({ page }) => {
		await page.getByTestId('card').first().hover();
		await expect(page.locator('article').first()).toHaveClass(
			'rounded-xl bg-white p-3 shadow-lg duration-100 hover:scale-105 hover:transform hover:shadow-xl'
		);
	});
});
