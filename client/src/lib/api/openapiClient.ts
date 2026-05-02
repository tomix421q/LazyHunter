import { PUBLIC_API_URL } from '$env/static/public';
import createClient from 'openapi-fetch';
import type { paths } from './apiSchema';

export const openapi = createClient<paths>({
	baseUrl: PUBLIC_API_URL,
	credentials: 'include'
});
