import type { LayoutServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { openapi } from '$lib/api/openapiClient';
import { error as svelteError } from '@sveltejs/kit';

export const load = (async ({ request, fetch }) => {
	const { data, error } = await openapi.GET('/api/availablestores');
	if (error) {
		console.log(error.error + error.details);
		throw svelteError(500, {
			message: error.error + `(${error.details})` || 'Nepodarilo sa načítať dostupne obchody.'
		});
	}

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

		return mergedUserList;
	});

	return { stores: data, lazy: { userProductsList: userListPromise } };
}) satisfies LayoutServerLoad;
