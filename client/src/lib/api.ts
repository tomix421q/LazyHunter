import { PUBLIC_API_URL } from '$env/static/public';
import type { AppType } from './../../../server/src/index';
import { hc, type InferResponseType } from 'hono/client';

export const api = hc<AppType>(PUBLIC_API_URL);

export type ProductsResponse = InferResponseType<typeof api.api.products.$get>;
export type ProductItem = Extract<ProductsResponse, { ok: true }>['data'][number];
export type MetaProduct = Extract<ProductsResponse, { ok: true }>['meta'];
