import { PUBLIC_API_URL } from '$env/static/public';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ListResponse } from '$lib/api';

export const load = (async ({ fetch, request }) => {
	const res = await fetch(`${PUBLIC_API_URL}/api/list/all`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Cookie: request.headers.get('cookie') ?? ''
		}
	});
	let result;
	try {
		result = await res.json();
	} catch (e) {
		throw error(500, 'Server vrátil neplatný formát dát');
	}
	if (res.status === 401) {
		redirect(302, '/user');
	}
	if (!res.ok) {
		throw error(res.status, result.message || 'Nepodarilo sa načítať zoznamy');
	}

	if (!result.ok) {
		throw error(res.status, result.error);
	}

	return { lists: result as ListResponse };
}) satisfies PageServerLoad;

// Actions
export const actions = {
	removeProduct: async ({ request, fetch }) => {
		const formData = await request.formData();
		const productId = formData.get('productId');
		console.log(productId);
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
			return { success: true };
		} catch (error) {
			console.error('Chyba pri volani servera', error);
			return fail(500, { message: 'Interná chyba pri spojení so serverom.' });
		}
	}
} satisfies Actions;
