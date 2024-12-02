import { ApiResponse, BaseTData } from './types';
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
		// console.log('%c error', 'color: green', error);
		return { success: false, data: { type: 'Client Error', description: error ? JSON.stringify(error) : 'Unknown' } };
	}
};

const onGoingRequests = new Map<string, ReturnType<typeof apiFetch>>();

export const cachedFetch = async <TData extends BaseTData>({ key, endpoint, init }: CachedFetchArgs): Promise<ApiResponse<TData>> => {
	// check for cached data
	if (cache.has(key)) {
		const cachedData = cache.get(key)!;
		if (new Date() >= cachedData.expiresAt) cache.delete(key);
		else
			return {
				success: true,
				data: cachedData.data as TData[],
			};
	}

	// dedup requests
	// console.log('%c onGoingRequests inicial: ', 'color: green', ...onGoingRequests.entries())
	const requestID = JSON.stringify({ key, endpoint, init });
	// console.log('%c requestID', 'color: green', requestID);
	// console.log('%c onGoingRequests.has(requestID)', 'color: green', onGoingRequests.has(requestID))
	if (onGoingRequests.has(requestID)) return onGoingRequests.get(requestID) as unknown as Promise<ApiResponse<TData>>;
	// console.log('%c Passou do dedup', 'color: yellow')

	const apiResponse = apiFetch<TData>({ key, endpoint, init });
	// console.log('%c Iniciou o request', 'color: yellow')
	onGoingRequests.set(requestID, apiResponse);
	// console.log('%c onGoingRequests depois do set: ', 'color: green', ...onGoingRequests.entries())
	// console.log('%c Request adicionado a lista', 'color: yellow')
	const awaitedApiResponse = await apiResponse;
	// console.log('%c Request terminado', 'color: green')
	onGoingRequests.delete(requestID);
	// console.log('%c onGoingRequests depois do delete: ', 'color: green', ...onGoingRequests.entries())
	// console.log('%c Request eliminado da lista', 'color: green')
	return awaitedApiResponse;
};
