import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro'

// https://astro.build/config
export default defineConfig({
	vite: {
		logLevel: 'info',
		define: {
			__DATE__: `'${new Date().toISOString()}'`,
		},
	},
	integrations: [
		tailwind(),
		mdx(),
		image(),
		AstroPWA({
			mode: 'development',
			base: '/',
			scope: '/',
			includeAssets: ['favicon.svg'],
			selfDestroying: true,
			registerType: 'autoUpdate',
			manifest: {
				name: 'Terminal Portfolio by arialdev',
				short_name: 'Terminal',
			},
			workbox: {
				navigateFallback: '/404',
				globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
			},
		}),],
});
