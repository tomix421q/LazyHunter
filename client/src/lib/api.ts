import { PUBLIC_API_URL } from '$env/static/public';
import type { AppType } from './../../../server/src/index';
import { hc, type InferResponseType } from 'hono/client';

export const api = hc<AppType>(PUBLIC_API_URL, {
	init: {
		credentials: 'include'
	}
});

export type ProductsResponse = InferResponseType<typeof api.api.products.$get>;
export type ProductItem = Extract<ProductsResponse, { ok: true }>['data'][number];
export type MetaProduct = Extract<ProductsResponse, { ok: true }>['meta'];
export type ListResponse = InferResponseType<typeof api.api.list.all.$get>;
export type ItemsListResponse = Extract<ListResponse, { ok: true }>['data'][number];
export type ListItem = ItemsListResponse['items'][number];
