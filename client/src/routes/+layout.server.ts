import { api } from '$lib/api';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	try {
		const response = await api.api.availableStores.$get();
		const result = await response.json();

		return { stores: result };
	} catch (error) {
		console.log('Chyba pri nacitavani produktov', error);
		return {
			stores: []
		};
	}
}) satisfies LayoutServerLoad;
