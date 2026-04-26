import { api, type ItemsListResponse, type ListResponse } from '$lib/api';
import type { LayoutServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';

export const load = (async ({ request, fetch }) => {
	try {
		const response = await api.api.availableStores.$get();
		const result = await response.json();

		const userListPromise = fetch(`${PUBLIC_API_URL}/api/list/all`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Cookie: request.headers.get('cookie') ?? ''
			}
		}).then(async (res) => {
			if (res.status === 401) return;
			if (!res.ok) throw new Error('Nepodarilo sa načítať zoznamy');

			const result = await res.json();
			if (!result.ok) throw new Error(result.error || 'Chyba dát');
			const mergedUserList = result.data.flatMap((list: any) => list.items);

			return mergedUserList as ItemsListResponse['items'];
		});

		return { stores: result, lazy: { userProductsList: userListPromise } };
	} catch (error) {
		console.log('Chyba pri nacitavani produktov', error);
		return {
			stores: []
		};
	}
}) satisfies LayoutServerLoad;
