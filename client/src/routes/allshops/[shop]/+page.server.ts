import { api } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, params }) => {
	let store;
	if (params.shop !== 'all') {
		store = params.shop.toUpperCase();
	}

	const pageStr = url.searchParams.get('page') || '1';
	const searchStr = url.searchParams.get('search') || '';

	try {
		const response = await api.api.products.$get({
			query: { store: store, page: pageStr, search: searchStr }
		});
		const result = await response.json();

		return { productsResponse: result, searchQuery: searchStr };
	} catch (error) {
		console.log('Chyba pri nacitavani produktov', error);
		return {
			productsResponse: {
				ok: false as const,
				error: `Problém s API: ${error}`
			}
		};
	}
}) satisfies PageServerLoad;
