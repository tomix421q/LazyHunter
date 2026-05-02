import { error as svelteError, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { openapi } from '$lib/api/openapiClient';

export const load = (async ({ request }) => {
	const { data, error, response } = await openapi.GET('/api/list/all', {
		headers: {
			Cookie: request.headers.get('cookie') ?? ''
		}
	});
	if (error) {
		if (response.status === 401) {
			redirect(302, '/user');
		}
		throw svelteError(response.status, {
			message: error.error + `(${error.details})` || 'Nepodarilo sa načítať zoznamy'
		});
	}

	return { lists: data };
}) satisfies PageServerLoad;

// Actions
export const actions = {
	removeProduct: async ({ request, fetch }) => {
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
				message: error.error + ` (${error.details})` || 'Server vrátil chybu.'
			});
		}
		return { success: true, message: data.message || 'Úspešne vymazaný! 🚀' };
	}
} satisfies Actions;
