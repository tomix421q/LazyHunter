import { fail, redirect, error as svelteError, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { openapi } from '$lib/api/openapiClient';

export const load = (async ({ url, params }) => {
	let store;
	if (params.shop !== 'all') {
		store = params.shop.toUpperCase() as any;
	}

	const pageStr = url.searchParams.get('page') || '1';
	const searchStr = url.searchParams.get('search') || '';

	const { data, error, response } = await openapi.GET('/api/products', {
		params: {
			query: { store: store, page: pageStr, search: searchStr }
		}
	});

	if (error) {
		console.log(error.error + error.details);
		throw svelteError(response.status, {
			message: error.error + `(${error.details})` || 'Nepodarilo sa načítať produkty'
		});
	}

	return { productsResponse: data, searchQuery: searchStr };
}) satisfies PageServerLoad;

export const actions = {
	addToList: async ({ request }) => {
		const formData = await request.formData();
		const productId = Number(formData.get('productId'));
		const listType = String(formData.get('listType')) as any;

		if (!productId || !listType) {
			return fail(400, { message: 'Chýba ID produktu alebo typ zoznamu.' });
		}

		const { data, error, response } = await openapi.POST('/api/list/add', {
			body: {
				productId,
				listType
			},
			headers: {
				Cookie: request.headers.get('cookie') ?? ''
			}
		});

		if (error) {
			if (response.status === 401) {
				redirect(302, '/user');
			}
			return fail(response.status, {
				message: error.error || 'Server vrátil chybu.'
			});
		}
		return {
			success: true,
			message: data.message || 'Úspešne pridané! 🚀',
			item: data.data
		};
	},

	removeProduct: async ({ request }) => {
		const formData = await request.formData();
		const productId = String(formData.get('productId'));

		if (!productId) {
			return fail(400, { message: 'Chýba ID produktu' });
		}

		const { data, error, response } = await openapi.DELETE('/api/list/remove/{id}', {
			params: {
				path: {
					id: productId
				}
			},
			headers: {
				Cookie: request.headers.get('cookie') ?? ''
			}
		});

		if (error) {
			return fail(response.status, {
				message: error.error + `${error.details}` || 'Server vrátil chybu.'
			});
		}
		return {
			success: true,
			message: data.message || 'Úspešne vymazaný! 🚀'
		};
	}
} satisfies Actions;
