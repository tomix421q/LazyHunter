import type { paths } from '$lib/api/apiSchema';

export type AddListRequestBody = NonNullable<
	paths['/api/list/add']['post']['requestBody']
>['content']['application/json'];

export type ListType = NonNullable<AddListRequestBody['listType']>;
