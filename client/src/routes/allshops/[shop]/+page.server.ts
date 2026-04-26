import { api } from '$lib/api';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { ListType } from '../../../../../server/src/schemas/schemaList';

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

export const actions = {
	addToList: async ({ request, fetch: svelteFetch }) => {
		const formData = await request.formData();
		const productId = Number(formData.get('productId'));
		const listType = String(formData.get('listType')) as ListType;

		if (!productId || !listType) {
			return fail(400, { message: 'Chýba ID produktu alebo typ zoznamu.' });
		}

		try {
			const res = await svelteFetch(`${PUBLIC_API_URL}/api/list/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Cookie: request.headers.get('cookie') ?? ''
				},
				body: JSON.stringify({ productId, listType })
			});

			if (!res.ok) {
				return fail(res.status, { message: 'Nepodarilo sa pridať položku do zoznamu.' });
			}

			const resultData = await res.json();
			return {
				success: true,
				message: 'Úspešne pridané! 🚀',
				item: resultData.data
			};
		} catch (error) {
			console.error('Chyba pri volani servera', error);
			return fail(500, { message: 'Interná chyba pri spojení so serverom.' });
		}
	},
	removeProduct: async ({ request, fetch }) => {
		const formData = await request.formData();
		const productId = formData.get('productId');

		if (!productId) {
			return fail(400, { message: 'Chýba ID produktu' });
		}
		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/list/remove/${productId}`, {
				method: 'DELETE',
				headers: {
					Cookie: request.headers.get('cookie') ?? '',
					'Cache-Control': 'no-cache'
				},
				body: JSON.stringify({ productId })
			});

			if (!res.ok) {
				return { success: false, message: 'Nepodarilo sa vymazať produkt' };
			}
			return {
				success: true,
				removed: true,
				message: 'Produkt bol úspešne vymazaný zo zoznamu.🧹'
			};
		} catch (error) {
			console.error('Chyba pri volani servera', error);
			return fail(500, { message: 'Interná chyba pri spojení so serverom.' });
		}
	}
} satisfies Actions;
