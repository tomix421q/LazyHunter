import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'@/*': './path/to/lib/*',
			'@server': '../server/src',
			'@prisma': '../server/prisma/generated/prisma'
		}
	}
};

export default config;
