import { ApiResponse, BaseTData, Category, ErrorData } from './types';
import { timeTravel } from './utils';

export type CachedFetchArgs = {
	key: string;
	endpoint: string | URL;
	init?: RequestInit;
};

export type CachedData = {
	data: unknown;
	expiresAt: Date;
};

const expirationTime = 15;

const cache = new Map<string, CachedData>();

export const apiFetch = async <TData extends BaseTData>({ key, endpoint, init }: CachedFetchArgs): Promise<ApiResponse<TData>> => {
	const url = new URL(endpoint, 'http://localhost/');
	url.port = '3000';

	try {
		const resp = await fetch(url, {
			...init,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...init?.headers,
			},
		});

		const data = await resp.json();

		if (!resp.ok) return { success: false, data };

		cache.set(key, { data, expiresAt: timeTravel({ minutes: expirationTime }) });
		return { success: true, data };
	} catch (error) {
		console.log('%c error', 'color: green', error);
		return { success: false, data: { type: 'Client Error', description: error ? JSON.stringify(error) : 'Unknown' } };
	}
};

const onGoingRequests = new Map<string, ReturnType<typeof apiFetch>>();
type foo = Promise<ApiResponse<Category> & {
	loading: boolean
}> 

const bar = {} as Awaited<foo>


export const cachedFetch = async <TData extends BaseTData>({ key, endpoint, init }: CachedFetchArgs): Promise<ApiResponse<TData>> => {
	// check for cached data
	if (cache.has(key)) {
		const cachedData = cache.get(key)!;
		if (cachedData.expiresAt >= new Date()) cache.delete(key);
		else
			return {
				success: true,
				data: cachedData.data as TData,
			};
	}

	// dedup requests
	const requestID = JSON.stringify({ key, endpoint, init });

	if (onGoingRequests.has(requestID)) return onGoingRequests.get(requestID) as unknown as Promise<ApiResponse<TData>>;

	const apiResponse = apiFetch<TData>({ key, endpoint, init });
	onGoingRequests.set(requestID, apiResponse);
	const awaitedApiResponse = await apiResponse;
	onGoingRequests.delete(requestID);

	return awaitedApiResponse;
};

// (async () => {
// 	const foo = await cachedFetch<Category>({ endpoint: '/categories', key: 'categories' });
// 	if (!foo.success) {
// 		foo.data.type === 'Validation Error' ? foo.data.fieldErrors.
// 	}
	
// })();