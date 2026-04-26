import type { Handle } from '@sveltejs/kit';
import app from '../../server/src/index';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api')) {
		return app.fetch(event.request);
	}

	// Ak to nie je /api, SvelteKit normálne načíta webovú stránku
	return resolve(event);
};
